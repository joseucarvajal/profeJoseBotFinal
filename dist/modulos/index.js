"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../initBot");
var BotSender_1 = require("./bot/BotSender");
var index;
(function (index) {
    var botSender = new BotSender_1.BotSender();
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.prototype.escucharMensajesBot = function () {
            this.onRecibirComandoString();
        };
        Main.prototype.onRecibirComandoString = function () {
            initBot_1.bot.onText(/^\/start$/, function (msg, match) {
                console.log("msg received " + msg.chat.id);
                botSender.enviarMensajeHTML(msg, "Hola desde main");
            });
        };
        return Main;
    }());
    var main = new Main();
    main.escucharMensajesBot();
})(index = exports.index || (exports.index = {}));
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
