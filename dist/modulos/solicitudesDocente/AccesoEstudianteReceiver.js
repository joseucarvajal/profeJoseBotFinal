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
var MenuPrincipalReceiver_1 = require("../menuPrincipal/MenuPrincipalReceiver");
var AccesoEstudiante;
(function (AccesoEstudiante) {
    var Comandos;
    (function (Comandos) {
        Comandos.SolicitarCodigo = "SolicitarCodigo";
    })(Comandos = AccesoEstudiante.Comandos || (AccesoEstudiante.Comandos = {}));
    AccesoEstudiante.nombreContexto = "AccesoEstudianteReceiver";
    var AccesoEstudianteReceiver = /** @class */ (function (_super) {
        __extends(AccesoEstudianteReceiver, _super);
        function AccesoEstudianteReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, AccesoEstudiante.nombreContexto) || this;
            _this.nombreContexto = AccesoEstudiante.nombreContexto;
            return _this;
        }
        AccesoEstudianteReceiver.prototype.onRecibirComandoStart = function (msg) {
            var _this = this;
            this.inicializarDatosEstudianteContexto();
            this.enviarMensajeHTML(msg, Comandos.SolicitarCodigo, "Hola <b>" + msg.from.first_name + "!</b>. Soy el asistente del profe <i>Jose Ubaldo Carvajal</i>").then(function () {
                _this.enviarAMenuEstudiante(msg);
            });
        };
        AccesoEstudianteReceiver.prototype.onRecibirMensaje = function (msg) {
            if (msg.text == "/start") {
                this.onRecibirComandoStart(msg);
            }
        };
        AccesoEstudianteReceiver.prototype.inicializarDatosEstudianteContexto = function () {
            var defaultEstudiante = {
                codigo: "",
                nombre: "",
                email: "",
                comando: Comandos.SolicitarCodigo,
                contexto: this.nombreContexto,
                inscripcionAsignaturasConfirmado: false,
                tempData: ""
            };
            var estudiante = __assign({}, this.estadoGlobal.infoUsuarioMensaje.estudiante);
            this.estadoGlobal.infoUsuarioMensaje.estudiante = defaultEstudiante;
            this.estadoGlobal.infoUsuarioMensaje.estudiante = __assign({}, estudiante);
            this.estadoGlobal.infoUsuarioMensaje.estudiante.comando =
                Comandos.SolicitarCodigo;
            this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
        };
        AccesoEstudianteReceiver.prototype.enviarAMenuEstudiante = function (msg) {
            this.enviarMensajeAReceiver(this.indexMain.menuPrincipalReceiver, this.indexMain.menuPrincipalReceiver
                .responderMenuPrincipalEstudiante, msg, MenuPrincipalReceiver_1.MenuPrincipal.Comandos.MenuPrincipalEstudiante);
        };
        return AccesoEstudianteReceiver;
    }(BotReceiver_1.BotReceiver));
    AccesoEstudiante.AccesoEstudianteReceiver = AccesoEstudianteReceiver;
})(AccesoEstudiante = exports.AccesoEstudiante || (exports.AccesoEstudiante = {}));
