import { Message } from "../../bot/Message";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { bot } from '../../initBot';
import * as Data from '../../data';

import { ChatModel } from "../../core/models";
import {
    Contextos,
    Comandos,
    ServicioModel,
    ProductoModel,
    ProductoBanco
} from '../../core';
import { ApiMessage } from "../../api/ApiMessage";
import { EditMessageTextOptions } from "../../bot/EditMessageTextOptions";
import { InlineKeyboardMarkup } from "../../bot/InlineKeyboardMarkup";

import { PagarServicioSeleccionado } from './pagar-servicio-seleccionado';

export namespace PagarServiciosSeleccionarProducto {

    export enum Options {
        SeleccionarProducto = "Seleccionar medio de pago",
        Volver = "<< Volver"
    }

    export namespace Metodos {

        export const sendMessage = (msg: Message, update?: boolean) => {

            Data.Chats.actualizarChat(msg.chat.id, Contextos.Facturas.PagarServicio.seleccionarProducto, "").then(() => {
                const messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: Options.SeleccionarProducto,
                                    switch_inline_query_current_chat: Contextos.Facturas.PagarServicio.seleccionarProducto
                                }
                            ],
                            [
                                {
                                    text: Options.Volver,
                                    callback_data: Contextos.Facturas.Index.index
                                }
                            ]
                        ],
                    } as ReplyKeyboardMarkup
                } as SendMessageOptions;

                if (!update) {
                    bot.sendMessage(
                        msg.chat.id,
                        `Seleccionar medio de pago`,
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

        export const onPagarServiciosSeleccionarProducto = (msg: Message, update?: boolean) => {
            sendMessage(msg, update);
        }

        export const onPagarServiciosProductoFondosInsuficientes = (msg: Message) => {
            bot.sendMessage(
                msg.chat.id,
                `Lo siento, tus fondos son insuficientes para pagar tu factura.`
            );
        }
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('inline_query', (msg: ApiMessage) => {

                if (!msg) {
                    return;
                }

                if (msg.query.indexOf(Contextos.Facturas.PagarServicio.seleccionarProducto) === 0) {
                    Data.Productos.getSaldoDeProductosByCliente(msg.from.id).then((productosByCliente: Array<ProductoModel>) => {
                        if (productosByCliente.length == 0) {
                            return;
                        }

                        bot.answerInlineQuery(msg.id, productosByCliente, {
                            cache_time: '0'
                        });
                    });
                }
            });

            bot.on('chosen_inline_result', (msg: ApiMessage) => {

                if (!msg) {
                    return;
                }

                if (!msg.result_id) {
                    return;
                }

                if (msg.query.indexOf(Contextos.Facturas.PagarServicio.seleccionarProducto) === 0) {
                    Data.Productos.getProductoClienteById(msg.from.id, msg.result_id).then((productoBanco: any) => {
                        if (!productoBanco) {
                            return;
                        }

                        if (productoBanco.saldo <= 0) {
                            Metodos.onPagarServiciosProductoFondosInsuficientes({
                                chat: {
                                    id: msg.from.id
                                }
                            } as Message);

                            return;
                        }

                        PagarServicioSeleccionado.Metodos.onPagarServicioSeleccionado({
                            chat: {
                                id: msg.from.id
                            }
                        } as Message, productoBanco as ProductoModel);
                    });
                }
            });
        }
    }
}

//PagarServiciosSeleccionarProducto.eventHandlers.listen();