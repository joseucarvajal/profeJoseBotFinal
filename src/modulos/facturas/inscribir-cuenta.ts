import { Message } from "../../bot/Message";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { bot } from '../../initBot';
import * as Data from '../../data';

import { ChatModel } from "../../core/models";
import {
    Contextos,
    Comandos,
    Constants,
    ServicioModel
} from '../../core';
import { ApiMessage } from "../../api/ApiMessage";
import { EditMessageTextOptions } from "../../bot/EditMessageTextOptions";
import { InlineKeyboardMarkup } from "../../bot/InlineKeyboardMarkup";

import {
    InscribirCuentaServicios
} from './inscribir-cuenta-servicios';

export namespace InscribirCuentaServicio {

    enum Options {
        Volver = '<< Volver',
    }

    export namespace Metodos {

        export const onValidacionServiciosInscritosByCliente = (msg: Message) => {
            bot.sendMessage(
                msg.chat.id,
                `No tienes servicios para inscribir.`
            );
        }
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('inline_query', (msg: ApiMessage) => {

                if (!msg) {
                    return;
                }

                if (msg.query.indexOf(Contextos.Facturas.InscribirCuentaServicios.seleccionServicio) === 0) {
                    InscribirCuentaServicios.getEmpresaServiciosByCliente(msg.from.id).then((serviciosResponseList: Array<ServicioModel>) => {

                        let serviciosInscritosList = [];

                        if (serviciosResponseList.length == 0) {
                            Metodos.onValidacionServiciosInscritosByCliente({ chat: { id: msg.from.id } } as Message);
                            return;
                        }

                        for (var i = 0; i < serviciosResponseList.length; i++) {

                            serviciosInscritosList.push({
                                id: serviciosResponseList[i].id,
                                type: 'article',
                                title: serviciosResponseList[i].nombre,
                                description: serviciosResponseList[i].descripcion,
                                input_message_content: {
                                    message_text: `✅ ${serviciosResponseList[i].nombre} inscrito con éxito!`
                                },
                                thumb_url: serviciosResponseList[i].icono
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

                if (msg.query.indexOf(Contextos.Facturas.InscribirCuentaServicios.seleccionServicio) === 0) {
                    Data.EmpresaServicio.getEmpresaServiciosById(msg.from.id, msg.result_id).then((snapshot: any) => {
                        if (!snapshot.val()) {
                            return;
                        }

                        Data.Clientes.setEmpresasInscritasToCliente({
                            chat: {
                                id: msg.from.id
                            }
                        } as Message, msg.result_id, snapshot.val())
                    });
                }
            });
        }
    }
}

//InscribirCuentaServicio.eventHandlers.listen();