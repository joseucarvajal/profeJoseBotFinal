import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import { EstadoGlobal, Asignatura, Constants, Horario } from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { KeyboardButton } from "../../bot/KeyboardButton";

export namespace RegistrarAsistencia {
  export namespace Comandos {
    export const SeleccionarComandoInline = `SeleccionarComandoInline`;

    export enum SeleccionarComandoInlineOptsEnum {
      SeleccionarAsignaturaByDefault = "✔️ Registrar asistencia"
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
      ]
    ];

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.registrarAsistencia = this.registrarAsistencia.bind(this);
    }

    public registrarAsistencia(msg: Message & ApiMessage) {
      this.enviarOpcionesSeleccionAsignatura(msg);
    }

    protected onRecibirMensaje(msg: Message & ApiMessage) {}

    protected onRecibirInlineQuery(msg: Message & ApiMessage) {}

    private enviarOpcionesSeleccionAsignatura(msg: Message & ApiMessage) {
      let fechaHoy = new Date();

      Data.Asignacion.getAsignaturasByEstudianteCodigo(
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
      ).then((listaAsignaturasEstudiante: Array<Asignatura>) => {
        if (
          !listaAsignaturasEstudiante ||
          listaAsignaturasEstudiante.length == 0
        ) {
          this.botSender.responderMensajeErrorHTML(
            msg,
            `No tienes asignaturas registradas`
          );
          return;
        }

        let asignatura: Asignatura;
        let horario: Horario;
        let tieneAlgunHorarioHoy = false;
        for (let i = 0; i < listaAsignaturasEstudiante.length; i++) {
          asignatura = listaAsignaturasEstudiante[i];
          for (let codigoHorario in asignatura.horarios) {
            horario = asignatura.horarios[codigoHorario];
            if (Constants.DiasSemana.get(fechaHoy.getDay()) == horario.dia) {
              tieneAlgunHorarioHoy = true;
              this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData =
                asignatura.codigo;
              this.enviarMensajeKeyboardMarkup(
                msg,
                `Hoy es <i>${Constants.DiasSemana.get(
                  fechaHoy.getDay()
                )}</i>. Deseas reportar asistencia en la asignatura <b>${
                  asignatura.nombre
                }❓ </b>`,
                this.seleccionarAsignaturaInlineOpts,
                Comandos.SeleccionarComandoInlineOptsEnum
                  .SeleccionarAsignaturaByDefault
              );
            }
          }
        }

        if (!tieneAlgunHorarioHoy) {
          this.botSender.responderMensajeErrorHTML(
            msg,
            `No tienes asignaturas para registrar asistencia el día de hoy`
          );
        }
      });
    }

    protected onCallbackQuery(msg: Message & ApiMessage) {}

    protected onLocation(msg: Message & ApiMessage) {
      if (
        this.estaComandoEnContexto(
          Comandos.SeleccionarComandoInlineOptsEnum
            .SeleccionarAsignaturaByDefault
        )
      ) {
        Data.Asignacion.registrarAsistencia(
          msg,
          this.estadoGlobal,
          this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData
        ).then(()=>{
          this.botSender.responderMensajeHTML(msg, `✅ Has registrado asistencia con éxito`);
        });
      }
    }
  }
}
