/**
 * @author Luis Felipe Mejia Castrillon <luisfe_617@outlook.com>
 * See {@link https://core.telegram.org/bots/api#inlinekeyboardbutton}
 */

 export interface InlineKeyboardButton {
    text:string;
    url?:string;
    callback_data?:string;
    switch_inline_query?:string;
    switch_inline_query_current_chat?:string;
}