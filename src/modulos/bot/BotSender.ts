import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { ApiMessage } from "../../api/ApiMessage";

export class BotSender {
  responderMensajeHTML(msgEntrante: Message & ApiMessage, htmlText: string): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML"
    } as SendMessageOptions;

    let chatId = msgEntrante.chat ? msgEntrante.chat.id : msgEntrante.from.id;
    return bot.sendMessage(chatId, htmlText, messageOptions);
  }

  responderMensajeErrorHTML(
    msgEntrante: Message,
    htmlText: string
  ): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML"
    } as SendMessageOptions;

    return bot.sendMessage(
      msgEntrante.chat.id,
      `😔 ` + htmlText,
      messageOptions
    );
  }

  responderKeyboardMarkup(
    msg: Message,
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

    return bot.sendMessage(msg.chat.id, label, messageOptions);
  }

  responderInlineKeyboard(
    msg: Message,
    label: string,
    opcionesKeyboard: Array<Array<InlineKeyboardButton>>
  ): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: opcionesKeyboard
      } as ReplyKeyboardMarkup
    } as SendMessageOptions;

    return bot.sendMessage(msg.chat.id, label, messageOptions);
  }

  responderInLineQuery(
    msg: ApiMessage,
    coleccionElementos: Array<any>
  ): Promise<any> {
    return bot.answerInlineQuery(msg.id, coleccionElementos, {
      cache_time: "0",
    });
  }
}