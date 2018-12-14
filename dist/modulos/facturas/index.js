"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./inscribir-cuenta"));
__export(require("./inscribir-cuenta-servicios"));
__export(require("./pagar-servicio"));
__export(require("./pagar-servicio-seleccionar-producto"));
__export(require("./pagar-servicio-seleccionado"));
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var index;
(function (index) {
    var Options;
    (function (Options) {
        Options["PagarServicios"] = "Pagar Servicios";
        Options["InscribirCuentaServicios"] = "Inscribir Cuenta Servicios";
        Options["Volver"] = "<< Volver";
    })(Options = index.Options || (index.Options = {}));
    var Metodos;
    (function (Metodos) {
        Metodos.sendMessage = function (msg, update) {
            Data.Chats.actualizarChat(msg.chat.id, core_1.Contextos.Facturas.Index.index, "").then(function () {
                var messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: Options.PagarServicios,
                                    switch_inline_query_current_chat: core_1.Contextos.Facturas.PagarServicio.pagarServicio
                                }
                            ],
                            [
                                {
                                    text: Options.InscribirCuentaServicios,
                                    switch_inline_query_current_chat: core_1.Contextos.Facturas.InscribirCuentaServicios.seleccionServicio
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
                    initBot_1.bot.sendMessage(msg.chat.id, "\u00BFQu\u00E9 quieres hacer?", messageOptions);
                    return;
                }
                initBot_1.bot.editMessageText("Elige una operaci\u00F3n", {
                    message_id: msg.message_id,
                    chat_id: msg.chat.id,
                    reply_markup: messageOptions.reply_markup
                });
            });
        };
        Metodos.onFacturas = function (msg, update) {
            Metodos.sendMessage(msg, update);
        };
    })(Metodos = index.Metodos || (index.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('message', function (msg) {
                if (!msg.text ||
                    msg.text === '/start') {
                    return;
                }
                if (msg.text.indexOf(core_1.Comandos.PaginaInicial.MenuPrincipal.facturas) === 0) {
                    Metodos.onFacturas(msg);
                }
            });
            initBot_1.bot.on('callback_query', function (msg) {
                if (!msg.data) {
                    return;
                }
                if (msg.data.indexOf(core_1.Contextos.Facturas.Index.index) === 0) {
                    Metodos.onFacturas(msg.message, true);
                }
            });
        };
    })(eventHandlers = index.eventHandlers || (index.eventHandlers = {}));
})(index = exports.index || (exports.index = {}));
//index.eventHandlers.listen();
