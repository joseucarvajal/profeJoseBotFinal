"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var Asignacion;
(function (Asignacion) {
    Asignacion.getAsignaturasXPeriodoAndDocente = function (msg, estadoGlobal, celularDocente) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            celularDocente +
            "/asignaturas/")
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
        });
    };
    Asignacion.registrarEstudianteAAsignatura = function (msg, estadoGlobal, estudiante, codigoAsignatura) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" + estadoGlobal.settings.periodoActual + "/asignacion/" + estadoGlobal.celularDocente + "/asignaturas/" + codigoAsignatura + "/estudiantes/" + estadoGlobal.idUsuarioChat)
            .set({
            idUsuarioChat: estadoGlobal.idUsuarioChat
        });
    };
    Asignacion.registrarAsignaturaAEstudiante = function (msg, estadoGlobal, estudiante, codigoAsignatura) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" + estadoGlobal.settings.periodoActual + "/estudiantes/" + estadoGlobal.idUsuarioChat + "/asignaturas/" + codigoAsignatura)
            .set({
            codigoAsignatura: codigoAsignatura
        });
    };
})(Asignacion = exports.Asignacion || (exports.Asignacion = {}));
