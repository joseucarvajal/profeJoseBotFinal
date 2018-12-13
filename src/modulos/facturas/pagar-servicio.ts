import { Message } from "../../bot/Message";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { bot } from '../../initBot';
import * as Data from '../../data';

import { ChatModel } from "../../core/models";
import {
    Contextos,
    Comandos,
    ServicioModel
} from '../../core';
import { ApiMessage } from "../../api/ApiMessage";
import { EditMessageTextOptions } from "../../bot/EditMessageTextOptions";
import { InlineKeyboardMarkup } from "../../bot/InlineKeyboardMarkup";

import { PagarServiciosSeleccionarProducto } from './pagar-servicio-seleccionar-producto';

export namespace PagarServicios {

    export namespace Metodos {

        export const onValidacionServiciosInscritosByCliente = (msg: Message) => {
            bot.sendMessage(
                msg.chat.id,
                `No tienes servicios para pagar.`
            );
        }
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('inline_query', (msg: ApiMessage) => {

                if (!msg) {
                    return;
                }

                if (msg.query.indexOf(Contextos.Facturas.PagarServicio.pagarServicio) === 0) {
                    Data.Clientes.getEmpresasInscritasFromCliente({ chat: { id: msg.from.id } } as Message).then((empresasInscritasByCliente: Array<ServicioModel>) => {

                        if (empresasInscritasByCliente.length == 0) {
                            Metodos.onValidacionServiciosInscritosByCliente({ chat: { id: msg.from.id } } as Message);
                            return;
                        }

                        let serviciosInscritosList = [];

                        for (var i = 0; i < empresasInscritasByCliente.length; i++) {

                            serviciosInscritosList.push({
                                id: !empresasInscritasByCliente[i].id ? '' : empresasInscritasByCliente[i].id,
                                type: 'article',
                                title: !empresasInscritasByCliente[i].nombre ? '' : empresasInscritasByCliente[i].nombre,
                                description: !empresasInscritasByCliente[i].descripcion ? '' : empresasInscritasByCliente[i].descripcion,
                                input_message_content: {
                                    message_text: `✅ ${!empresasInscritasByCliente[i].nombre ? '' : empresasInscritasByCliente[i].nombre} seleccionada`
                                },
                                thumb_url: !empresasInscritasByCliente[i].icono ? '' : empresasInscritasByCliente[i].icono
                            });
                        }

                        bot.answerInlineQuery(msg.id, serviciosInscritosList, {
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

                if (msg.query.indexOf(Contextos.Facturas.PagarServicio.pagarServicio) === 0) {
                    Data.Chats.actualizarDatoComando(msg.from.id, msg.result_id.toString()).then(() => {
                        PagarServiciosSeleccionarProducto.Metodos.onPagarServiciosSeleccionarProducto({
                            chat: {
                                id: msg.from.id
                            },
                            message_id: msg.id
                        } as Message);
                    });
                }
            });
        }
    }
}

PagarServicios.eventHandlers.listen();