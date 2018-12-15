"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var Estudiantes;
(function (Estudiantes) {
    Estudiantes.actualizarChat = function (msg, estadoGlobal, estudiante) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/chats/" +
            estadoGlobal.idUsuarioChat)
            .set(estudiante);
    };
    Estudiantes.getEstudianteByChatId = function (msg, estadoGlobal) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/chats/" +
            estadoGlobal.idUsuarioChat)
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Estudiantes/getEstudianteByChatId" + error);
        });
    };
    Estudiantes.getEstudianteByCodigoAsignatura = function (msg, estadoGlobal, codigoEstudiante, codigoAsignatura) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            estadoGlobal.settings.celularDocente +
            "/asignatura_estudiante/" +
            codigoAsignatura + "/" +
            codigoEstudiante)
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Estudiantes/getEstudianteCodigoAsignatura" + error);
        });
    };
    Estudiantes.elminarChat = function (msg, estadoGlobal) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/chats/" +
            msg.chat.id)
            .remove();
    };
})(Estudiantes = exports.Estudiantes || (exports.Estudiantes = {}));
