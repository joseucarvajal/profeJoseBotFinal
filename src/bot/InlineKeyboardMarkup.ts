/**
 * @author Jose Ubaldo Carvajal <joseucarvajal@gmail.com>
 * @author Luis Felipe Mejia Castrillon <luisfe_617@outlook.com>
 * See {@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}
 */

import {
    InlineKeyboardButton
} from './InlineKeyboardButton';

export interface InlineKeyboardMarkup {
    inline_keyboard: Array<Array<InlineKeyboardButton>>;
}