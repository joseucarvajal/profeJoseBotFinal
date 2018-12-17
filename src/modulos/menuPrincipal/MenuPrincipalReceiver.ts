import { Message } from "../../bot/Message";

import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";

import { EstadoGlobal } from "../../core";
import { MainReceiverContract } from "../indexContracts";
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

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.responderMenuPrincipalEstudiante = this.responderMenuPrincipalEstudiante.bind(
        this
      );
    }

    startKeyboardOpts: Array<Array<KeyboardButton>> = [
      [{ text: Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia }],
      [{ text: Comandos.MenuPrincipalEstudianteOpts.InscribirAsignatura }],
      //[{ text: Comandos.MenuPrincipalEstudianteOpts.DesInscribirAsignatura }],
      [{ text: Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica }]
    ];

    public responderMenuPrincipalEstudiante(msg: Message & ApiMessage) {
      this.botSender.responderKeyboardMarkup(
        msg,
        `Selecciona una opción`,
        this.startKeyboardOpts
      );
    }

    protected onRecibirMensaje(msg: Message & ApiMessage) {

      let esOpcionMenuPpalEstudiante = false;
      for(let i=0; i<this.startKeyboardOpts.length; i++){
        if(this.startKeyboardOpts[i][0].text == msg.text){
          esOpcionMenuPpalEstudiante = true;
          break;
        }
      }

      if (esOpcionMenuPpalEstudiante) {
        switch (msg.text) {

          case Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica:
            this.goToEditarInformacionBasica(msg);
            break;

          case Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia:
            this.gotoRegistrarAsistencia(msg);
            break;          
        }
      }
    }
    
    private goToEditarInformacionBasica(msg: Message & ApiMessage) {
      this.enviarMensajeAReceiver(
        this.indexMain.registrarAsistenciaReceiver,
        this.indexMain.registrarAsistenciaReceiver
          .registrarAsistencia,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia
      );
    }

    private gotoRegistrarAsistencia(msg: Message & ApiMessage) {
      this.enviarMensajeAReceiver(
        this.indexMain.registrarAsistenciaReceiver,
        this.indexMain.registrarAsistenciaReceiver.registrarAsistencia,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia
      );
    }
  }
}

