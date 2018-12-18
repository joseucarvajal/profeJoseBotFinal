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

  enviarDocumento(msg: Message & ApiMessage, path: string): Promise<any> {
    return new Promise<any>(resolve => {

      let messageOptions = {
        caption: `Descarga el documento`
      };

      var config = { format: "A4" };

      let html = `
    <table border="1" cellspacing="0" style="width: 100%; border:1px solid;position: relative;">
      <tr>
        <th>hello</th>
        <th>world</th>
      </tr>
      <tr>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <td>2</td>
        <td>2</td>
      </tr>
    </table>
      `;
      pdf.create(html, config).toFile(path, (err: any, res: any) => {
        if (err) {
          return console.error(`Generating PDF`, err);
        }
        bot.sendDocument(msg.from.id, path, messageOptions, {}).then(() => {
          resolve();
        });
      });
    });
  }
}
