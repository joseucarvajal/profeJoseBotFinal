"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var validations_1 = require("../../utils/validations");
var PagarServicioSeleccionado;
(function (PagarServicioSeleccionado) {
    var Options;
    (function (Options) {
        Options["Volver"] = "<< Volver";
    })(Options || (Options = {}));
    var _productoCliente = null;
    var _numeroFactura = 0;
    var _valorPagar = 0;
    var Metodos;
    (function (Metodos) {
        Metodos.sendMessage = function (msg, update) {
            Data.Chats.actualizarChat(msg.chat.id, core_1.Contextos.Facturas.PagarServicioSeleccionado.getNumeroFactura, core_1.Comandos.Facturas.PagarServicioSeleccionado.getNumeroFactura).then(function () {
                var messageOptions = {
                    parse_mode: 'HTML'
                };
                initBot_1.bot.sendMessage(msg.chat.id, "Ingresa el n\u00FAmero de la factura", messageOptions);
            });
        };
        Metodos.onPagarServicioSeleccionado = function (msg, productoCliente, update) {
            Metodos.sendMessage(msg, update);
            _productoCliente = productoCliente;
        };
        Metodos.solicitarValorAPagar = function (msg) {
            Data.Chats.actualizarChat(msg.chat.id, core_1.Contextos.Facturas.PagarServicioSeleccionado.getValorPagar, core_1.Comandos.Facturas.PagarServicioSeleccionado.getValorPagar).then(function () {
                var messageOptions = {
                    parse_mode: 'HTML'
                };
                initBot_1.bot.sendMessage(msg.chat.id, "Ingresa el valor a pagar.", messageOptions);
            });
        };
        Metodos.enviarMensajeNumeroFacturaInvalido = function (msg) {
            initBot_1.bot.sendMessage(msg.chat.id, "\u274C El n\u00FAmero de la factura no es v\u00E1lida, esta debe tener s\u00F3lo n\u00FAmeros.");
        };
        Metodos.enviarMensajeValorAPagarInvalido = function (msg) {
            initBot_1.bot.sendMessage(msg.chat.id, "\u274C El n\u00FAmero de la factura no es v\u00E1lida, esta debe tener s\u00F3lo n\u00FAmeros.");
        };
        Metodos.enviarMensajeServicioPagado = function (msg) {
            initBot_1.bot.sendMessage(msg.chat.id, "\u2705 Pago exitoso, est\u00E1s al d\u00EDa con tu factura.");
        };
    })(Metodos = PagarServicioSeleccionado.Metodos || (PagarServicioSeleccionado.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('message', function (msg) {
                if (!msg.text) {
                    return;
                }
                Data.Chats.getChat(msg).then(function (chat) {
                    if (chat.contexto == core_1.Contextos.Facturas.PagarServicioSeleccionado.getNumeroFactura
                        && chat.comando == core_1.Comandos.Facturas.PagarServicioSeleccionado.getNumeroFactura) {
                        if (validations_1.Validaciones.esNumeroRequeridoValido(msg.text)) {
                            Metodos.solicitarValorAPagar(msg);
                        }
                        else {
                            Metodos.enviarMensajeNumeroFacturaInvalido(msg);
                        }
                    }
                    else if (chat.contexto == core_1.Contextos.Facturas.PagarServicioSeleccionado.getValorPagar
                        && chat.comando == core_1.Comandos.Facturas.PagarServicioSeleccionado.getValorPagar) {
                        if (validations_1.Validaciones.esNumeroRequeridoValido(msg.text)) {
                            Data.Movimientos.setMovimiento(msg.from.id, {
                                fechaHora: msg.date,
                                numero: validations_1.Validaciones.generarGUID(),
                                valor: parseInt(msg.text),
                                tipo: core_1.Constants.TipoMovimientoEnum.PagoServicios
                            }).then(function () {
                                Metodos.enviarMensajeServicioPagado(msg);
                            });
                        }
                        else {
                            Metodos.enviarMensajeValorAPagarInvalido(msg);
                        }
                    }
                });
            });
        };
    })(eventHandlers = PagarServicioSeleccionado.eventHandlers || (PagarServicioSeleccionado.eventHandlers = {}));
})(PagarServicioSeleccionado = exports.PagarServicioSeleccionado || (exports.PagarServicioSeleccionado = {}));
PagarServicioSeleccionado.eventHandlers.listen();
