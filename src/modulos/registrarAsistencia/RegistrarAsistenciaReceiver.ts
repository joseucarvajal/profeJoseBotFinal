import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import {
  EstadoGlobal,
  Asignatura,
  Constants,
  Horario,
  AsignaturasDeEstudiante
} from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { InscribirAsignatura } from "../InscribirAsignatura/InscribirAsignaturaReceiver";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";

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
              request_location:true
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
      if (this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura)
      ) {
        this.guardarAsignaturaSeleccionadaTemporal(msg);
      }
    }
    
    //#endregion

    private guardarAsignaturaSeleccionadaTemporal(msg: ApiMessage & Message){
      this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData = msg.result_id;
      Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(()=>{
        Data.Asignacion.getAsignaturaByCodigo(this.estadoGlobal, msg.result_id).then((asignatura:Asignatura)=>{
          this.enviarOpcionRegistrarAsistenciaUnaAsignatura(msg, asignatura, new Date());
        });
      });
    }

    private guardarAsistencia(msg: Message & ApiMessage) {
      Data.Asignacion.registrarAsistencia(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData
      ).then(() => {
        this.botSender
          .responderMensajeHTML(msg, `✅ Has registrado asistencia con éxito`)
          .then(() => {
            this.irAMenuPrincipal(msg);
          });
      });
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
        let fechaHoy = new Date();

        Data.Asignacion.getAsignaturasInscritasPorEstudianteCachedInfoCompleta(
          this.estadoGlobal,
          this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
        ).then((listadoAsignaturasDeEstudiante: Array<Asignatura>) => {
          let asignatura: Asignatura;
          let horario: Horario;
          let listadoAsignaturasDeEstudianteHoy = new Array<Asignatura>();
          for (let i = 0; i < listadoAsignaturasDeEstudiante.length; i++) {
            asignatura = listadoAsignaturasDeEstudiante[i];
            for (let codigoHorario in asignatura.horarios) {
              horario = asignatura.horarios[codigoHorario];
              if (
                Constants.DiasSemana.get(fechaHoy.getDay()) == horario.dia &&
                asignatura.estado == Constants.EstadoEstudianteAsignatura.Activa
              ) {
                listadoAsignaturasDeEstudianteHoy.push(asignatura);
              }
            }
          }
          resolve(listadoAsignaturasDeEstudianteHoy);
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
      this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData =
        asignatura.codigo;
      this.enviarMensajeKeyboardMarkup(
        msg,
        `Hoy es <b>${Constants.DiasSemana.get(
          fechaHoy.getDay()
        )}</b>. Deseas reportar asistencia en la asignatura <b>${
          asignatura.nombre
        }❓ </b>`,
        this.seleccionarAsignaturaInlineOpts,
        Comandos.SeleccionarComandoInlineOptsEnum.SeleccionarAsignaturaByDefault
      );
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
        });
    }
  }
}
