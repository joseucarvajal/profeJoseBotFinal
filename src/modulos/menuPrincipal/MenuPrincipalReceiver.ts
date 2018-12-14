import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { BotSender } from "../bot/BotSender";
import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";

import * as Data from "../../data";
import { EstadoGlobal } from "../../core";
import { IndexMain } from "../indexContracts";

export namespace MenuPrincipal {
  export namespace Comandos {
    export const MenuPrincipalEstudiante = "menuPrincipalEstudiante";

    export enum MenuPrincipalEstudianteOpts {
      RegistrarAsistencia = "⏱ Registrar asistencia",
      RegistrarAsignatura = "📚 Inscribir asignatura",
      DesInscribirAsignatura = "❌ Des-inscribir asignatura",
      EditarInfoBasica = "✏️ Editar información básica"
    }
  }

  let nombreContexto = "MenuPrincipalReceiver";
  export class MenuPrincipalReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    constructor(estadoGlobal: EstadoGlobal, indexMain: IndexMain) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.responderMenuPrincipalEstudiante = this.responderMenuPrincipalEstudiante.bind(
        this
      );
    }

    startResponse: Array<Array<KeyboardButton>> = [
      [{ text: Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia }],
      [{ text: Comandos.MenuPrincipalEstudianteOpts.RegistrarAsignatura }],
      [{ text: Comandos.MenuPrincipalEstudianteOpts.DesInscribirAsignatura }],
      [{ text: Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica }]
    ];

    public responderMenuPrincipalEstudiante(msg: Message) {
      this.botSender.responderKeyboardMarkup(
        msg,
        `Selecciona una opción`,
        this.startResponse
      );
    }

    protected onRecibirMensaje(msg: Message) {
      if (
        this.estaComandoEnContexto(Comandos.MenuPrincipalEstudiante) &&
        msg.text == Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica
      ) {
        this.enviarMensajeAReceiver(
          this.indexMain.editarInformacionBasicaReceiver,
          this.indexMain.editarInformacionBasicaReceiver
            .responderEditarInformacionBasica,
          msg,
          MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica
        );
      }
    }
  }
}
