import { Message } from "../../bot/Message";

import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";

import { EstadoGlobal } from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";
import { InscribirAsignatura } from "../InscribirAsignatura/InscribirAsignaturaReceiver";
import { RegistrarAsistencia } from "../registrarAsistencia/RegistrarAsistenciaReceiver";

export namespace MenuPrincipal {
  export namespace Comandos {
    export const MenuPrincipalEstudiante = "menuPrincipalEstudiante";

    export enum MenuPrincipalEstudianteOpts {
      RegistrarAsistencia = "⏱ Registrar asistencia",
      InscribirAsignatura = "📚 Inscribir asignatura",
      EditarInfoBasica = "✏️ Actualizar mis datos básicos"
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
      [
        {
          text: Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia
        }
      ],
      [{ text: Comandos.MenuPrincipalEstudianteOpts.InscribirAsignatura }],
      [{ text: Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica }]
    ];

    //#region public
    public responderMenuPrincipalEstudiante(msg: Message & ApiMessage) {
      this.botSender.responderKeyboardMarkup(
        msg,
        `Selecciona una opción`,
        this.startKeyboardOpts
      );
    }
    //#endregion

    //#region parent events
    protected onRecibirMensaje(msg: Message & ApiMessage) {
      let esOpcionMenuPpalEstudiante = false;
      for (let i = 0; i < this.startKeyboardOpts.length; i++) {
        if (this.startKeyboardOpts[i][0].text == msg.text) {
          esOpcionMenuPpalEstudiante = true;
          break;
        }
      }

      if (esOpcionMenuPpalEstudiante) {
        switch (msg.text) {
          case Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia:
            this.gotoRegistrarAsistencia(msg);
            break;

          case Comandos.MenuPrincipalEstudianteOpts.InscribirAsignatura:
            this.goToInscribirAsignatura(msg);
            break;

          case Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica:
            this.goToEditarInformacionBasica(msg);
            break;
        }
      }
    }

    public onLocation(msg: Message & ApiMessage) {}
    //#endregion

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
        this.indexMain.inscribirAsignaturaReceiver
          .enviarOpcionSeleccionarAsignaturas,
        msg,
        InscribirAsignatura.Comandos.InscripcionAsignaturas
      );
    }

    private gotoRegistrarAsistencia(msg: Message & ApiMessage) {
      if (
        this.estadoGlobal.infoUsuarioMensaje.estudiante
          .inscripcionAsignaturasConfirmado
      ) {
        this.enviarMensajeAReceiver(
          this.indexMain.registrarAsistenciaReceiver,
          this.indexMain.registrarAsistenciaReceiver.solicitarAsistenciaGPS,
          msg,
          RegistrarAsistencia.Comandos.SolicitarAsistenciaGPS
        );
        return;
      }

      this.enviarMensajeAReceiver(
        this.indexMain.registrarAsistenciaReceiver,
        this.indexMain.registrarAsistenciaReceiver.registrarAsistencia,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia
      );
    }
  }
}
