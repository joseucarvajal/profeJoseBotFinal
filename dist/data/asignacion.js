"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var Asignacion;
(function (Asignacion) {
    Asignacion.getAsignaturasXPeriodoAndDocente = function (estadoGlobal) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            estadoGlobal.settings.celularDocente +
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
            .ref("periodosAcademicos/" + estadoGlobal.settings.periodoActual + "/asignacion/" + estadoGlobal.settings.celularDocente + "/asignaturas/" + codigoAsignatura + "/estudiantes/" + estadoGlobal.idUsuarioChat)
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
    Asignacion.getAsignaturasByEstudianteCodigo = function (estadoGlobal, codigoEstudiante) {
        return new Promise(function (resolve, reject) {
            Asignacion.getAsignaturasXPeriodoAndDocente(estadoGlobal).then(function (listadoAsignaturasXDocente) {
                var asignatura;
                var listaAsignaturas = Array();
                for (var codigoAsignatura in listadoAsignaturasXDocente) {
                    asignatura = listadoAsignaturasXDocente[codigoAsignatura];
                    if (asignatura.estudiantesMatriculados &&
                        asignatura.estudiantesMatriculados.indexOf(codigoEstudiante) != -1) {
                        listaAsignaturas.push(listadoAsignaturasXDocente[codigoAsignatura]);
                    }
                }
                resolve(listaAsignaturas);
            });
        });
    };
})(Asignacion = exports.Asignacion || (exports.Asignacion = {}));
