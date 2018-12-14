import { Message } from "../../bot/Message";
import { BotSender } from "./BotSender";
import {
  EstadoGlobal,
  InformacionContexto
} from "../../core";

import * as Data from "../../data";
import { IndexMain } from "../indexContracts";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { ApiMessage } from "../../api/ApiMessage";

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
    if (!msg.text && !msg.contact) {
      return;
    }

    this.onRecibirMensaje(msg);
  }

  public onRecibirInlineQueryBase(msg: ApiMessage){
    this.onRecibirInlineQuery(msg);
  }
  onRecibirInlineQuery(msg: ApiMessage){}

  public onChosenInlineResultBase(msg: ApiMessage){
    this.onChosenInlineResult(msg);
  }
  onChosenInlineResult(msg: ApiMessage){}

  private estaEnContextoActual(contexto?: string): boolean {
    if (!this.estadoGlobal.infoUsuarioMensaje.estudiante) {
      return false;
    }

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
    fn: (msg: Message & ApiMessage) => void,
    msg: Message & ApiMessage,
    comandoARegistrarEstudiante: string
  ) {
    this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto =
      instanciaReceiver.nombreContexto;
    this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comandoARegistrarEstudiante;

    Data.Estudiantes.actualizarChat(
      msg,
      this.estadoGlobal,
      this.estadoGlobal.infoUsuarioMensaje.estudiante
    ).then(() => {
      fn(msg);
    });
  }

  protected enviarMensajeHTML(
    msg: Message & ApiMessage,
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

  protected actualizarContextoComando(
    msg: Message,
    comando: string
  ): Promise<any> {
    this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
    this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
    return Data.Estudiantes.actualizarChat(
      msg,
      this.estadoGlobal,
      this.estadoGlobal.infoUsuarioMensaje.estudiante
    );
  }

  protected goToAndGuardarContextoComando(
    instanciaReceiver: BotReceiver,
    fn: (msg: Message) => void,
    msg: Message & ApiMessage,
    comando: string,
  ) {
    this.actualizarContextoComando(msg, comando).then(() => {
      this.enviarMensajeAReceiver(instanciaReceiver, fn, msg, comando);
    });
  }

  protected enviarMensajeKeyboardMarkup(
    msg: Message,
    label: string,
    opcionesKeyboard: Array<Array<KeyboardButton>>,
    comando: string
  ): Promise<any> {
    this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
    this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
    Data.Estudiantes.actualizarChat(
      msg,
      this.estadoGlobal,
      this.estadoGlobal.infoUsuarioMensaje.estudiante
    ).then(() => {
      return this.botSender.responderKeyboardMarkup(
        msg,
        label,
        opcionesKeyboard
      );
    });

    return new Promise<any>(() => {});
  }

  protected seHaSeleccionadoOpcionDeMenu(
    msg: Message,
    opcion: string
  ): boolean {
    return this.estaEnContextoActual() && msg.text == opcion;
  }

  protected abstract onRecibirMensaje(msg: Message): void;
}