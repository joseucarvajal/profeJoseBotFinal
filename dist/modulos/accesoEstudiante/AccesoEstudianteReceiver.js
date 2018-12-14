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
        Comandos.SolicitarCelular = "SolicitarCelular";
        var SolicitarCelularOpts;
        (function (SolicitarCelularOpts) {
            SolicitarCelularOpts["SolicitarCelular"] = "\u2705 Autorizo compartir mi nro. celular";
        })(SolicitarCelularOpts = Comandos.SolicitarCelularOpts || (Comandos.SolicitarCelularOpts = {}));
    })(Comandos = AccesoEstudiante.Comandos || (AccesoEstudiante.Comandos = {}));
    AccesoEstudiante.nombreContexto = "AccesoEstudianteReceiver";
    var AccesoEstudianteReceiver = /** @class */ (function (_super) {
        __extends(AccesoEstudianteReceiver, _super);
        function AccesoEstudianteReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, AccesoEstudiante.nombreContexto) || this;
            _this.nombreContexto = AccesoEstudiante.nombreContexto;
            _this.solicitarCelularOpts = [
                [
                    {
                        text: Comandos.SolicitarCelularOpts.SolicitarCelular,
                        request_contact: true
                    }
                ]
            ];
            return _this;
        }
        AccesoEstudianteReceiver.prototype.onRecibirComandoStart = function (msg) {
            var _this = this;
            this.inicializarDatosEstudianteContexto();
            this.botSender
                .responderMensajeHTML(msg, "Bienvenido <b>" + msg.from.first_name + "!</b>. Soy el asistente del profe Jose Ubaldo Carvajal")
                .then(function () {
                _this.enviarMensajeKeyboardMarkup(msg, "Para empezar, haz click en el bot\u00F3n <b>\"" + Comandos.SolicitarCelularOpts.SolicitarCelular + "\"</b> si est\u00E1s de acuerdo.", _this.solicitarCelularOpts, Comandos.SolicitarCelular);
            });
        };
        AccesoEstudianteReceiver.prototype.onRecibirMensaje = function (msg) {
            if (msg.text == "/start") {
                this.onRecibirComandoStart(msg);
            }
            else if (this.estaComandoEnContexto(Comandos.SolicitarCelular)) {
                this.enviarMenuAUsuario(msg);
            }
            return;
        };
        AccesoEstudianteReceiver.prototype.enviarMenuAUsuario = function (msg) {
            var _this = this;
            Data.CelularesUsuario.getCelularUsuario(msg, this.estadoGlobal).then(function (celularUsuario) {
                if (celularUsuario == null) {
                    _this.enviarErrorUsuarioNoEncontrado(msg);
                }
                else {
                    _this.crearChatYEnviarMenu(msg, celularUsuario);
                }
            });
        };
        AccesoEstudianteReceiver.prototype.enviarErrorUsuarioNoEncontrado = function (msg) {
            this.botSender.responderMensajeErrorHTML(msg, "No puedo encontrarte en los registros de estudiante, p\u00EDdele al profe que te registre");
            Data.Estudiantes.elminarChat(msg, this.estadoGlobal);
        };
        AccesoEstudianteReceiver.prototype.crearChatYEnviarMenu = function (msg, celularUsuario) {
            var _this = this;
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                celularUsuario.idUsuario = msg.contact.user_id;
                Data.CelularesUsuario.actualizarCelularUsuario(msg, _this.estadoGlobal, msg.contact.phone_number, celularUsuario).then(function () {
                    switch (celularUsuario.tipoUsuario) {
                        case "e":
                            _this.enviarMenuAUsuarioEstudiante(msg);
                            break;
                        case "p":
                            _this.enviarMenuAUsuarioProfesor(msg);
                            break;
                    }
                });
            });
        };
        AccesoEstudianteReceiver.prototype.enviarMenuAUsuarioEstudiante = function (msg) {
            this.enviarMensajeAReceiver(this.indexMain.menuPrincipalReceiver, this.indexMain.menuPrincipalReceiver.responderMenuPrincipalEstudiante, msg, MenuPrincipalReceiver_1.MenuPrincipal.Comandos.MenuPrincipalEstudiante);
        };
        AccesoEstudianteReceiver.prototype.enviarMenuAUsuarioProfesor = function (msg) {
            return;
        };
        AccesoEstudianteReceiver.prototype.inicializarDatosEstudianteContexto = function () {
            var defaultEstudiante = {
                codigo: "",
                nombre: "",
                email: "",
                comando: Comandos.SolicitarCelular,
                contexto: this.nombreContexto
            };
            var estudiante = __assign({}, this.estadoGlobal.infoUsuarioMensaje.estudiante);
            this.estadoGlobal.infoUsuarioMensaje.estudiante = defaultEstudiante;
            this.estadoGlobal.infoUsuarioMensaje.estudiante = __assign({}, estudiante);
            this.estadoGlobal.infoUsuarioMensaje.estudiante.comando =
                Comandos.SolicitarCelular;
            this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
        };
        return AccesoEstudianteReceiver;
    }(BotReceiver_1.BotReceiver));
    AccesoEstudiante.AccesoEstudianteReceiver = AccesoEstudianteReceiver;
})(AccesoEstudiante = exports.AccesoEstudiante || (exports.AccesoEstudiante = {}));
