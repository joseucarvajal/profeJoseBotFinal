import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import { EstadoGlobal, Asignatura, Constants, Horario, AsignaturasDeEstudiante } from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { InscribirAsignatura } from "../InscribirAsignatura/InscribirAsignaturaReceiver";

let dateFormat = require("dateformat");

export namespace RegistrarAsistencia {
  export namespace Comandos {
    export const SolicitarAsistenciaGPS = `SolicitarAsistenciaGPS`;

    export const SeleccionarComandoInline = `SeleccionarComandoInline`;
    export enum SeleccionarComandoInlineOptsEnum {
      SeleccionarAsignaturaByDefault = "✔️ Registrar asistencia",
      Volver = "🔙 Volver"
    }

    export enum SeleccionarAsignaturaAsistenciaOPts {
      SeleccionarAsignatura = "↗️ Seleccionar una asignatura"
    }
  }

  let nombreContexto = "RegistrarAsistenciaReceiver";
  export class RegistrarAsistenciaReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    seleccionarAsignaturaInlineOpts: Array<Array<KeyboardButton>> = [
      [
        {
          text:
            Comandos.SeleccionarComandoInlineOptsEnum
              .SeleccionarAsignaturaByDefault,
          request_location: true
        }
      ],
      [
        {
          text: Comandos.SeleccionarComandoInlineOptsEnum.Volver
        }
      ]
    ];

