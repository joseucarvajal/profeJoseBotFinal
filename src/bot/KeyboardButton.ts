/**
 * @author Luis Felipe Mejia Castrillon <luisfe_617@outlook.com>
 * See {@link https://core.telegram.org/bots/api#keyboardbutton}
 */

export interface KeyboardButton {
    text: string;
    request_contact?: boolean;
    request_location? :boolean;
}