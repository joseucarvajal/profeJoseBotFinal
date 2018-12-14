import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { EstadoGlobal, InformacionContexto, Estudiante } from "../../core";
import { IndexMain } from "../indexContracts";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";

export namespace AccesoEstudiante {
  export namespace Comandos {
    export const IngresarCodigoProfesor = `❓Para empezar, ingresa el código provisto por el profesor`;

    export const SolicitarCelular = "SolicitarCelular";

    export enum SolicitarCelularOpts {
      SolicitarCelular = "✅ Autorizo compartir mi nro. celular"
    }
  }

  let nombreContexto = "AccesoEstudianteReceiver";

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
      let defaultEstudiante = {
        codigo: "",
        nombre: "",
        email: "",
        comando: Comandos.IngresarCodigoProfesor,
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

      this.enviarMensajeKeyboardMarkup(
        msg,
        "Haz click en el botón aceptar si estás de acuerdo en compartir tu nro. celular",
        this.solicitarCelularOpts, 
        Comandos.SolicitarCelular
      );
    }

    protected onRecibirMensaje(msg: Message) {

      console.log("On recibir mensaje", msg);

      if (msg.text == "/start") {
        this.onRecibirComandoStart(msg);
      } else if (this.estaComandoEnContexto(Comandos.SolicitarCelular)) {
        console.log("celular msg", msg.contact.phone_number);
      } else if (this.estaComandoEnContexto(Comandos.IngresarCodigoProfesor)) {
        if (msg.text != this.estadoGlobal.settings.codigoAccesoEstudiante) {
          this.botSender.responderMensajeErrorHTML(
            msg,
            `Has ingresado un código de acceso incorrecto`
          );
          return;
        }

        this.enviarMensajeAReceiver(
          this.indexMain.menuPrincipalReceiver,
          this.indexMain.menuPrincipalReceiver.responderMenuPrincipal,
          msg,
          MenuPrincipal.Comandos.MenuPrincipal
        );
      }

      return;
    }
  }
}
