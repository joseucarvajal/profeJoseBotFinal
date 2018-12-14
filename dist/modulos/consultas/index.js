"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./extracto"));
__export(require("./saldos"));
var initBot_1 = require("../../initBot");
var core_1 = require("../../core");
var Data = require("../../data");
var Index;
(function (Index) {
    var Options;
    (function (Options) {
        Options["Saldos"] = "Saldos";
        Options["Extracto"] = "Extracto";
        Options["Movimientos"] = "Movimientos";
        Options["Volver"] = "<< Volver";
    })(Options = Index.Options || (Index.Options = {}));
    var Metodos;
    (function (Metodos) {
        Metodos.sendMessage = function (msg, update) {
            Data.Chats.actualizarChat(msg.chat.id, core_1.Contextos.Consultas.Index.index, "").then(function () {
                var messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: Options.Saldos,
                                    switch_inline_query_current_chat: core_1.Contextos.Consultas.Saldos.saldos
                                }
                            ],
                            [
                                {
                                    text: Options.Extracto,
                                    callback_data: core_1.Contextos.Consultas.Extracto.operacionProducto
                                }
                            ],
                            [
                                {
                                    text: Options.Volver,
                                    callback_data: core_1.Contextos.PaginaInicial.menuPrincipal
                                }
                            ]
                        ],
                    }
                };
                if (!update) {
                    initBot_1.bot.sendMessage(msg.chat.id, "\u00BFQu\u00E9 quieres consultar?", messageOptions);
                    return;
                }
                initBot_1.bot.editMessageText("Elige una operaci\u00F3n", {
                    message_id: msg.message_id,
                    chat_id: msg.chat.id,
                    reply_markup: messageOptions.reply_markup
                });
            });
        };
        Metodos.onConsultas = function (msg, update) {
            Metodos.sendMessage(msg, update);
        };
    })(Metodos = Index.Metodos || (Index.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('message', function (msg) {
                if (!msg.text) {
                    return;
                }
                if (msg.text.indexOf(core_1.Comandos.PaginaInicial.MenuPrincipal.consultas) === 0) {
                    Metodos.onConsultas(msg);
                }
            });
            initBot_1.bot.on('callback_query', function (msg) {
                if (!msg.data) {
                    return;
                }
                if (msg.data.indexOf(core_1.Contextos.Consultas.Index.index) === 0) {
                    Metodos.onConsultas(msg.message, true);
                }
            });
            initBot_1.bot.onText(/^\/consultas$/, function (msg, match) {
                Data.Chats.guardarNuevaConfiguracionDeUsuario(msg).then(function () {
                    Metodos.sendMessage(msg);
                });
            });
        };
    })(eventHandlers = Index.eventHandlers || (Index.eventHandlers = {}));
})(Index = exports.Index || (exports.Index = {}));
//Index.eventHandlers.listen();
