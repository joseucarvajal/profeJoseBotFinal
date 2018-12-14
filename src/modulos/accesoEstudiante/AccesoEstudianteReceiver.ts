import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { BotSender } from "../bot/BotSender";
import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from "../../bot/KeyboardButton";

import * as Data from "../../data";
import { EstadoGlobal, InformacionContexto } from "../../core";
import { IndexMain } from "../indexContracts";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";

export namespace AccesoEstudiante {
  export namespace Comandos {
    export const IngresarCodigoProfesor = `❓Para empezar, ingresa el código provisto por el profesor`;
  }

  let nombreContexto = "AccesoEstudianteReceiver";

  export class AccesoEstudianteReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    constructor(estadoGlobal: EstadoGlobal, indexMain: IndexMain) {
      super(estadoGlobal, indexMain, nombreContexto);
    }

    private onRecibirComandoStart(msg: Message) {      

      let defaultEstudiante = {
        codigo:"",
        nombre: "",
        email: "",
        comando: Comandos.IngresarCodigoProfesor,
        contexto: this.nombreContexto,        
      };

      this.estadoGlobal.infoUsuarioMensaje.estudiante = {...defaultEstudiante, ...this.estadoGlobal.infoUsuarioMensaje.estudiante};

      Data.Estudiantes.actualizarChat(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante
      ).then(
        () => {
          this.botSender.responderMensajeHTML(
            msg,
            `Hola ${msg.from.first_name}, soy el asistente del profe Jose`
          ).then(()=>{
            this.botSender.responderMensajeHTML(
              msg,
              Comandos.IngresarCodigoProfesor
            );  
          });
        },
        () => {
          console.error("AccesoEstudianteReceiver/onRecibirComandoStart");
        }
      );
    }

    protected onRecibirMensaje(msg: Message) {
      if (msg.text == "/start") {
        this.onRecibirComandoStart(msg);
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
