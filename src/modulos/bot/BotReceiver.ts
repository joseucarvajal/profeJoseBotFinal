import { Message } from "../../bot/Message";
import { BotSender } from "./BotSender";
import { EstadoGlobal, InformacionContexto, Asignatura } from "../../core";

import * as Data from "../../data";
import { MainReceiverContract } from "../indexContracts";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { Chat } from "../../bot/Chat";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";

export abstract class BotReceiver {
  informacionContexto: InformacionContexto;

  protected botSender: BotSender = new BotSender();
  public estadoGlobal: EstadoGlobal;
  protected abstract nombreContexto: string;
  public indexMain: MainReceiverContract;

  protected message: Message;
  protected apiMessage: ApiMessage;

  constructor(
    estadoGlobal: EstadoGlobal,
    indexMain: MainReceiverContract,
    nombreContexto: string
  ) {
    this.estadoGlobal = estadoGlobal;
    this.indexMain = indexMain;
    this.informacionContexto = {
      contexto: nombreContexto
    } as InformacionContexto;

    this.message = {} as Message;
    this.apiMessage = {} as ApiMessage;
  }

  public onRecibirMensajeBase(msg: Message & ApiMessage) {
    this.botSender.enviarActionTyping(msg).then(() => {
      if (!msg.text && !msg.contact) {
        return;
      }

      this.initializeMessage(msg);
      this.onRecibirMensaje(msg);
    });
  }

  public onRecibirInlineQueryBase(msg: Message & ApiMessage) {
    this.botSender.enviarActionTyping(msg).then(() => {
      this.initializeMessage(msg);
      this.onRecibirInlineQuery(msg);
    });
  }
  protected onRecibirInlineQuery(msg: Message & ApiMessage) {}

  public onChosenInlineResultBase(msg: Message & ApiMessage) {
    this.botSender.enviarActionTyping(msg).then(() => {
      this.initializeMessage(msg);
      this.onChosenInlineResult(msg);
    });
  }
  protected onChosenInlineResult(msg: Message & ApiMessage) {}

  public onCallbackQueryBase(msg: Message & ApiMessage) {
    this.botSender.enviarActionTyping(msg).then(() => {
      this.initializeMessage(msg);
      this.onCallbackQuery(msg);
    });
  }
  protected onCallbackQuery(msg: Message & ApiMessage) {}

  public onLocationBase(msg: Message & ApiMessage) {
    this.botSender.enviarActionTyping(msg).then(() => {
      this.initializeMessage(msg);
      this.onLocation(msg);
    });
  }
  protected onLocation(msg: Message) {}

  protected validarQueEstudianteHayaIngresadoDatosBasicos(
    msg: Message & ApiMessage
  ): boolean {
    if (
      !this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo ||
      !this.estadoGlobal.infoUsuarioMensaje.estudiante.nombre ||
      !this.estadoGlobal.infoUsuarioMensaje.estudiante.email
    ) {
      this.botSender
        .responderMensajeErrorHTML(
          msg,
          `No se puede responder la solicitud, primero debes <b>Actualizar tus datos básicos</b>`
        )
        .then(() => {
          this.irAMenuPrincipal(msg);
        });

      return false;
    }

    return true;
  }

  protected irAMenuPrincipal(msg: Message & ApiMessage) {
    this.enviarMensajeAReceiver(
      this.indexMain.menuPrincipalReceiver,
      this.indexMain.menuPrincipalReceiver.responderMenuPrincipalEstudiante,
      msg,
      MenuPrincipal.Comandos.MenuPrincipalEstudiante
    );
  }

  private initializeMessage(msg: Message & ApiMessage) {
    if (msg.chat) {
      this.message = msg;
      return;
    }
    this.apiMessage = msg;
  }

