import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";
let dateFormat = require('dateformat');

import * as Data from "../../data";
import {
  EstadoGlobal,
  ListaResultadoAsistenciasIndxByEstCodigo,
  ContadorAsistenciasEstudiante,
  ResultadoReporteAsistencia,
  ListadoAsignaturas,
  Asignatura,
  HorarioAsignatura,
  Horario
} from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { CalculoReporteAsistenciaAsignaturas } from "./CalculoReporteAsistenciaAsignaturas";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";

export namespace Docente {
  export namespace Comandos {
    export const MenuDocente = "MenuDocente";
    export enum MenuDocenteOpts {
      ReporteAsistencias = "📆 Reporte asistencia asignatura",
      GeorreferenciarAula = "🌎 Georeferenciar aula"
    }

    export enum SeleccionarAsignaturaOpts {
      SeleccionarAsignaturaReporteAsistencia = "📆 Seleccionar asignatura",
      SeleccionarAsignaturaGeoreferenciar = "🌎 Georeferenciar aula asignatura"
    }

    export const ConfirmarGeoreferenciacion = "ConfirmarGeoreferenciacion";
    export enum ConfirmarGereferenciarAsignaturasOpts {
      ConfirmarGeoreferenciarAsignatura = "✔️ Confirmar georeferenciacion",
      Volver = "🔙 Volver"
    }
  }

  let nombreContexto = "DocenteReceiver";

  export class DocenteReceiver extends BotReceiver {
    nombreContexto = nombreContexto;
    calculoReporteAsistenciaAsignaturas: CalculoReporteAsistenciaAsignaturas;

    menuDocenteOpts: Array<Array<KeyboardButton>> = [
      [
        {
          text: Comandos.MenuDocenteOpts.ReporteAsistencias
        }
      ],
      [
        {
          text: Comandos.MenuDocenteOpts.GeorreferenciarAula
        }
      ]
    ];

    seleccionarAsignaturaAsistenciaOPts: Array<Array<InlineKeyboardButton>> = [
      [
        {
          text:
            Comandos.SeleccionarAsignaturaOpts
              .SeleccionarAsignaturaReporteAsistencia,
          switch_inline_query_current_chat: ""
        }
      ]
    ];

    seleccionarAsignaturaGeoreferenciarOPts: Array<
      Array<InlineKeyboardButton>
    > = [
      [
        {
          text:
            Comandos.SeleccionarAsignaturaOpts
              .SeleccionarAsignaturaGeoreferenciar,
          switch_inline_query_current_chat: ""
        }
      ]
    ];

    confirmarGeoreferenciacionOpts: Array<Array<KeyboardButton>> = [
      [
        {
          text:
            Comandos.ConfirmarGereferenciarAsignaturasOpts
              .ConfirmarGeoreferenciarAsignatura,
          request_location: true
        }
      ],
      [
        {
          text: Comandos.ConfirmarGereferenciarAsignaturasOpts.Volver
        }
      ]
    ];

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.calculoReporteAsistenciaAsignaturas = new CalculoReporteAsistenciaAsignaturas(
        this.estadoGlobal
      );

      this.responderMenu = this.responderMenu.bind(this);
    }

    //#region Public
    public responderMenu(msg: Message & ApiMessage) {
      this.botSender.responderKeyboardMarkup(
        msg,
        `Selecciona una opción`,
        this.menuDocenteOpts
      );
    }
    //#endregion

    //#region parent events
    protected onRecibirMensaje(msg: Message & ApiMessage) {
      if (msg.text == "/profesor") {
        this.irAMenuPrincipalAndSaveState(msg);
      } else if (
        this.seHaSeleccionadoOpcionDeMenu(
          msg,
          Comandos.MenuDocenteOpts.ReporteAsistencias
        )
      ) {
        this.enviarMenuOpcionesReporteAsistenciaAsignatura(
          msg,
          `Selecciona la asignatura para generar el reporte`
        );
      } else if (
        this.seHaSeleccionadoOpcionDeMenu(
          msg,
          Comandos.MenuDocenteOpts.GeorreferenciarAula
        )
      ) {
        this.enviarMenuOpcionesSeleccionarHorarioGereferenciar(msg);
      } else if (
        this.seHaSeleccionadoOpcionDeMenu(
          msg,
          Comandos.ConfirmarGereferenciarAsignaturasOpts.Volver
        )
      ) {
        this.responderMenu(msg);
      }
    }

    protected onCallbackQuery(msg: Message & ApiMessage) {}

