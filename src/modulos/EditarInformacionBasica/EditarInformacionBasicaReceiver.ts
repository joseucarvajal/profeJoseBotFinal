import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { BotSender } from "../bot/BotSender";
import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";

import * as Data from "../../data";
import { EstadoGlobal } from "../../core";
import { IndexMain } from "../indexContracts";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";

export namespace EditarInformacionBasica {
  export namespace Comandos {
    export const IngresaTuCodigo = `Ingresa tu código`;
    export const VerificaTuCodigo = `Verifica tu código`;
  }

  let nombreContexto = "EditarInformacionBasicaReceiver";

  export class EditarInformacionBasicaReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    constructor(estadoGlobal: EstadoGlobal, indexMain: IndexMain) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.responderEditarInformacionBasica = this.responderEditarInformacionBasica.bind(
        this
      );
    }

    public responderEditarInformacionBasica(msg: Message) {
      this.enviarMensajeHTML(
        msg,
        Comandos.IngresaTuCodigo,
        "Ingresa tu código"
      );
    }

    protected onRecibirMensaje(msg: Message) {
      if (
        this.estaComandoEnContexto(
          MenuPrincipal.Comandos.MenuPrincipal,
          this.indexMain.menuPrincipalReceiver.nombreContexto
        ) &&
        msg.text == MenuPrincipal.Comandos.MenuPrincipalOpts.EditarInfoBasica
      ) {
        this.responderEditarInformacionBasica(msg);
      } else if (this.estaComandoEnContexto(Comandos.IngresaTuCodigo)) {
        this.actualizarCodigo(msg);
      }
    }

    private actualizarCodigo(msg: Message){
      let estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
      estudiante.codigo = msg.text;
      Data.Estudiantes.actualizarChat(
        msg,
        this.estadoGlobal,
        estudiante
      ).then(
        () => {
          this.enviarMensajeHTML(msg, Comandos.VerificaTuCodigo, Comandos.VerificaTuCodigo);
        },
        () => {
          console.error("AccesoEstudianteReceiver/onRecibirComandoStart");
        }
      );
    }
  }
}
