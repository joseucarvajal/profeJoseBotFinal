"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data = require("../../data");
/*
Calcula todo el reporte así:
Asignatura: XXXXXXX
------------------------------------------------------------------------
estudiante codigo | estudiante nombre | Nro. Asistencias | Nro. Fallas |

*/
var CalculoReporteAsistenciaAsignaturas = (function () {
    function CalculoReporteAsistenciaAsignaturas(estadoGlobal) {
        this.estadoGlobal = estadoGlobal;
        this.msg = {};
        this.asignatura = {};
        this.listadoEstudiantes = {};
        this.listadoAsistenciaFecha = {};
        this.listaResultadoAsistenciasIndxByEstCodigo = {};
        this.resultadoReporteAsistencia = {};
    }
    CalculoReporteAsistenciaAsignaturas.prototype.calcularReporteAsistenciaAsignaturas = function (msg, codigoAsignatura) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.msg = msg;
            Data.Asignacion.getAsignaturaByCodigo(_this.estadoGlobal, codigoAsignatura).then(function (asignatura) {
                _this.asignatura = asignatura;
                _this.resultadoReporteAsistencia.asignatura = _this.asignatura;
                Data.Asignacion.getEstudiantesInscritosEnAsignatura(_this.estadoGlobal, _this.asignatura.codigo).then(function (listadoEstudiantes) {
                    _this.listadoEstudiantes = listadoEstudiantes;
                    for (var codigoEstudiante in _this.listadoEstudiantes) {
                        _this.listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante] = {
                            estudiante: _this.listadoEstudiantes[codigoEstudiante],
                            countAsistencias: 0,
                            countFallas: 0
                        };
                    }
                    Data.Asignacion.getListadoAsistenciaByAsignatura(_this.estadoGlobal, _this.asignatura).then(function (listadoAsistenciaAsignatura) {
                        _this.listadoAsistenciaFecha = listadoAsistenciaAsignatura;
                        _this.calcularAsistenciasYAusenciasXEstudiantes();
                        resolve(_this.resultadoReporteAsistencia);
                    });
                });
            });
        });
    };
    CalculoReporteAsistenciaAsignaturas.prototype.calcularAsistenciasYAusenciasXEstudiantes = function () {
        var estudiante;
        var asistenciaEstudiante;
        for (var codigoEstudiante in this.listadoEstudiantes) {
            estudiante = this.listadoEstudiantes[codigoEstudiante];
            for (var fechaAsistenciaMilsecs in this.listadoAsistenciaFecha) {
                asistenciaEstudiante = this.listadoAsistenciaFecha[fechaAsistenciaMilsecs];
                if (asistenciaEstudiante[estudiante.codigo]) {
                    //Se encuentra el estudiante en la asistencia
                    this.listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante]
                        .countAsistencias++;
                }
                else {
                    this.listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante]
                        .countFallas++;
                }
            }
        }
        this.resultadoReporteAsistencia.listaResultadoAsistenciasIndxByEstCodigo = this.listaResultadoAsistenciasIndxByEstCodigo;
    };
    return CalculoReporteAsistenciaAsignaturas;
}());
exports.CalculoReporteAsistenciaAsignaturas = CalculoReporteAsistenciaAsignaturas;
