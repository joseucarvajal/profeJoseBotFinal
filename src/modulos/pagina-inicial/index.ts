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

import { MenuPrincipal as MenuPrincipalImpl } from './menu-principal';

export namespace index {

    export namespace Metodos {

        export const sendMessage = (msg: Message) => {

            const messageOptions = {
                parse_mode: 'HTML'
            } as SendMessageOptions;

            bot.sendMessage(
                msg.chat.id,
                `✅ Ingresa el código temporal que acabaste de recibir via SMS (<i>Cualquier valor es valido</i>)`,
                messageOptions
            );
        };

        export const enviarMensajeClaveIncorrecta = (msg: Message) => {
            bot.sendMessage(msg.chat.id, `❌ La código que ingresaste es incorrecto, vuelve a intentarlo.`);
        };

        export const enviarMensajeClaveInvalida = (msg: Message) => {
            bot.sendMessage(msg.chat.id, `❌ La código que ingresaste no es válido, este debe tener sólo números.`);
        };
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('message', (msg: Message) => {

                if (!msg.text ||
                    msg.text === '/start') {
                    return;
                }

                Data.Chats.getChat(msg).then((chat: ChatModel) => {
                    if (chat.contexto == Contextos.PaginaInicial.index
                        && chat.comando == Comandos.PaginaInicial.Index.getClave) {
                        if (msg.text) {
                            MenuPrincipalImpl.Metodos.sendMessage(msg);
                        } else {
                            Metodos.enviarMensajeClaveIncorrecta(msg);
                        }
                    }
                });
            });
        }
    }
}

index.eventHandlers.listen();