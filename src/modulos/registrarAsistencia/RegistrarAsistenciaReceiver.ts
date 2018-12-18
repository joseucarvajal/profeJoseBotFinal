import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import { EstadoGlobal, Asignatura, Constants, Horario, AsignaturasDeEstudiante } from "../../core";
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

    //#region public
    public registrarAsistencia(msg: Message & ApiMessage) {
      if(!this.validarQueEstudianteHayaIngresadoDatosBasicos(msg)){
        return;
      }
      this.enviarOpcionesInscripcionAsignaturas();      
    }

    public solicitarAsistenciaGPS(msg: Message & ApiMessage){
      this.enviarOpcionesSeleccionAsignaturaParaRegistrarAsistencia(msg);
    }
    //#endregion

    //#region parent events

    protected onCallbackQuery(msg: Message & ApiMessage) {}

    protected onLocation(msg: Message & ApiMessage) {
      if (
        this.estaComandoEnContexto(
          Comandos.SolicitarAsistenciaGPS
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
          ).then(()=>{
            this.irAMenuPrincipal(msg);
          });
        });
      }
    }

    protected onRecibirMensaje(msg: Message) {}

    protected onRecibirInlineQuery(msg: Message & ApiMessage) {}
    //#endregion

    private enviarOpcionesInscripcionAsignaturas() {
      this.enviarMensajeAReceiver(
        this.indexMain.inscribirAsignaturaReceiver,
        this.indexMain.inscribirAsignaturaReceiver
          .enviarOpcionSeleccionarAsignaturas,
        this.message as Message & ApiMessage,
        InscribirAsignatura.Comandos.InscripcionAsignaturas
      );
    }

    private enviarOpcionesSeleccionAsignaturaParaRegistrarAsistencia(msg: Message & ApiMessage) {
      let fechaHoy = new Date();

      console.log("a enviar");

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
  }
}
