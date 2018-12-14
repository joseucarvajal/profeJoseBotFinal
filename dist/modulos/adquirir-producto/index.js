"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var constants_1 = require("../../core/constants");
var index_1 = require("../../core/index");
var utils_1 = require("../../utils");
var AdquirirProducto;
(function (AdquirirProducto) {
    var Options;
    (function (Options) {
        Options["verProductosDisponibles"] = "Ver productos disponibles";
    })(Options = AdquirirProducto.Options || (AdquirirProducto.Options = {}));
    var Metodos;
    (function (Metodos) {
        Metodos.sendMessage = function (chatId) {
            Data.Chats.actualizarChat(chatId, index_1.Contextos.AdquirirProducto.Index.index, constants_1.Comandos.AdquirirProducto.Index.verProductosDisponibles).then(function () {
                var messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: Options.verProductosDisponibles,
                                    switch_inline_query_current_chat: constants_1.Comandos.AdquirirProducto.Index.verProductosDisponibles
                                }
                            ]
                        ],
                    }
                };
                initBot_1.bot.sendMessage(chatId, "Selecciona uno de los productos disponibles", messageOptions);
            });
        };
        Metodos.sendSuccessMessage = function (msg, sucessMessage) {
            Data.Chats.actualizarChat(msg.chat.id, index_1.Contextos.PaginaInicial.menuPrincipal, '').then(initBot_1.bot.sendMessage(msg.chat.id, "\u2705 " + sucessMessage));
        };
        Metodos.sendErrorMessage = function (msg, errorMessage) {
            initBot_1.bot.sendMessage(msg.chat.id, "\u274C " + errorMessage);
        };
        Metodos.onAdquirirProducto = function (msg) {
            Metodos.sendMessage(msg.chat.id);
        };
    })(Metodos = AdquirirProducto.Metodos || (AdquirirProducto.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('message', function (msg) {
                if (!msg.text) {
                    return;
                }
                if (msg.text.indexOf(constants_1.Comandos.PaginaInicial.MenuPrincipal.adquirirProducto) === 0) {
                    console.log("debug 1");
                    Metodos.onAdquirirProducto(msg);
                }
                else {
                    Data.Chats.getChatByUserId(msg.from.id).then(function (chat) {
                        if (chat.contexto.indexOf(index_1.Contextos.AdquirirProducto.Index.index) === 0 &&
                            chat.comando.indexOf(constants_1.Comandos.AdquirirProducto.Index.setSaldoInicial) === 0) {
                            if (!chat.datosComando) {
                                return;
                            }
                            if (utils_1.Validaciones.esNumeroRequeridoValido(msg.text)) {
                                var saldo = parseFloat(msg.text);
                                if (saldo >= 0) {
                                    Data.Productos.updateSaldoProducto(msg.from.id, chat.datosComando, saldo);
                                    Metodos.sendSuccessMessage(msg, "Tu producto se ha configurado satisfactoriamente");
                                }
                                else {
                                    Metodos.sendErrorMessage(msg, "El saldo inicial no puede ser negativo, por favor ingresa nuevamente el valor");
                                }
                            }
                            else {
                                Metodos.sendErrorMessage(msg, "El valor que ingresaste no es valido, por favor ingresa nuevamente el valor");
                            }
                            ;
                        }
                    });
                }
            });
            initBot_1.bot.on('inline_query', function (msg) {
                if (!msg.query) {
                    return;
                }
                Data.Chats.getChatByUserId(msg.from.id).then(function (chat) {
                    if (chat.contexto.indexOf(index_1.Contextos.AdquirirProducto.Index.index) === 0 &&
                        chat.comando.indexOf(constants_1.Comandos.AdquirirProducto.Index.verProductosDisponibles) === 0) {
                        Data.Productos.getProductosPorAdquirirByClienteArticles(msg.from.id).then(function (productos) {
                            var productosPorAdquirir = productos;
                            if (!productosPorAdquirir || productosPorAdquirir.length === 0) {
                                productosPorAdquirir.push({
                                    id: '-1',
                                    type: 'article',
                                    title: 'Al parecer ya has adquirido todos nuestros productos',
                                    input_message_content: {
                                        message_text: "Gracias por confiar en nosotros",
                                    },
                                    description: 'Gracias por confiar en nosotros',
                                    thumb_url: 'http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-8/48/Thumb-up-icon.png'
                                });
                            }
                            initBot_1.bot.answerInlineQuery(msg.id, productosPorAdquirir, {
                                cache_time: '0'
                            });
                        });
                    }
                });
            });
            initBot_1.bot.on('chosen_inline_result', function (msg) {
                Data.Chats.getChatByUserId(msg.from.id).then(function (chat) {
                    if (chat.contexto.indexOf(index_1.Contextos.AdquirirProducto.Index.index) === 0 &&
                        chat.comando.indexOf(constants_1.Comandos.AdquirirProducto.Index.verProductosDisponibles) === 0) {
                        if (msg.result_id == -1) {
                            return;
                        }
                        Data.Chats.guardarComandoByChatId(msg.from.id, constants_1.Comandos.AdquirirProducto.Index.setSaldoInicial);
                        Data.Productos.saveProductosCliente(msg.from.id, {
                            idProducto: msg.result_id,
                            numero: utils_1.Validaciones.generarGUID(),
                            saldo: 0
                        });
                        Data.Productos.getProductoClienteByProductoBancoId(msg.from.id, msg.result_id).then(function (productoCliente) {
                            Data.Chats.actualizarDatoComando(msg.from.id, productoCliente.id.toString());
                        });
                    }
                });
            });
        };
    })(eventHandlers = AdquirirProducto.eventHandlers || (AdquirirProducto.eventHandlers = {}));
})(AdquirirProducto = exports.AdquirirProducto || (exports.AdquirirProducto = {}));
//AdquirirProducto.eventHandlers.listen();
