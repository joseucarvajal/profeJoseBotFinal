import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import {
  EstadoGlobal,
  ListadoAsignaturas,
  Asignatura
} from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { ApiMessage } from "../../api/ApiMessage";

export namespace InscribirAsignatura {
  export namespace Comandos {
    export const SeleccionarAsignatura = `SeleccionarAsignatura`;

    export enum SeleccionarAsignaturaOptsEnum {
      SeleccionarAsignatura = "✔️Seleccionar asignatura"
    }
  }

  let nombreContexto = "InscribirAsignaturaReceiver";

  export class InscribirAsignaturaReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    seleccionarAsignaturaInlineOpts: Array<Array<InlineKeyboardButton>> = [
      [
        {
          text: Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura,
          switch_inline_query_current_chat: ""
        }
      ]
    ];

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.mostrarOpcionSeleccionarAsignaturas = this.mostrarOpcionSeleccionarAsignaturas.bind(
        this
      );
    }

    public mostrarOpcionSeleccionarAsignaturas(msg: Message & ApiMessage) {
      this.actualizarContextoComando(
        msg,
        Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura
      ).then(() => {
        this.botSender.responderInlineKeyboard(
          msg,
          `Haz click en la opción <b>"${
            Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura
          }"</b> para seleccionar tus asignaturas`,
          this.seleccionarAsignaturaInlineOpts
        );
      });
    }

    protected onRecibirMensaje(msg: Message): void {}

    public onRecibirInlineQuery(msg: Message & ApiMessage) {
      if (
        !this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura
        )
      ) {
        return;
      }

      this.enviarListadoAsignaturas(msg);
    }

    private enviarListadoAsignaturas(msg: Message & ApiMessage){
      Data.Asignacion.getAsignaturasXPeriodoAndDocente(
        this.estadoGlobal
      ).then((listadoAsignaturasXDocente: ListadoAsignaturas) => {
        let listaAsignaturas = new Array<any>();
        let asignatura: Asignatura;
        for (let codigoAsignatura in listadoAsignaturasXDocente) {
          asignatura = listadoAsignaturasXDocente[codigoAsignatura];
          listaAsignaturas.push({
            id: asignatura.codigo,
            type: "article",
            title: asignatura.nombre,
            input_message_content: {
              message_text: `Has seleccionado ${asignatura.nombre}`
            }
          });
        }
        this.botSender.responderInLineQuery(msg, listaAsignaturas);
      });
    }

    onChosenInlineResult(msg: ApiMessage & Message) {
      if (
        !this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura
        )
      ) {
        return;
      }

      this.registrarAsignaturaAEstudiante(msg);
    }

    private registrarAsignaturaAEstudiante(msg: ApiMessage & Message){
    }
  }
}
