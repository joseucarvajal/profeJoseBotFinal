"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var pagar_servicio_seleccionar_producto_1 = require("./pagar-servicio-seleccionar-producto");
var PagarServicios;
(function (PagarServicios) {
    var Metodos;
    (function (Metodos) {
        Metodos.onValidacionServiciosInscritosByCliente = function (msg) {
            initBot_1.bot.sendMessage(msg.chat.id, "No tienes servicios para pagar.");
        };
    })(Metodos = PagarServicios.Metodos || (PagarServicios.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('inline_query', function (msg) {
                if (!msg) {
                    return;
                }
                if (msg.query.indexOf(core_1.Contextos.Facturas.PagarServicio.pagarServicio) === 0) {
                    Data.Clientes.getEmpresasInscritasFromCliente({ chat: { id: msg.from.id } }).then(function (empresasInscritasByCliente) {
                        if (empresasInscritasByCliente.length == 0) {
                            Metodos.onValidacionServiciosInscritosByCliente({ chat: { id: msg.from.id } });
                            return;
                        }
                        var serviciosInscritosList = [];
                        for (var i = 0; i < empresasInscritasByCliente.length; i++) {
                            serviciosInscritosList.push({
                                id: !empresasInscritasByCliente[i].id ? '' : empresasInscritasByCliente[i].id,
                                type: 'article',
                                title: !empresasInscritasByCliente[i].nombre ? '' : empresasInscritasByCliente[i].nombre,
                                description: !empresasInscritasByCliente[i].descripcion ? '' : empresasInscritasByCliente[i].descripcion,
                                input_message_content: {
                                    message_text: "\u2705 " + (!empresasInscritasByCliente[i].nombre ? '' : empresasInscritasByCliente[i].nombre) + " seleccionada"
                                },
                                thumb_url: !empresasInscritasByCliente[i].icono ? '' : empresasInscritasByCliente[i].icono
                            });
                        }
                        initBot_1.bot.answerInlineQuery(msg.id, serviciosInscritosList, {
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
                if (msg.query.indexOf(core_1.Contextos.Facturas.PagarServicio.pagarServicio) === 0) {
                    Data.Chats.actualizarDatoComando(msg.from.id, msg.result_id.toString()).then(function () {
                        pagar_servicio_seleccionar_producto_1.PagarServiciosSeleccionarProducto.Metodos.onPagarServiciosSeleccionarProducto({
                            chat: {
                                id: msg.from.id
                            },
                            message_id: msg.id
                        });
                    });
                }
            });
        };
    })(eventHandlers = PagarServicios.eventHandlers || (PagarServicios.eventHandlers = {}));
})(PagarServicios = exports.PagarServicios || (exports.PagarServicios = {}));
PagarServicios.eventHandlers.listen();
