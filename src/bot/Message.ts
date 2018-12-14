/**
 * @author Jose Ubaldo Carvajal <joseucarvajal@gmail.com>
 * @author Luis Felipe Mejia Castrillon <luisfe_617@outlook.com>
 * See {@link https://core.telegram.org/bots/api#message}
 */

import { User } from "./User";
import { Chat } from "./Chat";
import { Location } from "./Location";

export interface Contact {
    phone_number:string;
    first_name:string;
    last_name:string;
    user_id:string;
}

export interface Message {
    message_id: number;
    from: User;
    date: number;
    chat: Chat;
    text: string;
    location: Location;
    contact: Contact;
}
