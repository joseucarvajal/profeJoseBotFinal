"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var BotReceiver_1 = require("../bot/BotReceiver");
var Data = require("../../data");
var MenuPrincipalReceiver_1 = require("../menuPrincipal/MenuPrincipalReceiver");
var AccesoEstudiante;
(function (AccesoEstudiante) {
    var Comandos;
    (function (Comandos) {
        Comandos.IngresarCodigoProfesor = "\u2753Para empezar, ingresa el c\u00F3digo provisto por el profesor";
    })(Comandos = AccesoEstudiante.Comandos || (AccesoEstudiante.Comandos = {}));
    var nombreContexto = "AccesoEstudianteReceiver";
    var AccesoEstudianteReceiver = /** @class */ (function (_super) {
        __extends(AccesoEstudianteReceiver, _super);
        function AccesoEstudianteReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            return _this;
        }
        AccesoEstudianteReceiver.prototype.onRecibirComandoStart = function (msg) {
            var _this = this;
            var defaultEstudiante = {
                codigo: "",
                nombre: "",
                email: "",
                comando: Comandos.IngresarCodigoProfesor,
                contexto: this.nombreContexto,
            };
            this.estadoGlobal.infoUsuarioMensaje.estudiante = __assign({}, defaultEstudiante, this.estadoGlobal.infoUsuarioMensaje.estudiante);
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                _this.botSender.responderMensajeHTML(msg, "Hola " + msg.from.first_name + ", soy el asistente del profe Jose").then(function () {
                    _this.botSender.responderMensajeHTML(msg, Comandos.IngresarCodigoProfesor);
                });
            }, function () {
                console.error("AccesoEstudianteReceiver/onRecibirComandoStart");
            });
        };
        AccesoEstudianteReceiver.prototype.onRecibirMensaje = function (msg) {
            if (msg.text == "/start") {
                this.onRecibirComandoStart(msg);
            }
            else if (this.estaComandoEnContexto(Comandos.IngresarCodigoProfesor)) {
                if (msg.text != this.estadoGlobal.settings.codigoAccesoEstudiante) {
                    this.botSender.responderMensajeErrorHTML(msg, "Has ingresado un c\u00F3digo de acceso incorrecto");
                    return;
                }
                this.enviarMensajeAReceiver(this.indexMain.menuPrincipalReceiver, this.indexMain.menuPrincipalReceiver.responderMenuPrincipal, msg, MenuPrincipalReceiver_1.MenuPrincipal.Comandos.MenuPrincipal);
            }
            return;
        };
        return AccesoEstudianteReceiver;
    }(BotReceiver_1.BotReceiver));
    AccesoEstudiante.AccesoEstudianteReceiver = AccesoEstudianteReceiver;
})(AccesoEstudiante = exports.AccesoEstudiante || (exports.AccesoEstudiante = {}));