    seleccionarAsignaturaAsistenciaOPts: Array<Array<InlineKeyboardButton>> = [
      [
        {
          text:
            Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura,
          switch_inline_query_current_chat: ""
        }
      ]
    ];

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.registrarAsistencia = this.registrarAsistencia.bind(this);
      this.solicitarAsistenciaGPS = this.solicitarAsistenciaGPS.bind(this);
    }

    //#region public
    public registrarAsistencia(msg: Message & ApiMessage) {
      if (!this.validarQueEstudianteHayaIngresadoDatosBasicos(msg)) {
        return;
      }

      this.enviarOpcionesInscripcionAsignaturas();
    }

    public solicitarAsistenciaGPS(msg: Message & ApiMessage) {
      if (!this.validarQueEstudianteHayaIngresadoDatosBasicos(msg)) {
        return;
      }

      this.enviarOpcionesSeleccionAsignaturaParaRegistrarAsistencia(msg);
    }
    //#endregion

    //#region parent events

    protected onCallbackQuery(msg: Message & ApiMessage) {}

    protected onLocation(msg: Message & ApiMessage) {
      if (
        this.estaComandoEnContexto(
          Comandos.SeleccionarComandoInlineOptsEnum
            .SeleccionarAsignaturaByDefault
        )
      ) {
        this.guardarAsistencia(msg);
      }
    }

    protected onRecibirMensaje(msg: Message & ApiMessage) {
      if (
        this.estaOpcionSeleccionadaEnContexto(
          Comandos.SeleccionarComandoInlineOptsEnum.Volver,
          msg
        )
      ) {
        this.irAMenuPrincipal(msg);
      }
    }

    protected onRecibirInlineQuery(msg: Message & ApiMessage) {
      if (
        this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura
        )
      ) {
        this.enviarListaAsignaturasParaReportarAsistencia(msg);
      }
    }

    onChosenInlineResult(msg: ApiMessage & Message) {
      if (
        this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura
        )
      ) {
        this.guardarAsignaturaSeleccionadaTemporal(msg);
      }
    }

    //#endregion

    private guardarAsignaturaSeleccionadaTemporal(msg: ApiMessage & Message) {
      this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData = msg.result_id;
      Data.Estudiantes.actualizarChat(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante
      ).then(() => {
        Data.Asignacion.getAsignaturaByCodigo(
          this.estadoGlobal,
          msg.result_id
        ).then((asignatura: Asignatura) => {
          this.enviarOpcionRegistrarAsistenciaUnaAsignatura(
            msg,
            asignatura,
            new Date()
          );
        });
      });
    }

    private guardarAsistencia(msg: Message & ApiMessage) {
      Data.Asignacion.getAsignaturaByCodigo(
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData
      ).then((asignatura: Asignatura) => {
        if (!this.validarHorarioRegistroAsistencia(msg, asignatura)) {
          this.irAMenuPrincipal(msg);
          return;
        }

        if (!this.validarDistanciaRegistroAsistencia(msg, asignatura)) {
          return;
        }

        Data.Asignacion.registrarAsistencia(
          msg,
          this.estadoGlobal,
          this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData
        ).then(() => {
          this.botSender
            .responderMensajeHTML(
              msg,
              `✅ Has registrado asistencia con éxito.`
            )
            .then(() => {
              this.irAMenuPrincipal(msg);
            });
        });
      });
    }

    //true: es válido
    //false: no es válido
    private validarHorarioRegistroAsistencia(
      msg: Message & ApiMessage,
      asignatura: Asignatura
    ): boolean {
      let fechaHoy: any = new Date();
      let horario = this.getHorarioRegistroAsistencia(asignatura);
      if (!horario) {
        this.botSender.responderMensajeErrorHTML(
          msg,
          `Hoy no tienes ningún horario para registrar asistencia en ${
            asignatura.nombre
          }`
        );
        return false;
      }

      let horaHoy: any = dateFormat(fechaHoy, "HH:MM");

      let horaMinutosInicioClase = horario.horaInicio.split(":");
      let fechaHoraInicioClase: any = new Date();
      fechaHoraInicioClase.setHours(parseInt(horaMinutosInicioClase[0], 10));
      fechaHoraInicioClase.setMinutes(parseInt(horaMinutosInicioClase[1], 10));

      let horaMinutosFinClase = horario.horaFin.split(":");
      let fechaHoraFinClase: any = new Date();
      fechaHoraFinClase.setHours(parseInt(horaMinutosFinClase[0], 10));
      fechaHoraFinClase.setMinutes(parseInt(horaMinutosFinClase[1], 10));

      let horasDiferencia;

      if (horaHoy < horario.horaInicio) {
        horasDiferencia = Math.abs(fechaHoraInicioClase - fechaHoy) / 36e5;
        this.botSender
          .responderMensajeHTML(
            msg,
            `Son las <b>${horaHoy}</b> y la clase <b>${
              asignatura.nombre
            }</b> inicia en <b>${horasDiferencia.toFixed(
              2
            )} horas</b> aproximadamente. Aún es muy temprano para registrar asistencia.`
          )
          .then(() => {
            this.botSender.responderMensajeHTML(msg, `😅`);
          });
        return false;
      } else if (horaHoy > horario.horaFin) {
        horasDiferencia = Math.abs(fechaHoraFinClase - fechaHoy) / 36e5;
        this.botSender
          .responderMensajeHTML(
            msg,
            `Son las <b>${horaHoy}</b> y la clase <b>${
              asignatura.nombre
            }</b> terminó hace <b>${horasDiferencia.toFixed(
              2
            )} horas</b> aproximadamente. Ya es tarde para registrar asistencia.`
          )
          .then(() => {
            this.botSender.responderMensajeHTML(msg, `😢`);
          });
        return false;
      }

      return true;
    }

    private validarDistanciaRegistroAsistencia(
      msg: Message & ApiMessage,
      asignatura: Asignatura
    ) {
      let horario: Horario = this.getHorarioRegistroAsistencia(asignatura);
      let latitudLongitudHorario = horario.coordenadasAula.split(",");
      let latitudHorario = parseFloat(latitudLongitudHorario[0]);
      let longitudHorario = parseFloat(latitudLongitudHorario[1]);

      //Distancia en km
      let distanciaKm = this.distanciaEntreDosGeolocalizaciones(
        latitudHorario,
        longitudHorario,
        msg.location.latitude,
        msg.location.longitude,
        `K`
      );      

      if (
        distanciaKm <=
        this.estadoGlobal.settings.radioMaxDistanciaAsistenciaKm
      ) {
        return true;
      }

      this.botSender
        .responderMensajeHTML(
          msg,
          `No te encuentras cerca del salón de clases. La asistencia no ha sido registrada`
        )
        .then(() => {
          this.botSender.responderMensajeHTML(msg, `😞`);
        });

      return false;
    }

    private distanciaEntreDosGeolocalizaciones(
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
      unit: string
    ) {
      if (lat1 == lat2 && lon1 == lon2) {
        return 0;
      } else {
        let radlat1 = (Math.PI * lat1) / 180;
        let radlat2 = (Math.PI * lat2) / 180;
        let theta = lon1 - lon2;
        let radtheta = (Math.PI * theta) / 180;
        let dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
          dist = dist * 1.609344;
        }
        if (unit == "N") {
          dist = dist * 0.8684;
        }
        return dist;
      }
    }

    private getHorarioRegistroAsistencia(asignatura: Asignatura) {
      let horario;
      let fechaHoy: any = new Date();
      for (let codigoHorario in asignatura.horarios) {
        horario = asignatura.horarios[codigoHorario];
        if (Constants.DiasSemana.get(fechaHoy.getDay()) == horario.dia) {
          return horario;
        }
      }

      return {} as Horario;
    }

    private enviarOpcionesInscripcionAsignaturas() {
      this.enviarMensajeAReceiver(
        this.indexMain.inscribirAsignaturaReceiver,
        this.indexMain.inscribirAsignaturaReceiver
          .enviarOpcionSeleccionarAsignaturas,
        this.message as Message & ApiMessage,
        InscribirAsignatura.Comandos.InscripcionAsignaturas
      );
    }

    private enviarOpcionesSeleccionAsignaturaParaRegistrarAsistencia(
      msg: Message & ApiMessage
    ) {
      let fechaHoy = new Date();

      this.getAsignaturasAsistenciaHoy(msg).then(
        (listadoAsignaturasDeEstudianteHoy: Array<Asignatura>) => {
          if (listadoAsignaturasDeEstudianteHoy.length == 0) {
            this.enviarOpcionesRegistrarAsistenciaNoAsignaturas(msg);
          } else if (listadoAsignaturasDeEstudianteHoy.length == 1) {
            this.enviarOpcionRegistrarAsistenciaUnaAsignatura(
              msg,
              listadoAsignaturasDeEstudianteHoy[0],
              fechaHoy
            );
          } else {
            this.enviarOpcionRegistrarAsistenciaMultiplesAsignaturas(
              msg,
              listadoAsignaturasDeEstudianteHoy,
              fechaHoy
            );
          }
        }
      );
    }

    private getAsignaturasAsistenciaHoy(
      msg: Message & ApiMessage
    ): Promise<Array<Asignatura>> {
      return new Promise<Array<Asignatura>>((resolve, reject) => {        

        Data.Asignacion.getAsignaturasInscritasPorEstudianteCachedInfoCompleta(
          this.estadoGlobal,
          this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
        ).then((listaAsignaturasCache: Array<Asignatura>) => {

          if(listaAsignaturasCache == null || listaAsignaturasCache.length == 0){
            this.getAsignaturasEstudianteNoCache(msg).then((listaAsignaturasNOCache:Array<Asignatura>)=>{
              let listaAsignaturasHoy:Array<Asignatura> = this.getSoloAsignaturasDeHoy(listaAsignaturasNOCache);

              for(let i=0; i<listaAsignaturasHoy.length; i++){
                Data.Asignacion.asociarEstudianteAAsignatura(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante, listaAsignaturasHoy[i].codigo);
              }

              resolve(listaAsignaturasHoy);
            });
          }
          else{
            resolve(this.getSoloAsignaturasDeHoy(listaAsignaturasCache));
          }
        });
      });
    }

    private getSoloAsignaturasDeHoy(listadoAsignaturasDeEstudiante:Array<Asignatura>):Array<Asignatura>{
      let fechaHoy = new Date();
      let asignatura: Asignatura;
      let horario: Horario;
      let listadoAsignaturasDeEstudianteHoy = new Array<Asignatura>();
      for (let i = 0; i < listadoAsignaturasDeEstudiante.length; i++) {
        asignatura = listadoAsignaturasDeEstudiante[i];
        for (let codigoHorario in asignatura.horarios) {
          horario = asignatura.horarios[codigoHorario];
          if (
            Constants.DiasSemana.get(fechaHoy.getDay()) == horario.dia
          ) {
            listadoAsignaturasDeEstudianteHoy.push(asignatura);
          }
        }
      }

      return listadoAsignaturasDeEstudianteHoy;
    }

    private getAsignaturasEstudianteNoCache(msg: Message & ApiMessage): Promise<Array<Asignatura>> {
      return new Promise<Array<Asignatura>>((resolve, reject) => {
        Data.Asignacion.getAsignaturasByEstudianteCodigo(
          this.estadoGlobal,
          this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
        ).then((asignaturasDeEstudiante: AsignaturasDeEstudiante) => {
          if (!asignaturasDeEstudiante.result) {
            this.botSender.responderMensajeErrorHTML(
              msg,
              asignaturasDeEstudiante.message
            );
            reject();
          }
          resolve(asignaturasDeEstudiante.listaAsignaturas);
        });  
      });
    }


    private enviarOpcionesRegistrarAsistenciaNoAsignaturas(
      msg: Message & ApiMessage
    ) {
      this.botSender
        .responderMensajeErrorHTML(
          msg,
          `No tienes asignaturas para registrar asistencia el día de <b>hoy</b>`
        )
        .then(() => {
          this.irAMenuPrincipal(msg);
        });
    }

    private enviarOpcionRegistrarAsistenciaUnaAsignatura(
      msg: Message & ApiMessage,
      asignatura: Asignatura,
      fechaHoy: Date
    ) {
      if (!this.validarHorarioRegistroAsistencia(msg, asignatura)) {
        return;
      }

      this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData =
        asignatura.codigo;

      Data.Estudiantes.actualizarChat(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante
      ).then(() => {
        this.enviarMensajeKeyboardMarkup(
          msg,
          `Hoy es <b>${Constants.DiasSemana.get(
            fechaHoy.getDay()
          )}</b>. Deseas reportar asistencia en la asignatura <b>${
            asignatura.nombre
          }❓ </b>`,
          this.seleccionarAsignaturaInlineOpts,
          Comandos.SeleccionarComandoInlineOptsEnum
            .SeleccionarAsignaturaByDefault
        );
      });
    }

    private enviarOpcionRegistrarAsistenciaMultiplesAsignaturas(
      msg: Message & ApiMessage,
      listadoAsignaturasDeEstudianteHoy: Array<Asignatura>,
      fechaHoy: Date
    ) {
      this.enviarMensajeInlineKeyBoard(
        msg,
        Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura,
        `Hoy es <b>${Constants.DiasSemana.get(
          fechaHoy.getDay()
        )}</b> y tienes ${
          listadoAsignaturasDeEstudianteHoy.length
        } asignaturas para reportar asistencia.`,
        this.seleccionarAsignaturaAsistenciaOPts
      );
    }

    private enviarListaAsignaturasParaReportarAsistencia(
      msg: Message & ApiMessage
    ) {
      this.getAsignaturasAsistenciaHoy(msg).then(
        (listadoAsignaturasDeEstudianteHoy: Array<Asignatura>) => {
          let opcionesListaAsignaturas = this.getAsignaturasFormatoInlineQuery(
            listadoAsignaturasDeEstudianteHoy
          );
          this.botSender.responderInLineQuery(msg, opcionesListaAsignaturas);
        }
      );
    }
  }
}
