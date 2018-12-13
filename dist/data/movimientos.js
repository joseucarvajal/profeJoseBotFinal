"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var common_1 = require("./common");
var Movimientos;
(function (Movimientos) {
    Movimientos.setMovimiento = function (chatId, movimientoModel) {
        return initDatabase_1.dataBase.ref('clientes/' + chatId + '/movimientos').push(movimientoModel);
    };
    Movimientos.getMovimientosDeCliente = function (chatId) {
        return initDatabase_1.dataBase.ref('clientes/' + chatId + '/movimientos').once('value')
            .then(function (snapshot) {
            return common_1.getListFromFirebaseObject(snapshot.val());
        })
            .catch(function (error) {
            console.log("Movimientos/getMovimientosDeCliente" + error);
        });
    };
})(Movimientos = exports.Movimientos || (exports.Movimientos = {}));
