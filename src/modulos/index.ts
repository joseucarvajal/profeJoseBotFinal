import { bot } from '../initBot';
import * as Data from '../data';

import { Message } from "../bot/Message";
import { SendMessageOptions } from "../bot/SendMessageOptions";
import { BotSender } from "./bot/BotSender";

import { ChatModel } from "../core/models";
import {
    Contextos,
    Comandos
} from '../core';
import { Validaciones } from '../utils';

import { index as paginaInicialIndex } from './pagina-inicial';

export namespace index {

    let botSender: BotSender = new BotSender();

    class Main {

        public escucharMensajesBot(){
            this.onRecibirComandoString();
        }

        private onRecibirComandoString(){
            bot.onText(/^\/start$/, (msg: Message, match: any) => {
                console.log("msg received " + msg.chat.id);
                botSender.enviarMensajeHTML(msg, `Hola desde main`);
            });
        }
    }

    let main:Main = new Main();
    main.escucharMensajesBot();
}

    /*
    export namespace Metodos {

        export const sendMessage = (msg: Message) => {

            const messageOptions = {
                parse_mode: 'HTML'
            } as SendMessageOptions;

            bot.sendMessage(
                msg.chat.id,
                `Hola estudiante`,
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

                botSender.enviarMensajeHTML(msg, `Hola desde messenger`);
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
*/