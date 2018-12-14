"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var Estudiantes;
(function (Estudiantes) {
    Estudiantes.actualizarChat = function (msg, estadoGlobal, estudiante) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/estudiantes/" +
            msg.chat.id)
            .set(estudiante);
    };
    Estudiantes.getEstudianteByChatId = function (msg, estadoGlobal) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/estudiantes/" +
            msg.chat.id)
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Estudiantes/getEstudianteByChatId" + error);
        });
    };
})(Estudiantes = exports.Estudiantes || (exports.Estudiantes = {}));
