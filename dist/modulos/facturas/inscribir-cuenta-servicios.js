"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data = require("../../data");
var InscribirCuentaServicios;
(function (InscribirCuentaServicios) {
    InscribirCuentaServicios.getEmpresaServiciosByCliente = function (chatId) {
        return Data.EmpresaServicio.getEmpresaServicios(chatId).then(function (ListaEmpresaDeServicios) {
            return Data.Clientes.getEmpresasInscritasFromCliente({
                chat: {
                    id: chatId
                }
            }).then(function (listaEmpresasDeServiciosAsociadosACliente) {
                var empresasInscritasByClienteList = new Array();
                if (!listaEmpresasDeServiciosAsociadosACliente) {
                    empresasInscritasByClienteList = ListaEmpresaDeServicios;
                    return empresasInscritasByClienteList;
                }
                var _loop_1 = function (i) {
                    var empresaAsociadaResultado = listaEmpresasDeServiciosAsociadosACliente.find(function (empresa) { return empresa.id == ListaEmpresaDeServicios[i].id; });
                    if (empresaAsociadaResultado) {
                        return "continue";
                    }
                    empresasInscritasByClienteList.push(ListaEmpresaDeServicios[i]);
                };
                for (var i = 0; i < ListaEmpresaDeServicios.length; i++) {
                    _loop_1(i);
                }
                return empresasInscritasByClienteList;
            });
        });
    };
})(InscribirCuentaServicios = exports.InscribirCuentaServicios || (exports.InscribirCuentaServicios = {}));
