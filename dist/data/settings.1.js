"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var Settings;
(function (Settings) {
    Settings.getCodigoAccesoEstudiante = function () {
        return initDatabase_1.dataBase.ref('settings/codigoAccesoEstudiante').once('value')
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Settings/codigoAccesoEstudiante" + error);
        });
    };
})(Settings = exports.Settings || (exports.Settings = {}));
