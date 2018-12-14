"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var CelularesUsuario;
(function (CelularesUsuario) {
    CelularesUsuario.getCelularUsuario = function (msg, estadoGlobal) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/celularesUsuario/" +
            msg.contact.phone_number)
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Estudiantes/getEstudianteByChatId" + error);
        });
    };
    CelularesUsuario.actualizarCelularUsuario = function (msg, estadoGlobal, nroCelular, celularUsuario) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/celularesUsuario/" +
            nroCelular)
            .set(celularUsuario);
    };
})(CelularesUsuario = exports.CelularesUsuario || (exports.CelularesUsuario = {}));