  protected estaEnContextoActual(contexto?: string): boolean {
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

  protected estaOpcionSeleccionadaEnContexto(
    opcionSeleccionada: string,
    msg: Message & ApiMessage
  ): boolean {
    return this.estaEnContextoActual() && msg.text == opcionSeleccionada;
  }

  protected estaComandoEnContexto(comando: string, contexto?: string): boolean {
    return (
      this.estaEnContextoActual(contexto) &&
      this.estadoGlobal.infoUsuarioMensaje.estudiante.comando === comando
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

    Data.Estudiantes.actualizarContextoChat(
      msg,
      this.estadoGlobal,
      this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto,
      this.estadoGlobal.infoUsuarioMensaje.estudiante.comando
    ).then(() => {
      fn(msg);
    });
  }

  protected enviarMensajeHTML(
    msg: Message & ApiMessage,
    comando: string,
    html: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
      this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
      Data.Estudiantes.actualizarContextoChat(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.comando  
      ).then(() => {
        this.botSender.responderMensajeHTML(msg, html).then(() => {
          resolve();
        });
      });
    });
  }

  enviarMensajeInlineKeyBoard(
    msg: Message & ApiMessage,
    comandoAActualizar: string,
    label: string,
    opcionesInlineKeyboard: Array<Array<InlineKeyboardButton>>
  ) {
    this.actualizarContextoComando(msg, comandoAActualizar).then(() => {
      this.botSender.responderInlineKeyboard(
        msg,
        label,
        opcionesInlineKeyboard
      );
    });
  }

  protected actualizarContextoComando(
    msg: Message,
    comando: string
  ): Promise<any> {
    this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
    this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
    return Data.Estudiantes.actualizarContextoChat(
      msg,
      this.estadoGlobal,
      this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto,
      this.estadoGlobal.infoUsuarioMensaje.estudiante.comando
    );
  }

  protected goToAndGuardarContextoComando(
    instanciaReceiver: BotReceiver,
    fn: (msg: Message) => void,
    msg: Message & ApiMessage,
    comando: string
  ) {
    this.actualizarContextoComando(msg, comando).then(() => {
      this.enviarMensajeAReceiver(instanciaReceiver, fn, msg, comando);
    });
  }

  protected enviarMensajeKeyboardMarkup(
    msg: Message & ApiMessage,
    label: string,
    opcionesKeyboard: Array<Array<KeyboardButton>>,
    comando: string
  ): Promise<any> {
    this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
    this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
    Data.Estudiantes.actualizarContextoChat(
      msg,
      this.estadoGlobal,
      this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto,
      this.estadoGlobal.infoUsuarioMensaje.estudiante.comando
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

  protected enviarMensajeErrorHTMLAProfesor(message: string) {
    let msg: Message & ApiMessage = {
      chat: {
        id: this.estadoGlobal.settings.idUsuarioChatDocente
      } as Chat
    } as Message & ApiMessage;

    this.botSender.responderMensajeErrorHTML(msg, message);
  }

  protected enviarMensajeHTMLAProfesor(message: string) {
    let msg: Message & ApiMessage = {
      chat: {
        id: this.estadoGlobal.settings.idUsuarioChatDocente
      } as Chat
    } as Message & ApiMessage;

    this.botSender.responderMensajeHTML(msg, message);
  }

  protected getMesssage(): Message | ApiMessage {
    if (this.message) {
      return this.message;
    }

    return this.apiMessage;
  }

  protected getAsignaturasFormatoInlineQuery(listadoAsignaturas: Array<Asignatura>):Array<any>{
    let opcionesListaAsignaturas = new Array<any>();
    let asignatura: Asignatura;
    for (let i = 0; i < listadoAsignaturas.length; i++) {
      asignatura = listadoAsignaturas[i];

      let mensajeHorarios = "";
      let horario;
      let horarioCounter = 0;
      for (let codigoHorario in asignatura.horarios) {
        horario = asignatura.horarios[codigoHorario];
        if (horarioCounter > 0) {
          mensajeHorarios += " y ";
        }
        mensajeHorarios +=
          horario.dia + ", " + horario.horaInicio + " a " + horario.horaFin;
        horarioCounter++;
      }

      opcionesListaAsignaturas.push({
        id: asignatura.codigo,
        type: "article",
        title: `${asignatura.nombre}, grupo ${asignatura.grupo}`,
        description: `${mensajeHorarios}`,
        input_message_content: {
          message_text: `${asignatura.nombre} (${asignatura.codigo}), grupo ${asignatura.grupo}`
        }
      });      
    }    

    return opcionesListaAsignaturas;
  }
}
