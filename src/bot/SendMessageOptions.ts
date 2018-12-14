import { InlineKeyboardMarkup } from "./InlineKeyboardMarkup";
import { ReplyKeyboardMarkup } from "./ReplyKeyboardMarkup";
import { ReplyKeyboardRemove } from "./ReplyKeyboardRemove";

export interface SendMessageOptions {
    parse_mode: string;
    reply_markup: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove;    
}
