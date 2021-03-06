"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var core_1 = require("../core");
var Utils_1 = require("../utils/Utils");
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
    Asignacion.getAsignaturasXPeriodoAndDocenteAsArray = function (estadoGlobal) {
        return new Promise(function (resolve, reject) {
            Asignacion.getAsignaturasXPeriodoAndDocente(estadoGlobal).then(function (listadoAsignaturas) {
                var listadoAsignaturasArray = new Array();
                for (var codigoAsignatura in listadoAsignaturas) {
                    listadoAsignaturasArray.push(listadoAsignaturas[codigoAsignatura]);
                }
                resolve(listadoAsignaturasArray);
            });
        });
    };
    Asignacion.getTodosHorariosYAsignaturasDocente = function (estadoGlobal) {
        return new Promise(function (resolve, reject) {
            Asignacion.getAsignaturasXPeriodoAndDocente(estadoGlobal).then(function (listadoAsignaturas) {
                var listaHorarioAsignatura = new Array();
                var asignatura;
                for (var codigoAsignatura in listadoAsignaturas) {
                    asignatura = listadoAsignaturas[codigoAsignatura];
                    for (var codigoHorario in asignatura.horarios) {
                        asignatura.horarios[codigoHorario].id = codigoAsignatura + '#|@' + codigoHorario;
                        listaHorarioAsignatura.push({
                            asignatura: asignatura,
                            horario: asignatura.horarios[codigoHorario]
                        });
                    }
                }
                resolve(listaHorarioAsignatura);
            });
        });
    };
    Asignacion.asociarEstudianteAAsignatura = function (estadoGlobal, estudiante, codigoAsignatura) {
        return new Promise(function (resolve, reject) {
            Asignacion.registrarAsignaturaEstudiante(estadoGlobal, estudiante, codigoAsignatura).then(function () {
                Asignacion.registrarEstudianteAsignatura(estadoGlobal, estudiante, codigoAsignatura).then(function () {
                    resolve();
                });
            });
        });
    };
    Asignacion.registrarAsignaturaEstudiante = function (estadoGlobal, estudiante, codigoAsignatura) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" + estadoGlobal.settings.periodoActual + "/asignacion/" + estadoGlobal.settings.celularDocente + "/asignatura_estudiante/" + codigoAsignatura + "/" + estudiante.codigo)
            .set({
            codigo: estudiante.codigo,
            nombre: estudiante.nombre,
            email: estudiante.email
        });
    };
    Asignacion.registrarEstudianteAsignatura = function (estadoGlobal, estudiante, codigoAsignatura) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" + estadoGlobal.settings.periodoActual + "/asignacion/" + estadoGlobal.settings.celularDocente + "/estudiante_asignatura/" + estudiante.codigo + "/" + codigoAsignatura)
            .set({
            codigo: codigoAsignatura,
            estado: core_1.Constants.EstadoEstudianteAsignatura.Activa
        });
    };
    Asignacion.registrarAsignaturasAEstudiante = function (msg, estadoGlobal, listaAsignaturas) {
        var asignaturasEstudiante = {};
        asignaturasEstudiante.asignaturas = {};
        var estudianteAsignaturas = (_a = {},
            _a[estadoGlobal.infoUsuarioMensaje.estudiante.codigo] = asignaturasEstudiante.asignaturas,
            _a);
        for (var i = 0; i < listaAsignaturas.length; i++) {
            asignaturasEstudiante.asignaturas[listaAsignaturas[i].codigo] = {
                codigo: listaAsignaturas[i].codigo,
                estado: core_1.Constants.EstadoEstudianteAsignatura.Activa
            };
        }
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" + estadoGlobal.settings.periodoActual + "/asignacion/" + estadoGlobal.settings.celularDocente + "/estudiante_asignatura/")
            .update(estudianteAsignaturas);
        var _a;
    };
    Asignacion.getTodasAsignaturasYSusEstudiantes = function (estadoGlobal) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            estadoGlobal.settings.celularDocente +
            "/asignatura_estudiante/")
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
        });
    };
    Asignacion.getEstudiantesInscritosEnAsignatura = function (estadoGlobal, codigoAsignatura) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            estadoGlobal.settings.celularDocente +
            "/asignatura_estudiante/" +
            codigoAsignatura)
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
        });
    };
    Asignacion.getAsignaturasByEstudianteCodigo = function (estadoGlobal, codigoEstudiante) {
        return new Promise(function (resolve, reject) {
            Asignacion.getAsignaturasXPeriodoAndDocente(estadoGlobal).then(function (listadoAsignaturas) {
                Asignacion.getTodasAsignaturasYSusEstudiantes(estadoGlobal).then(function (listadoAsignaturaEstudiantes) {
                    var estudianteAsignaturas = {
                        listaAsignaturas: new Array(),
                        estudiante: {}
                    };
                    var estudiante;
                    for (var codigoAsignatura in listadoAsignaturaEstudiantes) {
                        if (!listadoAsignaturas[codigoAsignatura]) {
                            estudianteAsignaturas.result = false; //error
                            estudianteAsignaturas.message = "La asignatura " + codigoAsignatura + " no se encuentra en el nodo <b>asignaturas</b> del docente";
                            resolve(estudianteAsignaturas);
                            return;
                        }
                        for (var codigoEstudianteFor in listadoAsignaturaEstudiantes[codigoAsignatura]) {
                            estudiante =
                                listadoAsignaturaEstudiantes[codigoAsignatura][codigoEstudianteFor];
                            if (estudiante.codigo == codigoEstudiante) {
                                estudianteAsignaturas.listaAsignaturas.push(listadoAsignaturas[codigoAsignatura]);
                                estudianteAsignaturas.estudiante = estudiante;
                            }
                        }
                    }
                    estudianteAsignaturas.result = true;
                    resolve(estudianteAsignaturas);
                });
            });
        });
    };
    var getAsignaturasInscritasPorEstudiante = function (estadoGlobal) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            estadoGlobal.settings.celularDocente +
            "/estudiante_asignatura/" +
            estadoGlobal.infoUsuarioMensaje.estudiante.codigo)
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
        });
    };
    Asignacion.getAsignaturasInscritasPorEstudianteCachedInfoCompleta = function (estadoGlobal, codigoEstudiante) {
        return new Promise(function (resolve, reject) {
            Asignacion.getAsignaturasXPeriodoAndDocente(estadoGlobal).then(function (listadoTodasAsignaturas) {
                getAsignaturasInscritasPorEstudiante(estadoGlobal).then(function (listadoEstudianteAsignatura) {
                    var listaAsignaturasDeEstudiante = new Array();
                    var asignatura;
                    for (var codigoAsignatura in listadoEstudianteAsignatura) {
                        asignatura = listadoTodasAsignaturas[codigoAsignatura];
                        asignatura.estado =
                            listadoEstudianteAsignatura[codigoAsignatura].estado;
                        listaAsignaturasDeEstudiante.push(asignatura);
                    }
                    resolve(listaAsignaturasDeEstudiante);
                });
            });
        });
    };
    Asignacion.getAsignaturasQueNoTieneEstudiante = function (estadoGlobal, codigoEstudiante) {
        return new Promise(function (resolve, reject) {
            getAsignaturasInscritasPorEstudiante(estadoGlobal).then(function (listadoAsignaturasEstudiante) {
                Asignacion.getAsignaturasXPeriodoAndDocente(estadoGlobal).then(function (listadoAsignaturas) {
                    var asignaturasQueNoTieneEstudiante = new Array();
                    for (var codigoAsignatura in listadoAsignaturas) {
                        if (!listadoAsignaturasEstudiante ||
                            !listadoAsignaturasEstudiante[codigoAsignatura]) {
                            asignaturasQueNoTieneEstudiante.push(listadoAsignaturas[codigoAsignatura]);
                        }
                    }
                    resolve(asignaturasQueNoTieneEstudiante);
                });
            });
        });
    };
    Asignacion.registrarAsistencia = function (msg, estadoGlobal, codigoAsignatura) {
        var registroAsistencia = {
            latitud: msg.location.latitude,
            longitud: msg.location.longitude,
            fechaHora: msg.date
        };
        var fechaAsistencia = new Date(Utils_1.Utils.getRealDate(msg.date));
        fechaAsistencia.setHours(0, 0, 0, 0);
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" + estadoGlobal.settings.periodoActual + "/asignacion/" + estadoGlobal.settings.celularDocente + "/asistencias_asignatura/" + codigoAsignatura + "/" + fechaAsistencia.getTime() + "/" + estadoGlobal.infoUsuarioMensaje.estudiante.codigo + "/")
            .set(registroAsistencia);
    };
    Asignacion.getAsignaturaByCodigo = function (estadoGlobal, codigoAsignatura) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            estadoGlobal.settings.celularDocente +
            "/asignaturas/" +
            codigoAsignatura)
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
        });
    };
    Asignacion.getListadoAsistenciaByAsignatura = function (estadoGlobal, asignatura) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            estadoGlobal.settings.celularDocente +
            "/asistencias_asignatura/" +
            asignatura.codigo)
            .once("value")
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("asignacion/getListadoAsistenciaByAsignatura" + error);
        });
    };
    Asignacion.actualizarGeoreferenciaAsignatura = function (msg, estadoGlobal, codigoAsignatura, codigoHorario) {
        return initDatabase_1.dataBase
            .ref("periodosAcademicos/" +
            estadoGlobal.settings.periodoActual +
            "/asignacion/" +
            estadoGlobal.settings.celularDocente +
            "/asignaturas/" +
            codigoAsignatura +
            "/horarios/")
            .child(codigoHorario)
            .update({
            coordenadasAula: msg.location.latitude + "," + msg.location.longitude
        });
    };
})(Asignacion = exports.Asignacion || (exports.Asignacion = {}));
