import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import { EstadoGlobal } from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";

export namespace RegistrarAsistencia {

  export namespace Comandos {
    
  }

  let nombreContexto = "RegistrarAsistenciaReceiver";
  export class RegistrarAsistenciaReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

    }

    public responderMenuPrincipalEstudiante(msg: Message & ApiMessage) {
    }

    protected onRecibirMensaje(msg: Message & ApiMessage) {
      console.log("onRecibirMensaje: ", msg);
    }

    protected onRecibirInlineQuery(msg: Message & ApiMessage){
      console.log("onRecibirInlineQuery: ", msg);
    }
  }
}

