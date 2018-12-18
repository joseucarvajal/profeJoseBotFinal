"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants;
(function (Constants) {
    Constants.DiasSemana = new Map([
        [0, "domingo"],
        [1, "lunes"],
        [2, "martes"],
        [3, "miercoles"],
        [4, "jueves"],
        [5, "viernes"],
        [6, "sabado"],
    ]);
    var EstadoEstudianteAsignatura;
    (function (EstadoEstudianteAsignatura) {
        EstadoEstudianteAsignatura["Activa"] = "activo";
        EstadoEstudianteAsignatura["Cancelada"] = "cancelada";
    })(EstadoEstudianteAsignatura = Constants.EstadoEstudianteAsignatura || (Constants.EstadoEstudianteAsignatura = {}));
    Constants.UrlServidor = 'https://evening-headland-56271.herokuapp.com';
})(Constants = exports.Constants || (exports.Constants = {}));
