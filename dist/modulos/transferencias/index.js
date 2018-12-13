"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var index;
(function (index) {
    var Metodos;
    (function (Metodos) {
        var Options;
        (function (Options) {
            Options["TransferirAUnAmigo"] = "\uD83D\uDCB2 Transferir a un amigo, Cta. Ahorros";
            Options["Volver"] = "<< Volver";
        })(Options || (Options = {}));
        Metodos.enviarMensajeError = function (msg, error) {
            initBot_1.bot.sendMessage(msg.chat.id, "\u274C " + error);
        };
        Metodos.enviarMensajeExito = function (msg, exito) {
            initBot_1.bot.sendMessage(msg.chat.id, "\u2705 " + exito);
        };
        Metodos.enviarMensajeTransferirAmigo = function (msg, update) {
            Data.Chats.actualizarChat(msg.chat.id, core_1.Contextos.Transferencias.Index.index, "").then(function () {
                var messageOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: Options.TransferirAUnAmigo,
                                    switch_inline_query: core_1.Comandos.Transferencias.Index.TransferirAUnAmigo,
                                },
                            ],
                        ]
                    }
                };
                if (!update) {
                    initBot_1.bot.sendMessage(msg.chat.id, "Elige una operaci\u00F3n", messageOptions);
                    return;
                }
            });
        };
        Metodos.enviarMensajeOpcionesDeTransferencia = function (msg) {
            Data.Chats.actualizarChat(msg.from.id, core_1.Contextos.Transferencias.Index.index, "").then(function () {
                var opcionesTransferencia = [
                    {
                        id: '$10.000',
                        type: 'article',
                        title: '$10.000',
                        input_message_content: {
                            message_text: "\u2714\uFE0F <i>" + msg.from.first_name + "</i> acaba de transferir <b>$10.000</b> a tu cuenta",
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    },
                    {
                        id: '$20.000',
                        type: 'article',
                        title: '$20.000',
                        input_message_content: {
                            message_text: "\u2714\uFE0F <i>" + msg.from.first_name + "</i> acaba de transferir <b>$20.000</b> a tu cuenta",
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    },
                    {
                        id: '$50.000',
                        type: 'article',
                        title: '$50.000',
                        input_message_content: {
                            message_text: "\u2714\uFE0F <i>" + msg.from.first_name + "</i> acaba de transferir <b>$50.000</b> a tu cuenta",
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    },
                    {
                        id: '$100.000',
                        type: 'article',
                        title: '$100.000',
                        input_message_content: {
                            message_text: "\u2714\uFE0F <i>" + msg.from.first_name + "</i> acaba de transferir <b>$100.000</b> a tu cuenta",
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    },
                    {
                        id: '$1.000.000',
                        type: 'article',
                        title: '$1.000.000',
                        input_message_content: {
                            message_text: "\u2714\uFE0F <i>" + msg.from.first_name + "</i> acaba de transferir <b>$1.000.000</b> a tu cuenta",
                            parse_mode: 'HTML'
                        },
                        description: 'Clic aquí para transferir a tu amigo',
                        thumb_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/974869/219513169/stock-vector-hand-with-money-icon-franc-baht-yuan-rupee-symbols-219513169.jpg'
                    }
                ];
                initBot_1.bot.answerInlineQuery(msg.id, opcionesTransferencia, {
                    cache_time: '0'
                });
            });
        };
    })(Metodos = index.Metodos || (index.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('message', function (msg) {
                if (!msg.text) {
                    return;
                }
                if (msg.text == core_1.Comandos.PaginaInicial.MenuPrincipal.transferencias) {
                    Metodos.enviarMensajeTransferirAmigo(msg, false);
                }
            });
            initBot_1.bot.on('inline_query', function (msg) {
                if (!msg.query) {
                    return;
                }
                if (msg.query.indexOf(core_1.Comandos.Transferencias.Index.TransferirAUnAmigo) === 0) {
                    Data.Chats.getChatByUserId(msg.from.id).then(function (chat) {
                        if (chat.contexto != core_1.Contextos.Transferencias.Index.index) {
                            return;
                        }
                        Metodos.enviarMensajeOpcionesDeTransferencia(msg);
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
                if (msg.query != core_1.Comandos.Transferencias.Index.TransferirAUnAmigo) {
                    return;
                }
                /*
                                console.log('choosen');
                                console.log(msg);
                */
            });
        };
    })(eventHandlers = index.eventHandlers || (index.eventHandlers = {}));
})(index = exports.index || (exports.index = {}));
index.eventHandlers.listen();
