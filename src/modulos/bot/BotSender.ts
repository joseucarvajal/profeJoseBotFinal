import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { ApiMessage } from "../../api/ApiMessage";
import { resolve } from "dns";

const fs = require("fs");
const pdf = require("pdf-thumbnail");

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
      fs.access(path, fs.F_OK, (err: any) => {
        if (err) {
          console.log("file to send doesn't exists", err);
          return;
        }

        const pdfBuffer = fs.readFileSync(path);

        const thumbnailOpts = {
          compress: {
            type: "JPEG", //default
            quality: 70 //default
          }
        };

        pdf(pdfBuffer /*Buffer or stream of the pdf*/, thumbnailOpts)
          .then((data: any) => {
            /*Stream of the image*/
            // ...
            /*
            bot.sendDocument(msg.from.id, path).then(() => {
              resolve();
            });
            */

            let messageOptions = {
              chat_id: msg.id,
              document:path
            };

            console.log("llega 2");

            bot.sendMessage(msg.id, messageOptions);
          })
          .catch((err: any) => {
            console.log("Error generatin PDF thumbnail", err);
          });
      });
    });
  }
}
