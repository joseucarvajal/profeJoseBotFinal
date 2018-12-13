/**
 * @author Jose Ubaldo Carvajal <joseucarvajal@gmail.com>
 * @author Luis Felipe Mejia Castrillon <luisfe_617@outlook.com>
 * See {@link https://core.telegram.org/bots/api#message}
 */

import { User } from "./User";
import { Chat } from "./Chat";
import { Location } from "./Location";

export interface EditMessageReplyMarkupOptions {
    message_id: number | string;
    chat_id: number;    
}