"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var Saldo;
(function (Saldo) {
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('inline_query', function (msg) {
                if (!msg.query) {
                    return;
                }
                if (msg.query.indexOf(core_1.Contextos.Consultas.Saldos.saldos) === 0) {
                    Data.Productos.getSaldoDeProductosByCliente(msg.from.id).then(function (productos) {
                        var productosAdquiridos = productos;
                        if (!productosAdquiridos || productosAdquiridos.length === 0) {
                            productosAdquiridos.push({
                                id: '-1',
                                type: 'article',
                                title: 'Aun no has adquirido ninguno de nuestros productos',
                                input_message_content: {
                                    message_text: core_1.Comandos.PaginaInicial.MenuPrincipal.adquirirProducto,
                                },
                                description: 'Gracias por confiar en nosotros',
                                thumb_url: 'http://icons.iconarchive.com/icons/designcontest/ecommerce-business/48/wallet-icon.png'
                            });
                        }
                        initBot_1.bot.answerInlineQuery(msg.id, productosAdquiridos, {
                            cache_time: '0'
                        });
                    });
                }
            });
        };
    })(eventHandlers = Saldo.eventHandlers || (Saldo.eventHandlers = {}));
})(Saldo = exports.Saldo || (exports.Saldo = {}));
Saldo.eventHandlers.listen();
