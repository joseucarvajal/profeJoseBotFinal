import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { EstadoGlobal, Estudiante, CelularUsuario } from "../../core";
import { IndexMain } from "../indexContracts";

import * as Data from "../../data";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";

export namespace AccesoEstudiante {
  export namespace Comandos {
    export const SolicitarCelular = "SolicitarCelular";

    export enum SolicitarCelularOpts {
      SolicitarCelular = "✅ Autorizo compartir mi nro. celular"
    }
  }

  export let nombreContexto = "AccesoEstudianteReceiver";

  export class AccesoEstudianteReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    solicitarCelularOpts: Array<Array<KeyboardButton>> = [
      [
        {
          text: Comandos.SolicitarCelularOpts.SolicitarCelular,
          request_contact: true
        }
      ]
    ];

    constructor(estadoGlobal: EstadoGlobal, indexMain: IndexMain) {
      super(estadoGlobal, indexMain, nombreContexto);
    }

    private onRecibirComandoStart(msg: Message) {

      this.inicializarDatosEstudianteContexto();

      this.botSender
        .responderMensajeHTML(
          msg,
          `Bienvenido <b>${
            msg.from.first_name
          }!</b>. Soy el asistente del profe Jose Ubaldo Carvajal`
        )
        .then(() => {
          this.enviarMensajeKeyboardMarkup(
            msg,
            `Para empezar, haz click en el botón <b>"${
              Comandos.SolicitarCelularOpts.SolicitarCelular
            }"</b> si estás de acuerdo.`,
            this.solicitarCelularOpts,
            Comandos.SolicitarCelular
          );
        });
    }

    protected onRecibirMensaje(msg: Message) {
      if (msg.text == "/start") {
        this.onRecibirComandoStart(msg);
      } else if (this.estaComandoEnContexto(Comandos.SolicitarCelular)) {
        this.enviarMenuAUsuario(msg);
      }
      return;
    }

    private enviarMenuAUsuario(msg: Message) {
      Data.CelularesUsuario.getCelularUsuario(msg, this.estadoGlobal).then(
        (celularUsuario: CelularUsuario) => {          
          if (celularUsuario == null) {
            this.enviarErrorUsuarioNoEncontrado(msg);
          } else {
            this.crearChatYEnviarMenu(msg, celularUsuario);
          }
        }
      );
    }

    private enviarErrorUsuarioNoEncontrado(msg: Message){      
      this.botSender.responderMensajeErrorHTML(
        msg,
        `No puedo encontrarte en los registros de estudiante, pídele al profe que te registre`
      );
      Data.Estudiantes.elminarChat(msg, this.estadoGlobal);
    }

    private crearChatYEnviarMenu(msg: Message, celularUsuario: CelularUsuario) {
      Data.Estudiantes.actualizarChat(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante
      ).then(() => {
        celularUsuario.idUsuario = msg.contact.user_id;
        Data.CelularesUsuario.actualizarCelularUsuario(
          msg,
          this.estadoGlobal,
          msg.contact.phone_number,
          celularUsuario
        ).then(() => {
          switch (celularUsuario.tipoUsuario) {
            case "e":
              this.enviarMenuAUsuarioEstudiante(msg);
              break;

            case "p":
              this.enviarMenuAUsuarioProfesor(msg);
              break;
          }
        });
      });
    }

    private enviarMenuAUsuarioEstudiante(msg: Message) {
      this.enviarMensajeAReceiver(
        this.indexMain.menuPrincipalReceiver,
        this.indexMain.menuPrincipalReceiver.responderMenuPrincipalEstudiante,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudiante
      );
    }

    private enviarMenuAUsuarioProfesor(msg: Message) {
      return;
    }

    private inicializarDatosEstudianteContexto() {
      let defaultEstudiante = {
        codigo: "",
        nombre: "",
        email: "",
        comando: Comandos.SolicitarCelular,
        contexto: this.nombreContexto
      };

      let estudiante: Estudiante = {
        ...this.estadoGlobal.infoUsuarioMensaje.estudiante
      };

      this.estadoGlobal.infoUsuarioMensaje.estudiante = defaultEstudiante;
      this.estadoGlobal.infoUsuarioMensaje.estudiante = { ...estudiante };

      this.estadoGlobal.infoUsuarioMensaje.estudiante.comando =
        Comandos.SolicitarCelular;
      this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
    }
  }
}
