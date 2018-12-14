export * from './inscribir-cuenta';
export * from './inscribir-cuenta-servicios';
export * from './pagar-servicio';
export * from './pagar-servicio-seleccionar-producto';
export * from './pagar-servicio-seleccionado';

import { bot } from '../../initBot';
import * as Data from '../../data';

import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import {
    Contextos,
    Comandos
} from '../../core';
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { EditMessageTextOptions } from "../../bot/EditMessageTextOptions";
import { ApiMessage } from "../../api/ApiMessage";

export namespace index {

    export enum Options {
        PagarServicios = 'Pagar Servicios',
        InscribirCuentaServicios = 'Inscribir Cuenta Servicios',
        Volver = "<< Volver"
    }

    export namespace Metodos {

        export const sendMessage = (msg: Message, update?: boolean) => {

            Data.Chats.actualizarChat(msg.chat.id, Contextos.Facturas.Index.index, "").then(() => {
                const messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: Options.PagarServicios,
                                    switch_inline_query_current_chat: Contextos.Facturas.PagarServicio.pagarServicio
                                }
                            ],
                            [
                                {
                                    text: Options.InscribirCuentaServicios,
                                    switch_inline_query_current_chat: Contextos.Facturas.InscribirCuentaServicios.seleccionServicio
                                }
                            ],
                            [
                                {
                                    text: Options.Volver,
                                    callback_data: Contextos.PaginaInicial.menuPrincipal
                                }
                            ]
                        ],
                    } as ReplyKeyboardMarkup
                } as SendMessageOptions;

                if (!update) {
                    bot.sendMessage(
                        msg.chat.id,
                        `¿Qué quieres hacer?`,
                        messageOptions
                    );

                    return;
                }

                bot.editMessageText(`Elige una operación`, {
                    message_id: msg.message_id,
                    chat_id: msg.chat.id,
                    reply_markup: messageOptions.reply_markup
                } as EditMessageTextOptions);
            });
        };

        export const onFacturas = (msg: Message, update?: boolean) => {
            sendMessage(msg, update);
        }
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('message', (msg: Message) => {

                if (!msg.text ||
                    msg.text === '/start') {
                    return;
                }

                if (msg.text.indexOf(Comandos.PaginaInicial.MenuPrincipal.facturas) === 0) {
                    Metodos.onFacturas(msg);
                }
            });

            bot.on('callback_query', (msg: ApiMessage) => {

                if (!msg.data) {
                    return;
                }

                if (msg.data.indexOf(Contextos.Facturas.Index.index) === 0) {
                    Metodos.onFacturas(msg.message, true);
                }
            });
        }
    }
}

//index.eventHandlers.listen();