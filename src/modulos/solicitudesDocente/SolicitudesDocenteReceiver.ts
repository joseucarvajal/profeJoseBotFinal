import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";
import { EstadoGlobal, Estudiante, Asignatura } from "../../core";
import { MainReceiverContract } from "../indexContracts";

import * as Data from "../../data";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { Chat } from "../../bot/Chat";
import { Estudiantes } from "../../data";

export namespace SolicitudesDocente {
  export namespace Comandos {
    export const AprobacionInscripcion = "AprobacionInscripcion";
    export enum OpcionesAprobarInscripcionAsignaturaEnum {
      ConfirmarSI = "✔️ Si",
      ConfirmarNo = "️❌ No"
    }
  }

  export let nombreContexto = "SolicitudesDocenteReceiver";

  export class SolicitudesDocenteReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);
    }

    //#region public
    public enviarSolicitudInscribirAsignatura(
      msg: Message & ApiMessage,
      estudiante: Estudiante,
      chatIdEstudiante: number,
      codigoAsignatura: string
    ): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        let aprobarInscripcionAsignaturaOpts: Array<
          Array<InlineKeyboardButton>
        > = [
          [
            {
              text:
                Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarSI,
              callback_data: `${Comandos.AprobacionInscripcion}|${
                Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarSI
              }|${chatIdEstudiante}|${codigoAsignatura}`
            },
            {
              text:
                Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarNo,
              callback_data: `${Comandos.AprobacionInscripcion}|${
                Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarNo
              }|${chatIdEstudiante}|${codigoAsignatura}`
            }
          ]
        ];

        Data.Asignacion.getAsignaturaByCodigo(
          this.estadoGlobal,
          codigoAsignatura
        ).then((asignatura: Asignatura) => {
          let msgDocente: Message & ApiMessage = {
            chat: {
              id: this.estadoGlobal.settings.idUsuarioChatDocente
            } as Chat
          } as Message & ApiMessage;

          this.botSender
            .responderInlineKeyboard(
              msgDocente,
              `Profe, aprueba la <b>solicitud</b> de inscripción de la asignatura <b>${
                asignatura.nombre
              }</b>, grupo <b>${asignatura.grupo}</b>, al estudiante <b>${
                estudiante.nombre
              }</b>, código: <b>${estudiante.codigo}</b>⁉`,
              aprobarInscripcionAsignaturaOpts
            )
            .then(() => {
              resolve();
            });
        });
      });
    }
    //#endregion

    //#region parent events
    protected onRecibirMensaje(msg: Message & ApiMessage) {}

    protected onCallbackQuery(msg: Message & ApiMessage) {
      let datosMensajeArr = msg.data.split("|");

      if (datosMensajeArr.length > 1) {
        if (datosMensajeArr[0] == Comandos.AprobacionInscripcion) {
          this.aprobarORechazarSolicitudInscripcionAsignatura(
            msg,
            datosMensajeArr
          );
        }
      }
    }
    //#endregion

    private aprobarORechazarSolicitudInscripcionAsignatura(
      msg: Message & ApiMessage,
      datosAprobacionArr: Array<string>
    ) {
      let resultadoAprobacion = datosAprobacionArr[1];
      let chatIdEstudiante = parseInt(datosAprobacionArr[2]);
      let codigoAsignatura = datosAprobacionArr[3];

      Data.Asignacion.getAsignaturaByCodigo(
        this.estadoGlobal,
        codigoAsignatura
      ).then((asignatura: Asignatura) => {
        let mensajeAEstudiante = {
          chat: {
            id: chatIdEstudiante
          } as Chat
        } as Message & ApiMessage;

        Data.Estudiantes.getEstudianteXChatId(
          msg,
          this.estadoGlobal,
          chatIdEstudiante.toString()
        ).then((estudiante: Estudiante) => {
          if (
            resultadoAprobacion ==
            Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarNo
          ) {
            this.botSender.responderMensajeErrorHTML(
              mensajeAEstudiante,
              `El profe Jose ha <b>rechazado</b> la solicitud de inscripción a la asignatura <b>${
                asignatura.nombre
              }</b>, comunícate con el profe o inténtalo de nuevo`
            ).then(()=>{
              this.irAMenuPrincipal(msg);
            });

            this.botSender.responderMensajeHTML(
              msg,
              `✅ Se ha <b>rechazado</b> la solicitud de inscripción del estudiante ${
                estudiante.nombre
              } a la asignatura <b>${
                asignatura.nombre
              }</b> satisfactoriamente`
            );
        } else {
            Data.Asignacion.asociarEstudianteAAsignatura(
              this.estadoGlobal,
              estudiante,
              codigoAsignatura
            ).then(() => {
              this.botSender.responderMensajeHTML(
                mensajeAEstudiante,
                `📩 El profe <i>Jose</i> ha <b>aprobado</b> la solicitud de inscripción a la asignatura <b>${
                  asignatura.nombre
                }</b>, ya puedes registrar asistencia para esta asignatura.`
              ).then(()=>{
                this.irAMenuPrincipal(msg);
              });

              this.botSender.responderMensajeHTML(
                msg,
                `✅ Se ha <b>aprobado</b> la solicitud de inscripción del estudiante ${
                  estudiante.nombre
                } a la asignatura <b>${
                  asignatura.nombre
                }</b> satisfactoriamente`
              );
            });
          }
        });
      });
    }
  }
}
