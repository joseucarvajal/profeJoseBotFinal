"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var common_1 = require("./common");
var EmpresaServicio;
(function (EmpresaServicio) {
    EmpresaServicio.getEmpresaServicios = function (chatId) {
        return initDatabase_1.dataBase.ref('empresaServicio').once('value')
            .then(function (snapshot) {
            return common_1.getListFromFirebaseObject(snapshot.val());
        })
            .catch(function (error) {
            console.log("EmpresaServicio/getEmpresaServicios" + error);
        });
    };
    EmpresaServicio.getEmpresaServiciosById = function (chatId, empresaServicioId) {
        return initDatabase_1.dataBase.ref('empresaServicio/' + empresaServicioId).once('value');
    };
})(EmpresaServicio = exports.EmpresaServicio || (exports.EmpresaServicio = {}));
