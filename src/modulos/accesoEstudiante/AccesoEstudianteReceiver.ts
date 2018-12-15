import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";
import {
  EstadoGlobal,
  Estudiante,
  CelularUsuario,
  Asignatura
} from "../../core";
import { MainReceiverContract } from "../indexContracts";

import * as Data from "../../data";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { Chat } from "../../bot/Chat";

export namespace AccesoEstudiante {
  export namespace Comandos {
    export const SolicitarCodigo = "SolicitarCodigo";

    export const ConfirmarDatosEstudiante = "ConfirmarDatosEstudiante";
    export enum ConfirmarDatosEstudianteInlineOptsEnum {
      ConfirmarSI = "✔️",
      ConfirmarNO = "⛔️"
    }
  }

  export let nombreContexto = "AccesoEstudianteReceiver";

  export class AccesoEstudianteReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    confirmarDatosEstudianteInlineOpts: Array<Array<InlineKeyboardButton>> = [
      [
        {
          text: Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarSI,
          callback_data:
            Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarSI
        },
        {
          text: Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarNO,
          callback_data:
            Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarNO
        }
      ]
    ];

    listaAsignaturasEstudiante: Array<Asignatura> = new Array<Asignatura>();

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);
    }

    private onRecibirComandoStart(msg: Message & ApiMessage) {
      this.inicializarDatosEstudianteContexto();

      if (this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado) {
        this.enviarAMenuEstudiante(msg);
        return;
      }

      this.enviarMensajeHTML(
        msg,
        Comandos.SolicitarCodigo,
        `Bienvenido <b>${
          msg.from.first_name
        }!</b>. Soy el asistente del profe <i>Jose Ubaldo Carvajal</i>, Para empezar, ingresa tu código`
      );
    }

    protected onRecibirMensaje(msg: Message & ApiMessage) {
      if (msg.text == "/start") {
        this.onRecibirComandoStart(msg);
      } else if (this.estaComandoEnContexto(Comandos.SolicitarCodigo)) {
        this.validarYEnviarConfirmacionEstudiante(msg);
      }
      return;
    }

    public onCallbackQuery(msg: Message & ApiMessage) {
      if (this.estaComandoEnContexto(Comandos.ConfirmarDatosEstudiante)) {
        this.guardarConfirmacionDatosEstudiante(msg);
      }
    }

    private guardarConfirmacionDatosEstudiante(msg: Message & ApiMessage) {
      let apiMessage: ApiMessage = msg;
      if (
        apiMessage.data ==
        Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarNO
      ) {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado = false;
        this.botSender.responderMensajeHTML(
          msg,
          `Se notificará al profesor sobre el caso`
        );
        let msgProfesor: Message & ApiMessage = {
          chat: {
            id: parseInt(this.estadoGlobal.settings.idUsuarioChatDocente)
          } as Chat
        } as Message & ApiMessage;
        this.botSender.responderMensajeErrorHTML(
          msgProfesor,
          `El estudiante ${
            this.estadoGlobal.infoUsuarioMensaje.estudiante.nombre
          } - código: ${
            this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
          } ha reportado una inconsistencia`
        );
      } else {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado = true;
      }

      Data.Estudiantes.actualizarChat(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante
      ).then(() => {
        if(this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado){
          this.enviarAMenuEstudiante(msg);
        }        
      });

    }

    private validarYEnviarConfirmacionEstudiante(msg: Message & ApiMessage) {
      Data.Asignacion.getAsignaturasByEstudianteCodigo(
        this.estadoGlobal,
        msg.text
      ).then((listaAsignaturasEstudiante: Array<Asignatura>) => {
        this.listaAsignaturasEstudiante = listaAsignaturasEstudiante;
        if (listaAsignaturasEstudiante.length == 0) {
          this.enviarErrorUsuarioNoEncontrado(msg);
        } else {
          this.crearChatYEnviarConfirmacionDatosEstudiante(msg);
        }
      });
    }

    private enviarErrorUsuarioNoEncontrado(msg: Message & ApiMessage) {
      this.botSender.responderMensajeErrorHTML(
        msg,
        `Parece que no estás matriculado en ninguna de las asignaturas del profe Jose. Verifica tu código e ingresalo de nuevo`
      );
      Data.Estudiantes.elminarChat(msg, this.estadoGlobal);
    }

    private crearChatYEnviarConfirmacionDatosEstudiante(
      msg: Message & ApiMessage
    ) {
      this.actualizarDatosChat(msg).then(() => {
        this.enviarConfirmacionDatosEstudiante(msg);
      });
    }

    private actualizarDatosChat(msg: Message & ApiMessage): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo = msg.text;
        Data.Estudiantes.getEstudianteByCodigoAsignatura(
          msg,
          this.estadoGlobal,
          this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo,
          this.listaAsignaturasEstudiante[0].codigo
        ).then((estudiante: Estudiante) => {
          this.estadoGlobal.infoUsuarioMensaje.estudiante = estudiante;
          Data.Estudiantes.actualizarChat(
            msg,
            this.estadoGlobal,
            this.estadoGlobal.infoUsuarioMensaje.estudiante
          ).then(() => {
            resolve();
          });
        });
      });
    }

    private enviarConfirmacionDatosEstudiante(msg: Message & ApiMessage) {
      let estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
      this.enviarMensajeInlineKeyBoard(
        msg,
        Comandos.ConfirmarDatosEstudiante,
        `
⚠️ Verifica estos datos:

<b>Código:</b> ${estudiante.codigo}
<b>Nombre:</b> ${estudiante.nombre}
<b>Email:</b> ${estudiante.email}

<b>Asignaturas</b>: ${this.listaAsignaturasEstudiante.map(
          (asignatura: Asignatura) => {
            let infoAsignatura =
              "\n\n📒<b>" +
              asignatura.nombre +
              "</b>, " +
              " grupo " +
              asignatura.grupo;

            let horario;
            let i = 0;
            let conector;
            for (let codigoHorario in asignatura.horarios) {
              horario = asignatura.horarios[codigoHorario];
              conector = i > 0 ? " y " : "\n";
              infoAsignatura +=
                "<i>" +
                conector +
                horario.dia +
                "</i> " +
                horario.horaInicio +
                " a " +
                horario.horaFin +
                ", aula " +
                horario.aula;
              i++;
            }

            return infoAsignatura;
          }
        )}

Si corresponde a tu información, presiona <b>"${
          Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarSI
        }"</b> para confirmar o <b>"${
          Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarNO
        }"</b> si ves alguna inconsistencia
`,

        this.confirmarDatosEstudianteInlineOpts
      );
    }

    private inicializarDatosEstudianteContexto() {
      let defaultEstudiante: Estudiante = {
        codigo: "",
        nombre: "",
        email: "",
        comando: Comandos.SolicitarCodigo,
        contexto: this.nombreContexto,
        registroConfirmado: false
      };

      let estudiante: Estudiante = {
        ...this.estadoGlobal.infoUsuarioMensaje.estudiante
      };

      this.estadoGlobal.infoUsuarioMensaje.estudiante = defaultEstudiante;
      this.estadoGlobal.infoUsuarioMensaje.estudiante = { ...estudiante };

      this.estadoGlobal.infoUsuarioMensaje.estudiante.comando =
        Comandos.SolicitarCodigo;
      this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
    }

    private enviarAMenuEstudiante(msg: Message & ApiMessage) {
      this.enviarMensajeAReceiver(
        this.indexMain.menuPrincipalReceiver,
        this.indexMain.menuPrincipalReceiver.responderMenuPrincipalEstudiante,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudiante
      );
    }
  }
}
