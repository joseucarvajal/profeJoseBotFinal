"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var validations_1 = require("../../utils/validations");
var Extracto;
(function (Extracto) {
    var _a;
    var Options;
    (function (Options) {
        Options["SeleccionarProducto"] = "Selecciona un producto";
        Options["Ene"] = "Ene";
        Options["Feb"] = "Feb";
        Options["Mar"] = "Mar";
        Options["Abr"] = "Abr";
        Options["May"] = "May";
        Options["Jun"] = "Jun";
        Options["Jul"] = "Jul";
        Options["Ago"] = "\uD83D\uDD50Ago";
        Options["Sep"] = "Sep";
        Options["Oct"] = "Oct";
        Options["Nov"] = "Nov";
        Options["Dic"] = "Dic";
        Options["Volver"] = "<< Volver";
    })(Options || (Options = {}));
    var nombresMeses = (_a = {},
        _a[core_1.Comandos.Consultas.Extracto.ene] = 'Enero',
        _a[core_1.Comandos.Consultas.Extracto.feb] = 'Febrero',
        _a[core_1.Comandos.Consultas.Extracto.abr] = 'Abril',
        _a[core_1.Comandos.Consultas.Extracto.may] = 'Mayo',
        _a[core_1.Comandos.Consultas.Extracto.jun] = 'Junio',
        _a[core_1.Comandos.Consultas.Extracto.jul] = 'Julio',
        _a[core_1.Comandos.Consultas.Extracto.ago] = 'Agosto',
        _a[core_1.Comandos.Consultas.Extracto.sep] = 'Septiembre',
        _a[core_1.Comandos.Consultas.Extracto.oct] = 'Octubre',
        _a[core_1.Comandos.Consultas.Extracto.nov] = 'Noviembre',
        _a[core_1.Comandos.Consultas.Extracto.dic] = 'Diciembre',
        _a);
    var Metodos;
    (function (Metodos) {
        Metodos.sendMessageSeleccionarProducto = function (msg, update) {
            var messageOptions = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: Options.SeleccionarProducto,
                                switch_inline_query_current_chat: core_1.Contextos.Consultas.Extracto.operacionProducto
                            }
                        ],
                        [
                            { text: Options.Volver, callback_data: core_1.Contextos.Consultas.Index.index }
                        ]
                    ],
                }
            };
            if (!update) {
                initBot_1.bot.sendMessage(msg.chat.id, "Elige un producto", messageOptions);
                return;
            }
            initBot_1.bot.editMessageText("Elige un producto", {
                message_id: msg.message_id,
                chat_id: msg.chat.id,
                reply_markup: messageOptions.reply_markup
            });
        };
        Metodos.sendMessageSeleccionarMes = function (msg, update) {
            Data.Chats.actualizarChat(msg.chat.id, core_1.Contextos.Consultas.Extracto.seleccionMes, "").then(function () {
                var messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: Options.Ene, callback_data: core_1.Comandos.Consultas.Extracto.ene },
                                { text: Options.Feb, callback_data: core_1.Comandos.Consultas.Extracto.feb },
                                { text: Options.Mar, callback_data: Options.Mar }
                            ],
                            [
                                { text: Options.Abr, callback_data: core_1.Comandos.Consultas.Extracto.abr },
                                { text: Options.May, callback_data: core_1.Comandos.Consultas.Extracto.may },
                                { text: Options.Jun, callback_data: core_1.Comandos.Consultas.Extracto.jun }
                            ],
                            [
                                { text: Options.Jul, callback_data: core_1.Comandos.Consultas.Extracto.jul },
                                { text: Options.Ago, callback_data: core_1.Comandos.Consultas.Extracto.ago },
                                { text: Options.Sep, callback_data: core_1.Comandos.Consultas.Extracto.sep }
                            ],
                            [
                                { text: Options.Oct, callback_data: core_1.Comandos.Consultas.Extracto.oct },
                                { text: Options.Nov, callback_data: core_1.Comandos.Consultas.Extracto.nov },
                                { text: Options.Dic, callback_data: core_1.Comandos.Consultas.Extracto.dic }
                            ],
                            [
                                { text: Options.Volver, callback_data: core_1.Contextos.Consultas.Index.index }
                            ]
                        ]
                    }
                };
                if (!update) {
                    initBot_1.bot.sendMessage(msg.chat.id, "Elige una operaci\u00F3n", messageOptions);
                    return;
                }
                initBot_1.bot.editMessageText("\uD83D\uDCC5 Elige un mes para consultar", {
                    message_id: msg.message_id,
                    chat_id: msg.chat.id,
                    reply_markup: messageOptions.reply_markup
                });
            });
        };
        Metodos.sendMessageReporteXMes = function (msg, mes) {
            Data.Chats.getChatByUserId(msg.chat.id).then(function (userChat) {
                if (!userChat.datosComando) {
                    return;
                }
                Data.Productos.getProductoClienteById(msg.chat.id, userChat.datosComando).then(function (productoDeCliente) {
                    Data.Movimientos.getMovimientosDeCliente(msg.chat.id).then(function (movimientosCliente) {
                        var datosMovimientos = "<b>Movimientos:</b>";
                        for (var i = 0; i < movimientosCliente.length; i++) {
                            var fecha = validations_1.Validaciones.generarFecha(movimientosCliente[i].fechaHora);
                            datosMovimientos = datosMovimientos + ("\n<b>Fecha:</b> " + fecha + " \n<b>Tipo:</b> " + movimientosCliente[i].tipo + "\n<b>Cuenta:</b> " + movimientosCliente[i].numero + " \n<b>Valor:</b> " + movimientosCliente[i].valor + "\n\n");
                        }
                        Data.Chats.actualizarChat(msg.chat.id, core_1.Contextos.Consultas.Extracto.reporte, "").then(function () {
                            var messageOptions = {
                                parse_mode: 'HTML',
                                message_id: msg.message_id,
                                chat_id: msg.chat.id,
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: Options.Volver, callback_data: core_1.Contextos.Consultas.Extracto.operacionProducto }
                                        ]
                                    ]
                                }
                            };
                            var fechaHoy = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
                            var textoMensaje = "<b>Banco. KodeFest8</b>, " + fechaHoy + "\n\n<b>Extracto Cuenta Nro:</b> " + productoDeCliente.numero + "\n\n<b>" + msg.from.first_name + ":</b>, " + fechaHoy + "\n\n" + datosMovimientos;
                            initBot_1.bot.editMessageText(textoMensaje, messageOptions);
                        });
                    });
                });
            });
        };
        Metodos.onOperacionProducto = function (msg) {
            Metodos.sendMessageSeleccionarProducto(msg.message, true);
        };
        Metodos.onProductoSeleccionado = function (msg, update) {
            Metodos.sendMessageSeleccionarMes(msg.message, update);
        };
        Metodos.onSelectMes = function (msg, mes) {
            Metodos.sendMessageReporteXMes(msg.message, mes);
        };
    })(Metodos = Extracto.Metodos || (Extracto.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('message', function (msg) {
                if (!msg.text) {
                    return;
                }
            });
            initBot_1.bot.on('callback_query', function (msg) {
                if (!msg.data) {
                    return;
                }
                if (msg.data.indexOf(core_1.Contextos.Consultas.Extracto.operacionProducto) === 0) {
                    Metodos.onOperacionProducto(msg);
                }
                Data.Chats.getChat(msg.message).then(function (chat) {
                    if (chat.contexto != core_1.Contextos.Consultas.Extracto.seleccionMes) {
                        return;
                    }
                    if (msg.data.indexOf(core_1.Comandos.Consultas.Extracto.ago) === 0) {
                        Metodos.onSelectMes(msg, core_1.Comandos.Consultas.Extracto.ago);
                    }
                });
            });
            initBot_1.bot.on('inline_query', function (msg) {
                if (!msg.query) {
                    return;
                }
                if (msg.query.indexOf(core_1.Contextos.Consultas.Extracto.operacionProducto) === 0) {
                    Data.Productos.getSaldoDeProductosByCliente(msg.from.id).then(function (productos) {
                        initBot_1.bot.answerInlineQuery(msg.id, productos, {
                            cache_time: '0'
                        });
                    });
                }
            });
            initBot_1.bot.on('chosen_inline_result', function (msg) {
                if (!msg.query) {
                    return;
                }
                if (msg.query.indexOf(core_1.Contextos.Consultas.Extracto.operacionProducto) === 0) {
                    Metodos.onProductoSeleccionado({ message: { chat: { id: msg.from.id } } }, false);
                    Data.Chats.actualizarDatoComando(msg.from.id, msg.result_id.toString());
                }
            });
        };
    })(eventHandlers = Extracto.eventHandlers || (Extracto.eventHandlers = {}));
})(Extracto = exports.Extracto || (exports.Extracto = {}));
Extracto.eventHandlers.listen();