    protected onLocation(msg: Message & ApiMessage) {
      if (this.estaEnContextoActual()) {
        this.georeferenciarAula(msg);
      }
    }

    protected onRecibirInlineQuery(msg: Message & ApiMessage) {
      if (
        this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaOpts
            .SeleccionarAsignaturaReporteAsistencia
        )
      ) {
        this.enviarListadoAsignaturasDocente(msg);
      } else if (
        this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaOpts.SeleccionarAsignaturaGeoreferenciar
        )
      ) {
        this.enviarListadoHorariosAsignaturaDocente(msg);
      }
    }

    onChosenInlineResult(msg: ApiMessage & Message) {
      if (
        this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaOpts
            .SeleccionarAsignaturaReporteAsistencia
        )
      ) {
        this.enviarReporteAsistenciaAsignatura(msg, msg.result_id);
      } else if (
        this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaOpts.SeleccionarAsignaturaGeoreferenciar
        )
      ) {
        this.enviarConfirmacionGeoreferenciarAsignatura(msg);
      }
    }

    //#endregion

    protected georeferenciarAula(msg: Message & ApiMessage) {
      let datosHorarioAsignatura = this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData.split(
        "#|@"
      );
      let codigoAsignatura = datosHorarioAsignatura[0];
      let codigoHorario = datosHorarioAsignatura[1];

      Data.Asignacion.actualizarGeoreferenciaAsignatura(
        msg,
        this.estadoGlobal,
        codigoAsignatura,
        codigoHorario
      ).then(() => {
        this.botSender.responderMensajeHTML(
          msg,
          `✅ Se ha geoferenciado la asignatura con éxito`
        );
      });
    }

    private enviarMenuOpcionesSeleccionarHorarioGereferenciar(
      msg: Message & ApiMessage
    ) {
      this.enviarMensajeInlineKeyBoard(
        msg,
        Comandos.SeleccionarAsignaturaOpts.SeleccionarAsignaturaGeoreferenciar,
        `Selecciona 1 horario de asignatura para georeferenciar`,
        this.seleccionarAsignaturaGeoreferenciarOPts
      );
    }

    private enviarMenuOpcionesReporteAsistenciaAsignatura(
      msg: Message & ApiMessage,
      label: string
    ) {
      this.enviarMensajeInlineKeyBoard(
        msg,
        Comandos.SeleccionarAsignaturaOpts
          .SeleccionarAsignaturaReporteAsistencia,
        label,
        this.seleccionarAsignaturaAsistenciaOPts
      );
    }

    private enviarListadoAsignaturasDocente(msg: Message & ApiMessage) {
      Data.Asignacion.getAsignaturasXPeriodoAndDocenteAsArray(
        this.estadoGlobal
      ).then((listaAsignaturas: Array<Asignatura>) => {
        let opcionesListaAsignaturas = this.getAsignaturasFormatoInlineQuery(
          listaAsignaturas
        );
        this.botSender.responderInLineQuery(msg, opcionesListaAsignaturas);
      });
    }

    private enviarListadoHorariosAsignaturaDocente(msg: Message & ApiMessage) {
      Data.Asignacion.getTodosHorariosYAsignaturasDocente(
        this.estadoGlobal
      ).then((listaHorarioAsignatura: Array<HorarioAsignatura>) => {
        let opcionesListaHorarios = new Array<any>();
        for (let i = 0; i < listaHorarioAsignatura.length; i++) {
          opcionesListaHorarios.push({
            id: listaHorarioAsignatura[i].horario.id,
            type: "article",
            title: `${listaHorarioAsignatura[i].asignatura.nombre}, ${
              listaHorarioAsignatura[i].horario.dia
            }`,
            description: `aula ${listaHorarioAsignatura[i].horario.aula}, ${
              listaHorarioAsignatura[i].horario.horaInicio
            } a ${listaHorarioAsignatura[i].horario.horaFin}`,
            input_message_content: {
              message_text: `${listaHorarioAsignatura[i].asignatura.nombre}, ${
                listaHorarioAsignatura[i].horario.dia
              } - ${listaHorarioAsignatura[i].horario.horaInicio} a ${
                listaHorarioAsignatura[i].horario.horaFin
              }`
            }
          });
        }

        this.botSender.responderInLineQuery(msg, opcionesListaHorarios);
      });
    }

    private enviarReporteAsistenciaAsignatura(
      msg: Message & ApiMessage,
      codigoAsignatura: string
    ) {
      this.calculoReporteAsistenciaAsignaturas
        .calcularReporteAsistenciaAsignaturas(msg, codigoAsignatura)
        .then((resultadoReporteAsistencia: ResultadoReporteAsistencia) => {
          let listaHorarios = new Array<Horario>();
          for (let codigoHorario in resultadoReporteAsistencia.asignatura
            .horarios) {
            listaHorarios.push(
              resultadoReporteAsistencia.asignatura.horarios[codigoHorario]
            );
          }

          let htmlReporte = `
          <br/>
          <center><h3>Reporte asistencia ${
            resultadoReporteAsistencia.asignatura.nombre
          } - ${dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}</h3></center>
          <table>
            <tr><td><strong>Asignatura:</strong></td><td>${
              resultadoReporteAsistencia.asignatura.nombre
            } - (${resultadoReporteAsistencia.asignatura.codigo}) </td>
            </tr>
            <tr><td><strong>Grupo</strong></td><td>${
              resultadoReporteAsistencia.asignatura.grupo
            }</td></tr>
            <tr><td><strong>Horarios</strong></td>
            <td>
              
              ${listaHorarios.map((horario: Horario, i: number) => {
                let y = i > 0 ? " y " : "";
                return (
                  y +
                  horario.dia +
                  " " +
                  horario.horaInicio +
                  " a " +
                  horario.horaFin +
                  ", aula: " +
                  horario.aula
                );
              })}
            </td>
            </tr>
          </table><br/>
          <table border="1" cellspacing="0" style="width: 100%; border:1px solid;position: relative;">
          <tr><th>Código</th><th>Nombre</th><th>Email</th><th>Asistencias</th><th>Fallas</th></tr>
        `;
          let htmlRegistroEstudiante = ``;
          let resultadoByEst: ContadorAsistenciasEstudiante;
          for (let codigoEstudiante in resultadoReporteAsistencia.listaResultadoAsistenciasIndxByEstCodigo) {
            resultadoByEst =
              resultadoReporteAsistencia
                .listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante];
            htmlRegistroEstudiante = `<tr><td>${
              resultadoByEst.estudiante.codigo
            }</td><td>${resultadoByEst.estudiante.nombre}</td><td>${
              resultadoByEst.estudiante.email
            }</td><td>${resultadoByEst.countAsistencias}</td><td>${
              resultadoByEst.countFallas
            }</td></tr>`;
            htmlReporte += htmlRegistroEstudiante;
          }
          htmlReporte += `</table>`;

          let opcionesFormatoFecha = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          };

          this.botSender.enviarHTMLComoDocumentoPDF(
            msg,
            `asistencia_${resultadoReporteAsistencia.asignatura.nombre}.pdf`,
            htmlReporte,
            `Reporte asistencia`
          );
        });
    }

    private enviarConfirmacionGeoreferenciarAsignatura(
      msg: Message & ApiMessage
    ) {
      this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData = msg.result_id;
      Data.Estudiantes.actualizarChat(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante
      ).then(() => {
        let datosHorarioAsignatura = msg.result_id.split("#|@");
        let codigoAsignatura = datosHorarioAsignatura[0];
        let codigoHorario = datosHorarioAsignatura[1];

        Data.Asignacion.getAsignaturaByCodigo(
          this.estadoGlobal,
          codigoAsignatura
        ).then((asignatura: Asignatura) => {
          this.enviarMensajeKeyboardMarkup(
            msg,
            `Confirmas que deseas gereferenciar la asignatura <b>${
              asignatura.nombre
            }</b>, aula: ${
              asignatura.horarios[codigoHorario].aula
            } en el horario: ${asignatura.horarios[codigoHorario].dia}, de ${
              asignatura.horarios[codigoHorario].horaInicio
            } a ${asignatura.horarios[codigoHorario].horaFin}❓`,
            this.confirmarGeoreferenciacionOpts,
            Comandos.ConfirmarGereferenciarAsignaturasOpts
              .ConfirmarGeoreferenciarAsignatura
          );
        });
      });
    }

    protected irAMenuPrincipalAndSaveState(msg: Message & ApiMessage) {
      if (msg.from.id != this.estadoGlobal.settings.idUsuarioChatDocente) {
        this.botSender.responderMensajeErrorHTML(
          msg,
          `Lo siento, sólo puedo darle acceso al profe <b>Jose</b>`
        );
        return;
      }

      this.enviarMensajeAReceiver(
        this,
        this.responderMenu,
        msg,
        Comandos.MenuDocente
      );
    }
  }
}
