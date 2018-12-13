import { Message } from "../../bot/Message";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { bot } from '../../initBot';
import * as Data from '../../data';
import {
    Contextos,
    Comandos,
    ChatModel,
    ProductoModel,
    MovimientoModel
} from '../../core';
import { ApiMessage } from "../../api/ApiMessage";
import { EditMessageReplyMarkupOptions } from "../../bot/EditMessageReplyMarkupOptions";
import { InlineKeyboardMarkup } from "../../bot/InlineKeyboardMarkup";
import { EditMessageTextOptions } from "../../bot/EditMessageTextOptions";
import { Validaciones } from "../../utils/validations";



export namespace Extracto {

    enum Options {

        SeleccionarProducto = 'Selecciona un producto',

        Ene = 'Ene',
        Feb = 'Feb',
        Mar = 'Mar',
        Abr = 'Abr',
        May = 'May',
        Jun = 'Jun',
        Jul = 'Jul',
        Ago = '🕐Ago',
        Sep = 'Sep',
        Oct = 'Oct',
        Nov = 'Nov',
        Dic = 'Dic',

        Volver = '<< Volver',
    }

    const nombresMeses = {
        [Comandos.Consultas.Extracto.ene]: 'Enero',
        [Comandos.Consultas.Extracto.feb]: 'Febrero',
        [Comandos.Consultas.Extracto.abr]: 'Abril',
        [Comandos.Consultas.Extracto.may]: 'Mayo',
        [Comandos.Consultas.Extracto.jun]: 'Junio',
        [Comandos.Consultas.Extracto.jul]: 'Julio',
        [Comandos.Consultas.Extracto.ago]: 'Agosto',
        [Comandos.Consultas.Extracto.sep]: 'Septiembre',
        [Comandos.Consultas.Extracto.oct]: 'Octubre',
        [Comandos.Consultas.Extracto.nov]: 'Noviembre',
        [Comandos.Consultas.Extracto.dic]: 'Diciembre'
    };

    export namespace Metodos {

