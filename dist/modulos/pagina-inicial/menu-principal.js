"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var MenuPrincipal;
(function (MenuPrincipal) {
    var Metodos;
    (function (Metodos) {
        Metodos.sendMessage = function (msg) {
            Data.Chats.guardarContexto(msg, core_1.Contextos.PaginaInicial.menuPrincipal).then(function () {
                var messageOptions = {
                    reply_markup: {
                        remove_keyboard: true,
                        one_time_keyboard: true,
                        keyboard: [
                            [{ text: core_1.Comandos.PaginaInicial.MenuPrincipal.consultas }],
                            [{ text: core_1.Comandos.PaginaInicial.MenuPrincipal.adquirirProducto }],
                            [{ text: core_1.Comandos.PaginaInicial.MenuPrincipal.facturas }],
                            [{ text: core_1.Comandos.PaginaInicial.MenuPrincipal.transferencias }]
                        ],
                    }
                };
                initBot_1.bot.sendMessage(msg.chat.id, "\u00BFQu\u00E9 quieres hacer?", messageOptions);
            });
        };
        Metodos.onMenuPrincipal = function (msg) {
            Metodos.sendMessage(msg);
        };
    })(Metodos = MenuPrincipal.Metodos || (MenuPrincipal.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('callback_query', function (msg) {
                if (!msg.data) {
                    return;
                }
                if (msg.data.indexOf(core_1.Contextos.PaginaInicial.menuPrincipal) === 0) {
                    Metodos.onMenuPrincipal(msg.message);
                }
            });
        };
    })(eventHandlers = MenuPrincipal.eventHandlers || (MenuPrincipal.eventHandlers = {}));
})(MenuPrincipal = exports.MenuPrincipal || (exports.MenuPrincipal = {}));
//MenuPrincipal.eventHandlers.listen();
