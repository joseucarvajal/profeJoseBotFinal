import { bot } from '../initBot';
import * as Data from '../data';

import { Message } from "../bot/Message";
import { SendMessageOptions } from "../bot/SendMessageOptions";

import { ChatModel } from "../core/models";
import {
    Contextos,
    Comandos
} from '../core';
import { Validaciones } from '../utils';

import { index as paginaInicialIndex } from './pagina-inicial';

export namespace index {

    export namespace Metodos {

        export const sendMessage = (msg: Message) => {

            const messageOptions = {
                parse_mode: 'HTML'
            } as SendMessageOptions;

            bot.sendMessage(
                msg.chat.id,
                `Hola <b>${msg.from.first_name}</b>, bienvenido al banco KodeFest8, por favor ingresa tu identificación`,
                messageOptions
            );
        };

        export const enviarMensajeIdentificacionInvalido = (msg: Message) => {
            bot.sendMessage(msg.chat.id, `❌ La identificación que ingresaste no es válida, esta debe tener sólo números.`);
        };

        export const solicitarClave = (msg: Message) => {

            Data.Chats.actualizarChat(msg.chat.id, Contextos.PaginaInicial.index, Comandos.PaginaInicial.Index.getClave).then(() => {
                paginaInicialIndex.Metodos.sendMessage(msg);
            });
        };
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.onText(/^\/start$/, (msg: Message, match: any) => {

                Data.Chats.actualizarChat(msg.chat.id, Contextos.PaginaInicial.index, Comandos.PaginaInicial.Index.getUsuario).then(() => {
                    Metodos.sendMessage(msg);
                });
            });

            bot.on('message', (msg: Message) => {

                if (!msg.text ||
                    msg.text === '/start') {
                    return;
                }

                Data.Chats.getChat(msg).then((chat: ChatModel) => {
                    if (chat.contexto == Contextos.PaginaInicial.index
                        && chat.comando == Comandos.PaginaInicial.Index.getUsuario) {
                        if (Validaciones.esNumeroRequeridoValido(msg.text)) {
                            Data.Clientes.actualizarDatosBasicos(msg, parseInt(msg.text)).then(() => {
                                Metodos.solicitarClave(msg);
                            });
                        } else {
                            Metodos.enviarMensajeIdentificacionInvalido(msg);
                        }
                    }
                });
            });
        }
    }
}

index.eventHandlers.listen();