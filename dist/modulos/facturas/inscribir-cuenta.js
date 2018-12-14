"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var Data = require("../../data");
var core_1 = require("../../core");
var inscribir_cuenta_servicios_1 = require("./inscribir-cuenta-servicios");
var InscribirCuentaServicio;
(function (InscribirCuentaServicio) {
    var Options;
    (function (Options) {
        Options["Volver"] = "<< Volver";
    })(Options || (Options = {}));
    var Metodos;
    (function (Metodos) {
        Metodos.onValidacionServiciosInscritosByCliente = function (msg) {
            initBot_1.bot.sendMessage(msg.chat.id, "No tienes servicios para inscribir.");
        };
    })(Metodos = InscribirCuentaServicio.Metodos || (InscribirCuentaServicio.Metodos = {}));
    var eventHandlers;
    (function (eventHandlers) {
        eventHandlers.listen = function () {
            initBot_1.bot.on('inline_query', function (msg) {
                if (!msg) {
                    return;
                }
                if (msg.query.indexOf(core_1.Contextos.Facturas.InscribirCuentaServicios.seleccionServicio) === 0) {
                    inscribir_cuenta_servicios_1.InscribirCuentaServicios.getEmpresaServiciosByCliente(msg.from.id).then(function (serviciosResponseList) {
                        var serviciosInscritosList = [];
                        if (serviciosResponseList.length == 0) {
                            Metodos.onValidacionServiciosInscritosByCliente({ chat: { id: msg.from.id } });
                            return;
                        }
                        for (var i = 0; i < serviciosResponseList.length; i++) {
                            serviciosInscritosList.push({
                                id: serviciosResponseList[i].id,
                                type: 'article',
                                title: serviciosResponseList[i].nombre,
                                description: serviciosResponseList[i].descripcion,
                                input_message_content: {
                                    message_text: "\u2705 " + serviciosResponseList[i].nombre + " inscrito con \u00E9xito!"
                                },
                                thumb_url: serviciosResponseList[i].icono
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
                if (msg.query.indexOf(core_1.Contextos.Facturas.InscribirCuentaServicios.seleccionServicio) === 0) {
                    Data.EmpresaServicio.getEmpresaServiciosById(msg.from.id, msg.result_id).then(function (snapshot) {
                        if (!snapshot.val()) {
                            return;
                        }
                        Data.Clientes.setEmpresasInscritasToCliente({
                            chat: {
                                id: msg.from.id
                            }
                        }, msg.result_id, snapshot.val());
                    });
                }
            });
        };
    })(eventHandlers = InscribirCuentaServicio.eventHandlers || (InscribirCuentaServicio.eventHandlers = {}));
})(InscribirCuentaServicio = exports.InscribirCuentaServicio || (exports.InscribirCuentaServicio = {}));
//InscribirCuentaServicio.eventHandlers.listen();