        export const sendMessageSeleccionarProducto = (msg: Message, update?: boolean) => {
            const messageOptions = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: Options.SeleccionarProducto,
                                switch_inline_query_current_chat: Contextos.Consultas.Extracto.operacionProducto
                            }
                        ],
                        [
                            { text: Options.Volver, callback_data: Contextos.Consultas.Index.index }
                        ]
                    ],
                } as ReplyKeyboardMarkup
            } as SendMessageOptions;

            if (!update) {
                bot.sendMessage(
                    msg.chat.id,
                    `Elige un producto`,
                    messageOptions
                );

                return;
            }

            bot.editMessageText(`Elige un producto`, {
                message_id: msg.message_id,
                chat_id: msg.chat.id,
                reply_markup: messageOptions.reply_markup
            } as EditMessageTextOptions);
        }

        export const sendMessageSeleccionarMes = (msg: Message, update?: boolean) => {

            Data.Chats.actualizarChat(msg.chat.id, Contextos.Consultas.Extracto.seleccionMes, "").then(() => {

                const messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: Options.Ene, callback_data: Comandos.Consultas.Extracto.ene },
                                { text: Options.Feb, callback_data: Comandos.Consultas.Extracto.feb },
                                { text: Options.Mar, callback_data: Options.Mar }
                            ],
                            [
                                { text: Options.Abr, callback_data: Comandos.Consultas.Extracto.abr },
                                { text: Options.May, callback_data: Comandos.Consultas.Extracto.may },
                                { text: Options.Jun, callback_data: Comandos.Consultas.Extracto.jun }
                            ],
                            [
                                { text: Options.Jul, callback_data: Comandos.Consultas.Extracto.jul },
                                { text: Options.Ago, callback_data: Comandos.Consultas.Extracto.ago },
                                { text: Options.Sep, callback_data: Comandos.Consultas.Extracto.sep }
                            ],
                            [
                                { text: Options.Oct, callback_data: Comandos.Consultas.Extracto.oct },
                                { text: Options.Nov, callback_data: Comandos.Consultas.Extracto.nov },
                                { text: Options.Dic, callback_data: Comandos.Consultas.Extracto.dic }
                            ],
                            [
                                { text: Options.Volver, callback_data: Contextos.Consultas.Index.index }
                            ]

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

                bot.editMessageText(`📅 Elige un mes para consultar`, {
                    message_id: msg.message_id,
                    chat_id: msg.chat.id,
                    reply_markup: messageOptions.reply_markup
                } as EditMessageTextOptions);
            });
        }

        export const sendMessageReporteXMes = (msg: Message, mes: string) => {

            Data.Chats.getChatByUserId(msg.chat.id).then((userChat: ChatModel) => {

                if (!userChat.datosComando) {
                    return
                }

                Data.Productos.getProductoClienteById(msg.chat.id, userChat.datosComando).then((productoDeCliente: ProductoModel) => {

                    Data.Movimientos.getMovimientosDeCliente(msg.chat.id).then((movimientosCliente: Array<MovimientoModel>) => {

                        let datosMovimientos: string = `<b>Movimientos:</b>`;


                        for (var i = 0; i < movimientosCliente.length; i++) {
                            let fecha = Validaciones.generarFecha(movimientosCliente[i].fechaHora);

                            datosMovimientos = datosMovimientos + `
<b>Fecha:</b> ${fecha} 
<b>Tipo:</b> ${movimientosCliente[i].tipo}
<b>Cuenta:</b> ${movimientosCliente[i].numero} 
<b>Valor:</b> ${movimientosCliente[i].valor}

`
                        }

                        Data.Chats.actualizarChat(msg.chat.id, Contextos.Consultas.Extracto.reporte, "").then(() => {

                            const messageOptions = {
                                parse_mode: 'HTML',
                                message_id: msg.message_id,
                                chat_id: msg.chat.id,
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: Options.Volver, callback_data: Contextos.Consultas.Extracto.operacionProducto }
                                        ]

                                    ] as ReplyKeyboardMarkup
                                } as InlineKeyboardMarkup
                            } as EditMessageTextOptions;

                            let fechaHoy = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

                            let textoMensaje =
                                `<b>Banco. KodeFest8</b>, ${fechaHoy}

<b>Extracto Cuenta Nro:</b> ${productoDeCliente.numero}

<b>${msg.from.first_name}:</b>, ${fechaHoy}

${datosMovimientos}`;

                            bot.editMessageText(textoMensaje, messageOptions);
                        });
                    });
                });
            });
        }

        export const onOperacionProducto = (msg: ApiMessage) => {
            sendMessageSeleccionarProducto(msg.message, true);
        }

        export const onProductoSeleccionado = (msg: ApiMessage, update?: boolean) => {
            sendMessageSeleccionarMes(msg.message, update);
        }

        export const onSelectMes = (msg: ApiMessage, mes: string) => {
            sendMessageReporteXMes(msg.message, mes);
        }
    }

    export namespace eventHandlers {

        export const listen = () => {
            bot.on('message', (msg: Message) => {

                if (!msg.text) {
                    return;
                }
            });

            bot.on('callback_query', (msg: ApiMessage) => {

                if (!msg.data) {
                    return;
                }

                if (msg.data.indexOf(Contextos.Consultas.Extracto.operacionProducto) === 0) {
                    Metodos.onOperacionProducto(msg);
                }

                Data.Chats.getChat(msg.message).then((chat: ChatModel) => {

                    if (chat.contexto != Contextos.Consultas.Extracto.seleccionMes) {
                        return;
                    }

                    if (msg.data.indexOf(Comandos.Consultas.Extracto.ago) === 0) {
                        Metodos.onSelectMes(msg, Comandos.Consultas.Extracto.ago);
                    }
                })
            });

            bot.on('inline_query', (msg: ApiMessage) => {

                if (!msg.query) {
                    return;
                }

                if (msg.query.indexOf(Contextos.Consultas.Extracto.operacionProducto) === 0) {

                    Data.Productos.getSaldoDeProductosByCliente(msg.from.id).then((productos) => {

                        bot.answerInlineQuery(
                            msg.id,
                            productos,
                            {
                                cache_time: '0'
                            }
                        );
                    });

                }
            });

            bot.on('chosen_inline_result', (msg: ApiMessage) => {

                if (!msg.query) {
                    return;
                }

                if (msg.query.indexOf(Contextos.Consultas.Extracto.operacionProducto) === 0) {
                    Metodos.onProductoSeleccionado({ message: { chat: { id: msg.from.id } } } as ApiMessage, false);
                    Data.Chats.actualizarDatoComando(msg.from.id, msg.result_id.toString());
                }
            });

        }
    }
}

Extracto.eventHandlers.listen();