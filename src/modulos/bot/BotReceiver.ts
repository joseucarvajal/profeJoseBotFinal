import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";
import { BotSender } from "./BotSender";
import {
  EstadoGlobal,
  Estudiante,
  InfoUsuarioMensaje,
  InformacionContexto
} from "../../core";

import * as Data from "../../data";
import { IndexMain } from "../indexContracts";

export abstract class BotReceiver {
  informacionContexto: InformacionContexto;

  protected botSender: BotSender = new BotSender();
  public estadoGlobal: EstadoGlobal;
  protected abstract nombreContexto: string;
  public indexMain: IndexMain;

  constructor(
    estadoGlobal: EstadoGlobal,
    indexMain: IndexMain,
    nombreContexto: string
  ) {
    this.estadoGlobal = estadoGlobal;
    this.indexMain = indexMain;
    this.informacionContexto = {
      contexto: nombreContexto
    } as InformacionContexto;
  }

  public onRecibirMensajeBase(msg: Message) {
    if (!msg.text) {
      return;
    }

    this.onRecibirMensaje(msg);
  }

  private estaEnContextoActual(contexto?: string): boolean {
    if (contexto) {
      return (
        contexto == this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto
      );
    }

    return (
      this.nombreContexto ==
      this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto
    );
  }

  protected estaComandoEnContexto(comando: string, contexto?: string): boolean {
    return (
      this.estaEnContextoActual(contexto) &&
      this.estadoGlobal.infoUsuarioMensaje.estudiante.comando == comando
    );
  }

  protected enviarMensajeAReceiver(
    instanciaReceiver: BotReceiver,
    fn: (msg: Message) => void,
    msg: Message,
    comando: string
  ) {
    this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto =
      instanciaReceiver.nombreContexto;
    this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;

    Data.Estudiantes.actualizarChat(
      msg,
      this.estadoGlobal,
      this.estadoGlobal.infoUsuarioMensaje.estudiante
    ).then(() => {
      fn(msg);
    });
  }

  protected enviarMensajeHTML(
    msg: Message,
    comando: string,
    html: string
  ): Promise<any> {
    this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
    this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
    Data.Estudiantes.actualizarChat(
      msg,
      this.estadoGlobal,
      this.estadoGlobal.infoUsuarioMensaje.estudiante
    ).then(() => {
      return this.botSender.responderMensajeHTML(msg, html);
    });

    return new Promise<any>(() => {});
  }

  protected abstract onRecibirMensaje(msg: Message): void;
}
