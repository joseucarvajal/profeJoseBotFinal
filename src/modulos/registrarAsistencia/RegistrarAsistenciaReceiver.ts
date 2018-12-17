import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import { EstadoGlobal, Asignatura, Constants, Horario, AsignaturasDeEstudiante } from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { InscribirAsignatura } from "../InscribirAsignatura/InscribirAsignaturaReceiver";

export namespace RegistrarAsistencia {
  export namespace Comandos {
    export const SolicitarCodigo = "Ingresa tu código";

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

    //#region parent events
    public registrarAsistencia(msg: Message & ApiMessage) {
      if (!this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo) {
        this.enviarSolicitudCodigo(msg);
      } else {
        this.enviarOpcionesInscripcionAsignaturas();
      }
    }

    protected onRecibirMensaje(msg: Message) {
      if (this.estaComandoEnContexto(Comandos.SolicitarCodigo)) {
        this.recibirCodigo();
      }
    }

    protected onRecibirInlineQuery(msg: Message & ApiMessage) {}
    //#endregion

    private enviarSolicitudCodigo(msg: Message & ApiMessage) {
      this.enviarMensajeHTML(
        msg,
        Comandos.SolicitarCodigo,
        Comandos.SolicitarCodigo
      );
    }

    private recibirCodigo() {
      this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo = this.message.text;
      Data.Estudiantes.actualizarChat(
        this.message,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante
      ).then(()=>{
        this.enviarOpcionesInscripcionAsignaturas();
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

    private enviarOpcionesSeleccionAsignatura(msg: Message & ApiMessage) {
      let fechaHoy = new Date();

      Data.Asignacion.getAsignaturasByEstudianteCodigo(
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
      ).then((asignaturasDeEstudiante: AsignaturasDeEstudiante) => {
        if (asignaturasDeEstudiante.result == false) {
          this.botSender.responderMensajeErrorHTML(
            msg,
            `Ha ocurrido un error, por favor notifícale al profe Jose`
          );    
          
          this.enviarMensajeErrorHTMLAProfesor(asignaturasDeEstudiante.message);

          return;
        }

        let asignatura: Asignatura;
        let horario: Horario;
        let tieneAlgunHorarioHoy = false;
        for (let i = 0; i < asignaturasDeEstudiante.listaAsignaturas.length; i++) {
          asignatura = asignaturasDeEstudiante.listaAsignaturas[i];
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
        ).then(() => {
          this.botSender.responderMensajeHTML(
            msg,
            `✅ Has registrado asistencia con éxito`
          );
        });
      }
    }
  }
}
