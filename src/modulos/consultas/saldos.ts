import { bot } from '../../initBot';
import * as Data from '../../data';
import {
    Contextos,
    Comandos,
    ChatModel,
    ProductoModel
} from '../../core';

import { ApiMessage } from "../../api/ApiMessage";
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { InlineKeyboardMarkup } from "../../bot/InlineKeyboardMarkup";
import { EditMessageTextOptions } from "../../bot/EditMessageTextOptions";

import { AdquirirProducto } from "../adquirir-producto";

export namespace Saldo {

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('inline_query', (msg: ApiMessage) => {

                if (!msg.query) {
                    return;
                }

                if (msg.query.indexOf(Contextos.Consultas.Saldos.saldos) === 0) {
                    Data.Productos.getSaldoDeProductosByCliente(msg.from.id).then((productos) => {

                        let productosAdquiridos = productos;

                        if (!productosAdquiridos || productosAdquiridos.length === 0) {
                            productosAdquiridos.push({
                                id: '-1',
                                type: 'article',
                                title: 'Aun no has adquirido ninguno de nuestros productos',
                                input_message_content: {
                                    message_text: Comandos.PaginaInicial.MenuPrincipal.adquirirProducto,
                                },
                                description: 'Gracias por confiar en nosotros',
                                thumb_url: 'http://icons.iconarchive.com/icons/designcontest/ecommerce-business/48/wallet-icon.png'
                            });
                        }

                        bot.answerInlineQuery(
                            msg.id,
                            productosAdquiridos,
                            {
                                cache_time: '0'
                            }
                        );
                    });
                }
            });
        }

    }
}

Saldo.eventHandlers.listen();