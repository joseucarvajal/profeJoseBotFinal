import { Message } from "../../bot/Message";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { bot } from '../../initBot';
import * as Data from '../../data';

import { ChatModel } from "../../core/models";
import {
    Contextos,
    Comandos,
} from '../../core';
import { ApiMessage } from "../../api/ApiMessage";

export namespace MenuPrincipal {

    export namespace Metodos {

        export const sendMessage = (msg: Message) => {
            Data.Chats.guardarContexto(msg, Contextos.PaginaInicial.menuPrincipal).then(() => {
                const messageOptions = {
                    reply_markup: {
                        remove_keyboard: true,
                        one_time_keyboard: true,
                        keyboard: [
                            [{ text: Comandos.PaginaInicial.MenuPrincipal.consultas }],
                            [{ text: Comandos.PaginaInicial.MenuPrincipal.adquirirProducto }],
                            [{ text: Comandos.PaginaInicial.MenuPrincipal.facturas }],
                            [{ text: Comandos.PaginaInicial.MenuPrincipal.transferencias }]
                        ],
                    } as ReplyKeyboardMarkup
                } as SendMessageOptions;

                bot.sendMessage(
                    msg.chat.id,
                    `¿Qué quieres hacer?`,
                    messageOptions
                );
            });
        }

        export const onMenuPrincipal = (msg: Message) => {
            sendMessage(msg);
        }
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('callback_query', (msg: ApiMessage) => {

                if (!msg.data) {
                    return;
                }

                if (msg.data.indexOf(Contextos.PaginaInicial.menuPrincipal) === 0) {
                    Metodos.onMenuPrincipal(msg.message);
                }
            });
        }
    }
}

MenuPrincipal.eventHandlers.listen();