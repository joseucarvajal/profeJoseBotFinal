import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { ApiMessage } from "../../api/ApiMessage";

const fs = require("fs");
var pdf = require("html-pdf");

export class BotSender {
  responderMensajeHTML(
    msgEntrante: Message & ApiMessage,
    htmlText: string
  ): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML"
    } as SendMessageOptions;

    let chatUserId = msgEntrante.chat
      ? msgEntrante.chat.id
      : msgEntrante.from.id;
    return bot.sendMessage(chatUserId, htmlText, messageOptions);
  }

  responderMensajeErrorHTML(
    msgEntrante: Message & ApiMessage,
    htmlText: string
  ): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML"
    } as SendMessageOptions;

    let chatUserId = msgEntrante.chat
      ? msgEntrante.chat.id
      : msgEntrante.from.id;
    return bot.sendMessage(chatUserId, `😔 ` + htmlText, messageOptions);
  }

  responderKeyboardMarkup(
    msgEntrante: Message & ApiMessage,
    label: string,
    opcionesKeyboard: Array<Array<KeyboardButton>>
  ): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
        one_time_keyboard: true,
        keyboard: opcionesKeyboard
      } as ReplyKeyboardMarkup
    } as SendMessageOptions;

    let chatUserId = msgEntrante.chat
      ? msgEntrante.chat.id
      : msgEntrante.from.id;
    return bot.sendMessage(chatUserId, label, messageOptions);
  }

  responderInlineKeyboard(
    msgEntrante: Message & ApiMessage,
    label: string,
    opcionesInlineKeyboard: Array<Array<InlineKeyboardButton>>
  ): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: opcionesInlineKeyboard,
        hide_keyboard: true
      } as ReplyKeyboardMarkup
    } as SendMessageOptions;

    let chatUserId = msgEntrante.chat
      ? msgEntrante.chat.id
      : msgEntrante.from.id;
    return bot.sendMessage(chatUserId, label, messageOptions);
  }

  responderInLineQuery(
    msg: ApiMessage,
    coleccionElementos: Array<any>
  ): Promise<any> {
    return bot.answerInlineQuery(msg.id, coleccionElementos, {
      cache_time: "0"
    });
  }

  enviarHTMLComoDocumentoPDF(msg: Message & ApiMessage, nombreDocumento: string, html:string, description:string): Promise<any> {
    return new Promise<any>(resolve => {

      let patDocumento = `./dist/tmp/${nombreDocumento}`;

      let messageOptions = {
        caption: description,
        parse_mode: "HTML",
      };

      var config = { format: "A4" };

      pdf.create(html, config).toFile(patDocumento, (err: any, res: any) => {
        if (err) {
          return console.error(`Generating PDF`, err);
        }
        bot.sendDocument(msg.from.id, patDocumento, messageOptions, {}).then(() => {
          resolve();
        });
      });
    });
  }

  //https://github.com/yagop/node-telegram-bot-api/blob/release/doc/api.md#TelegramBot+sendChatAction
  public enviarAction(msg: Message & ApiMessage, action:string, options?:any):Promise<any>{
    return bot.sendChatAction(msg.from.id, action, options);
  }

  public enviarActionTyping(msg: Message & ApiMessage, options?:any):Promise<any>{
    return bot.sendChatAction(msg.from.id, 'typing', options);
  }

}