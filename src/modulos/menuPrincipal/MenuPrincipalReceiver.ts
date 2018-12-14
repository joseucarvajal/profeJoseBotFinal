import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { BotSender } from "../bot/BotSender";
import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";

import * as Data from "../../data";
import { EstadoGlobal } from "../../core";
import { IndexMain } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";

export namespace MenuPrincipal {
  export namespace Comandos {
    export const MenuPrincipalEstudiante = "menuPrincipalEstudiante";

    export enum MenuPrincipalEstudianteOpts {
      RegistrarAsistencia = "⏱ Registrar asistencia",
      InscribirAsignatura = "📚 Inscribir asignatura",
      DesInscribirAsignatura = "❌ Des-inscribir asignatura",
      EditarInfoBasica = "✏️ Editar información básica"
    }
  }

  let nombreContexto = "MenuPrincipalEstudianteReceiver";
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
      [{ text: Comandos.MenuPrincipalEstudianteOpts.InscribirAsignatura }],
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

    protected onRecibirMensaje(msg: Message & ApiMessage) {
      if (
        (<any>Object)
          .values(Comandos.MenuPrincipalEstudianteOpts)
          .includes(msg.text)
      ) {
        switch (msg.text) {
          case Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica:
            this.goToEditarInformacionBasica(msg);
            break;

          case Comandos.MenuPrincipalEstudianteOpts.InscribirAsignatura:
            this.goToInscribirAsignatura(msg);
            break;
        }
      }
    }

    private goToEditarInformacionBasica(msg: Message & ApiMessage) {
      this.enviarMensajeAReceiver(
        this.indexMain.editarInformacionBasicaReceiver,
        this.indexMain.editarInformacionBasicaReceiver
          .responderEditarInformacionBasica,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica
      );
    }

    private goToInscribirAsignatura(msg: Message & ApiMessage) {
      this.enviarMensajeAReceiver(
        this.indexMain.inscribirAsignaturaReceiver,
        this.indexMain.inscribirAsignaturaReceiver.mostrarOpcionSeleccionarAsignaturas,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.InscribirAsignatura
      );
    }
  }
}

