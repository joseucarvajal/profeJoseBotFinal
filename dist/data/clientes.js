"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var common_1 = require("./common");
var Clientes;
(function (Clientes) {
    Clientes.actualizarNombre = function (msg) {
        return initDatabase_1.dataBase.ref('clientes/' + msg.chat.id + '/nombre').set(msg.from.first_name ? msg.from.first_name : '' + msg.from.last_name ? msg.from.last_name : '');
    };
    Clientes.actualizarDocumento = function (msg, documento) {
        return initDatabase_1.dataBase.ref('clientes/' + msg.chat.id + '/documento').set(documento);
    };
    Clientes.actualizarDatosBasicos = function (msg, documento) {
        Clientes.actualizarNombre(msg);
        return Clientes.actualizarDocumento(msg, documento);
    };
    Clientes.getEmpresasInscritasFromCliente = function (msg) {
        return initDatabase_1.dataBase.ref('clientes/' + msg.chat.id + '/empresasInscritas').once("value")
            .then(function (snapshot) {
            return common_1.getListFromFirebaseObject(snapshot.val());
        })
            .catch(function (error) {
            console.log("EmpresaServicio/getEmpresaServicios" + error);
        });
    };
    Clientes.getServicioInscritoByCliente = function (chatId, idServicio) {
        return initDatabase_1.dataBase.ref('clientes/' + chatId + '/empresasInscritas/' + idServicio).once('value')
            .then(function (snapshot) {
            if (!snapshot.val()) {
                return null;
            }
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Productos/getProductoBancoById" + error);
        });
    };
    Clientes.setEmpresasInscritasToCliente = function (msg, empresaInscritaId, empresaInscrita) {
        return initDatabase_1.dataBase.ref('clientes/' + msg.chat.id + '/empresasInscritas/' + empresaInscritaId).set(empresaInscrita);
    };
})(Clientes = exports.Clientes || (exports.Clientes = {}));
