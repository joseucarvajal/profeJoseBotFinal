"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validaciones;
(function (Validaciones) {
    Validaciones.esStringRequeridoValido = function (value) {
        if (!value) {
            return false;
        }
        if (value.trim().length < 1) {
            return false;
        }
        return true;
    };
    Validaciones.esNumeroRequeridoValido = function (value, minValue) {
        if (!value) {
            return false;
        }
        else {
            if (isNaN(value)) {
                return false;
            }
            else if (minValue && value && value < minValue) {
                return false;
            }
        }
        return true;
    };
    Validaciones.esNumeroOpcionalValido = function (value, minValue) {
        if (value) {
            if (isNaN(value)) {
                return false;
            }
            else if (minValue && value && value < minValue) {
                return false;
            }
        }
        return true;
    };
    Validaciones.generarGUID = function () {
        return 'xx-xxxxxxxxxx'.replace(/[x]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    Validaciones.generarFecha = function (fecha) {
        var myObj = JSON.parse('{"date_created":"' + fecha + '"}'), myDate = new Date(1000 * myObj.date_created);
        return myDate.toLocaleString('Es-es');
    };
})(Validaciones = exports.Validaciones || (exports.Validaciones = {}));
