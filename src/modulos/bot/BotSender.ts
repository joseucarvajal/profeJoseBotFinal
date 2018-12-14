import { bot } from "../../initBot";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { KeyboardButton } from "../../bot/KeyboardButton";

export class BotSender {
  responderMensajeHTML(msgEntrante: Message, htmlText: string): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML"
    } as SendMessageOptions;

    return bot.sendMessage(msgEntrante.chat.id, htmlText, messageOptions);
  }

  responderMensajeErrorHTML(msgEntrante: Message, htmlText: string): Promise<any> {
    const messageOptions = {
      parse_mode: "HTML"
    } as SendMessageOptions;

    return bot.sendMessage(msgEntrante.chat.id, `😔 ` + htmlText, messageOptions);
  }

  responderKeyboardMarkup(
    msg: Message,
    label: string,
    opcionesKeyboard: Array<Array<KeyboardButton>>
  ): Promise<any> {
    const messageOptions = {
      reply_markup: {
        remove_keyboard: true,
        one_time_keyboard: true,
        keyboard: opcionesKeyboard
      } as ReplyKeyboardMarkup
    } as SendMessageOptions;

    return bot.sendMessage(msg.chat.id, label, messageOptions);
  }
}
