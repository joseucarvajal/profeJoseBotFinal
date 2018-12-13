"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var pagar_servicio_seleccionado_1 = require("./pagar-servicio-seleccionado");
var PagarServiciosSeleccionarProducto;
(function (PagarServiciosSeleccionarProducto) {
    var Options;
    (function (Options) {
        Options["SeleccionarProducto"] = "Seleccionar medio de pago";
        Options["Volver"] = "<< Volver";
    })(Options = PagarServiciosSeleccionarProducto.Options || (PagarServiciosSeleccionarProducto.Options = {}));
    var Metodos;
    (function (Metodos) {
        Metodos.sendMessage = function (msg, update) {
            Data.Chats.actualizarChat(msg.chat.id, core_1.Contextos.Facturas.PagarServicio.seleccionarProducto, "").then(function () {
                var messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: Options.SeleccionarProducto,
                                    switch_inline_query_current_chat: core_1.Contextos.Facturas.PagarServicio.seleccionarProducto
                                }
                            ],
                            [
                                {
                                    text: Options.Volver,
                                    callback_data: core_1.Contextos.Facturas.Index.index
                                }
                            ]
                        ],
                    }
                };
                if (!update) {
                    initBot_1.bot.sendMessage(msg.chat.id, "Seleccionar medio de pago", messageOptions);
                    return;
                }
                initBot_1.bot.editMessageText("Elige una operaci\u00F3n", {
                    message_id: msg.message_id,
                    chat_id: msg.chat.id,
                    reply_markup: messageOptions.reply_markup
                });
            });
        };
        Metodos.onPagarServiciosSeleccionarProducto = function (msg, update) {
            Metodos.sendMessage(msg, update);
        };
        Metodos.onPagarServiciosProductoFondosInsuficientes = function (msg) {
            initBot_1.bot.sendMessage(msg.chat.id, "Lo siento, tus fondos son insuficientes para pagar tu factura.");
        };
    })(Metodos = PagarServiciosSeleccionarProducto.Metodos || (PagarServiciosSeleccionarProducto.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('inline_query', function (msg) {
                if (!msg) {
                    return;
                }
                if (msg.query.indexOf(core_1.Contextos.Facturas.PagarServicio.seleccionarProducto) === 0) {
                    Data.Productos.getSaldoDeProductosByCliente(msg.from.id).then(function (productosByCliente) {
                        if (productosByCliente.length == 0) {
                            return;
                        }
                        initBot_1.bot.answerInlineQuery(msg.id, productosByCliente, {
                            cache_time: '0'
                        });
                    });
                }
            });
            initBot_1.bot.on('chosen_inline_result', function (msg) {
                if (!msg) {
                    return;
                }
                if (!msg.result_id) {
                    return;
                }
                if (msg.query.indexOf(core_1.Contextos.Facturas.PagarServicio.seleccionarProducto) === 0) {
                    Data.Productos.getProductoClienteById(msg.from.id, msg.result_id).then(function (productoBanco) {
                        if (!productoBanco) {
                            return;
                        }
                        if (productoBanco.saldo <= 0) {
                            Metodos.onPagarServiciosProductoFondosInsuficientes({
                                chat: {
                                    id: msg.from.id
                                }
                            });
                            return;
                        }
                        pagar_servicio_seleccionado_1.PagarServicioSeleccionado.Metodos.onPagarServicioSeleccionado({
                            chat: {
                                id: msg.from.id
                            }
                        }, productoBanco);
                    });
                }
            });
        };
    })(eventHandlers = PagarServiciosSeleccionarProducto.eventHandlers || (PagarServiciosSeleccionarProducto.eventHandlers = {}));
})(PagarServiciosSeleccionarProducto = exports.PagarServiciosSeleccionarProducto || (exports.PagarServiciosSeleccionarProducto = {}));
PagarServiciosSeleccionarProducto.eventHandlers.listen();
