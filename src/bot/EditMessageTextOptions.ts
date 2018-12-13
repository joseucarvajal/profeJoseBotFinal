/**
 * @author Jose Ubaldo Carvajal <joseucarvajal@gmail.com>
 * @author Luis Felipe Mejia Castrillon <luisfe_617@outlook.com>
 * See {@link https://core.telegram.org/bots/api#message}
 */

import { User } from "./User";
import { Chat } from "./Chat";
import { Location } from "./Location";
import { InlineKeyboardMarkup } from "./InlineKeyboardMarkup";

export interface EditMessageTextOptions {
    message_id: number | string;
    chat_id: number;
    reply_markup:InlineKeyboardMarkup;
    parse_mode:string;
}