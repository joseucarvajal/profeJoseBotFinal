import { bot } from '../../initBot';
import * as Data from '../../data';

import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { ChatModel } from "../../core/models";
import {
    Contextos,
    Comandos
} from '../../core';
import { Validaciones } from '../../utils';
import { EditMessageTextOptions } from "../../bot/EditMessageTextOptions";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { InlineKeyboardMarkup } from "../../bot/InlineKeyboardMarkup";
import { ApiMessage } from "../../api/ApiMessage";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";

export namespace index {

    export namespace Metodos {

        enum Options {
            TransferirAUnAmigo = '💲 Transferir a un amigo, Cta. Ahorros',
            Volver = '<< Volver',
        }

        export const enviarMensajeError = (msg: Message, error: string) => {
            bot.sendMessage(msg.chat.id, `❌ ${error}`);
        };

        export const enviarMensajeExito = (msg: Message, exito: string) => {
            bot.sendMessage(msg.chat.id, `✅ ${exito}`);
        };

        export const enviarMensajeTransferirAmigo = (msg: Message, update?: boolean) => {
            Data.Chats.actualizarChat(msg.chat.id, Contextos.Transferencias.Index.index, "").then(() => {
                const messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: Options.TransferirAUnAmigo,
                                    switch_inline_query: Comandos.Transferencias.Index.TransferirAUnAmigo,
                                } as InlineKeyboardButton,
                            ],

                        ] as ReplyKeyboardMarkup
                    } as InlineKeyboardMarkup
                } as SendMessageOptions;

                if (!update) {
                    bot.sendMessage(
                        msg.chat.id,
                        `Elige una operación`,
                        messageOptions
                    );

                    return;
                }
            });
        }

        export const enviarMensajeOpcionesDeTransferencia = (msg: ApiMessage) => {
            Data.Chats.actualizarChat(msg.from.id, Contextos.Transferencias.Index.index, "").then(() => {

                let opcionesTransferencia = [
                    {
                        id: '$10.000',
                        type: 'article',
                        title: '$10.000',
                        input_message_content: {
                            message_text: `✔️ <i>${msg.from.first_name}</i> acaba de transferir <b>$10.000</b> a tu cuenta`,
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    },
                    {
                        id: '$20.000',
                        type: 'article',
                        title: '$20.000',
                        input_message_content: {
                            message_text: `✔️ <i>${msg.from.first_name}</i> acaba de transferir <b>$20.000</b> a tu cuenta`,
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    },
                    {
                        id: '$50.000',
                        type: 'article',
                        title: '$50.000',
                        input_message_content: {
                            message_text: `✔️ <i>${msg.from.first_name}</i> acaba de transferir <b>$50.000</b> a tu cuenta`,
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    },
                    {
                        id: '$100.000',
                        type: 'article',
                        title: '$100.000',
                        input_message_content: {
                            message_text: `✔️ <i>${msg.from.first_name}</i> acaba de transferir <b>$100.000</b> a tu cuenta`,
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    },
                    {
                        id: '$1.000.000',
                        type: 'article',
                        title: '$1.000.000',
                        input_message_content: {
                            message_text: `✔️ <i>${msg.from.first_name}</i> acaba de transferir <b>$1.000.000</b> a tu cuenta`,
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    }
                ];

                bot.answerInlineQuery(
                    msg.id,
                    opcionesTransferencia,
                    {
                        cache_time: '0'
                    }
                );
            });
        }
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('message', (msg: Message) => {

                if (!msg.text) {
                    return;
                }

                if (msg.text == Comandos.PaginaInicial.MenuPrincipal.transferencias) {
                    Metodos.enviarMensajeTransferirAmigo(msg, false);
                }
            });

            bot.on('inline_query', (msg: ApiMessage) => {

                if (!msg.query) {
                    return;
                }

                if (msg.query.indexOf(Comandos.Transferencias.Index.TransferirAUnAmigo) === 0) {
                    Data.Chats.getChatByUserId(msg.from.id).then((chat: ChatModel) => {
                        if (chat.contexto != Contextos.Transferencias.Index.index) {
                            return;
                        }
                        Metodos.enviarMensajeOpcionesDeTransferencia(msg);
                    })
                }
            });

            bot.on('chosen_inline_result', (msg: ApiMessage) => {

                if (!msg) {
                    return;
                }

                if (!msg.result_id) {
                    return;
                }

                if(msg.query != Comandos.Transferencias.Index.TransferirAUnAmigo){
                    return;
                }
/*
                console.log('choosen');
                console.log(msg);
*/
            });            
        }
    }
}

index.eventHandlers.listen();