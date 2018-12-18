import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";
import { EstadoGlobal, Estudiante, Asignatura } from "../../core";
import { MainReceiverContract } from "../indexContracts";

import * as Data from "../../data";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { Chat } from "../../bot/Chat";

export namespace AccesoEstudiante {
  export namespace Comandos {
    export const SolicitarCodigo = "SolicitarCodigo";
  }

  export let nombreContexto = "AccesoEstudianteReceiver";

  export class AccesoEstudianteReceiver extends BotReceiver {

    nombreContexto = nombreContexto;

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);
    }

    private onRecibirComandoStart(msg: Message & ApiMessage) {

      this.inicializarDatosEstudianteContexto();

      this.enviarMensajeHTML(
        msg,
        Comandos.SolicitarCodigo,
        `Hola <b>${
          msg.from.first_name
        }!</b>. Soy el asistente del profe <i>Jose Ubaldo Carvajal</i>`
      ).then(()=>{        
        this.enviarAMenuEstudiante(msg);
      });
    }

    protected onRecibirMensaje(msg: Message & ApiMessage) {
      if (msg.text == "/start") {
        this.onRecibirComandoStart(msg);
      }       
    }


    private inicializarDatosEstudianteContexto() {
      let defaultEstudiante: Estudiante = {
        codigo: "",
        nombre: "",
        email: "",
        comando: Comandos.SolicitarCodigo,
        contexto: this.nombreContexto,
        inscripcionAsignaturasConfirmado: false,
        tempData: ""        
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
        this.indexMain.menuPrincipalReceiver
          .responderMenuPrincipalEstudiante,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudiante
      );
    }
  }
}


