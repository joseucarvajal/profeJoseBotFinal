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
        Comandos.SolicitarCodigo = "SolicitarCodigo";
        Comandos.ConfirmarDatosEstudiante = "ConfirmarDatosEstudiante";
        var ConfirmarDatosEstudianteInlineOptsEnum;
        (function (ConfirmarDatosEstudianteInlineOptsEnum) {
            ConfirmarDatosEstudianteInlineOptsEnum["ConfirmarSI"] = "\u2714\uFE0F";
            ConfirmarDatosEstudianteInlineOptsEnum["ConfirmarNO"] = "\u26D4\uFE0F";
        })(ConfirmarDatosEstudianteInlineOptsEnum = Comandos.ConfirmarDatosEstudianteInlineOptsEnum || (Comandos.ConfirmarDatosEstudianteInlineOptsEnum = {}));
    })(Comandos = AccesoEstudiante.Comandos || (AccesoEstudiante.Comandos = {}));
    AccesoEstudiante.nombreContexto = "AccesoEstudianteReceiver";
    var AccesoEstudianteReceiver = /** @class */ (function (_super) {
        __extends(AccesoEstudianteReceiver, _super);
        function AccesoEstudianteReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, AccesoEstudiante.nombreContexto) || this;
            _this.nombreContexto = AccesoEstudiante.nombreContexto;
            _this.confirmarDatosEstudianteInlineOpts = [
                [
                    {
                        text: Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarSI,
                        callback_data: Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarSI
                    },
                    {
                        text: Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarNO,
                        callback_data: Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarNO
                    }
                ]
            ];
            _this.listaAsignaturasEstudiante = new Array();
            return _this;
        }
        AccesoEstudianteReceiver.prototype.onRecibirComandoStart = function (msg) {
            this.inicializarDatosEstudianteContexto();
            if (this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado) {
                this.enviarAMenuEstudiante(msg);
                return;
            }
            this.enviarMensajeHTML(msg, Comandos.SolicitarCodigo, "Bienvenido <b>" + msg.from.first_name + "!</b>. Soy el asistente del profe <i>Jose Ubaldo Carvajal</i>, Para empezar, ingresa tu c\u00F3digo");
        };
        AccesoEstudianteReceiver.prototype.onRecibirMensaje = function (msg) {
            if (msg.text == "/start") {
                this.onRecibirComandoStart(msg);
            }
            else if (this.estaComandoEnContexto(Comandos.SolicitarCodigo)) {
                this.validarYEnviarConfirmacionEstudiante(msg);
            }
            return;
        };
        AccesoEstudianteReceiver.prototype.onCallbackQuery = function (msg) {
            if (this.estaComandoEnContexto(Comandos.ConfirmarDatosEstudiante)) {
                this.guardarConfirmacionDatosEstudiante(msg);
            }
        };
        AccesoEstudianteReceiver.prototype.guardarConfirmacionDatosEstudiante = function (msg) {
            var _this = this;
            var apiMessage = msg;
            if (apiMessage.data ==
                Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarNO) {
                this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado = false;
                this.botSender.responderMensajeHTML(msg, "Se notificar\u00E1 al profesor sobre el caso");
                var msgProfesor = {
                    chat: {
                        id: parseInt(this.estadoGlobal.settings.idUsuarioChatDocente)
                    }
                };
                this.botSender.responderMensajeErrorHTML(msgProfesor, "El estudiante " + this.estadoGlobal.infoUsuarioMensaje.estudiante.nombre + " - c\u00F3digo: " + this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo + " ha reportado una inconsistencia");
            }
            else {
                this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado = true;
            }
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                if (_this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado) {
                    _this.enviarAMenuEstudiante(msg);
                }
            });
        };
        AccesoEstudianteReceiver.prototype.validarYEnviarConfirmacionEstudiante = function (msg) {
            var _this = this;
            Data.Asignacion.getAsignaturasByEstudianteCodigo(this.estadoGlobal, msg.text).then(function (listaAsignaturasEstudiante) {
                _this.listaAsignaturasEstudiante = listaAsignaturasEstudiante;
                if (listaAsignaturasEstudiante.length == 0) {
                    _this.enviarErrorUsuarioNoEncontrado(msg);
                }
                else {
                    _this.crearChatYEnviarConfirmacionDatosEstudiante(msg);
                }
            });
        };
        AccesoEstudianteReceiver.prototype.enviarErrorUsuarioNoEncontrado = function (msg) {
            this.botSender.responderMensajeErrorHTML(msg, "Parece que no est\u00E1s matriculado en ninguna de las asignaturas del profe Jose. Verifica tu c\u00F3digo e ingresalo de nuevo");
            Data.Estudiantes.elminarChat(msg, this.estadoGlobal);
        };
        AccesoEstudianteReceiver.prototype.crearChatYEnviarConfirmacionDatosEstudiante = function (msg) {
            var _this = this;
            this.actualizarDatosChat(msg).then(function () {
                _this.enviarConfirmacionDatosEstudiante(msg);
            });
        };
        AccesoEstudianteReceiver.prototype.actualizarDatosChat = function (msg) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo = msg.text;
                Data.Estudiantes.getEstudianteByCodigoAsignatura(msg, _this.estadoGlobal, _this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo, _this.listaAsignaturasEstudiante[0].codigo).then(function (estudiante) {
                    _this.estadoGlobal.infoUsuarioMensaje.estudiante = estudiante;
                    Data.Estudiantes.actualizarChat(msg, _this.estadoGlobal, _this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                        resolve();
                    });
                });
            });
        };
        AccesoEstudianteReceiver.prototype.enviarConfirmacionDatosEstudiante = function (msg) {
            var estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
            this.enviarMensajeInlineKeyBoard(msg, Comandos.ConfirmarDatosEstudiante, "\n\u26A0\uFE0F Verifica estos datos:\n\n<b>C\u00F3digo:</b> " + estudiante.codigo + "\n<b>Nombre:</b> " + estudiante.nombre + "\n<b>Email:</b> " + estudiante.email + "\n\n<b>Asignaturas</b>: " + this.listaAsignaturasEstudiante.map(function (asignatura) {
                var infoAsignatura = "\n\n📒<b>" +
                    asignatura.nombre +
                    "</b>, " +
                    " grupo " +
                    asignatura.grupo;
                var horario;
                var i = 0;
                var conector;
                for (var codigoHorario in asignatura.horarios) {
                    horario = asignatura.horarios[codigoHorario];
                    conector = i > 0 ? " y " : "\n";
                    infoAsignatura +=
                        "<i>" +
                            conector +
                            horario.dia +
                            "</i> " +
                            horario.horaInicio +
                            " a " +
                            horario.horaFin +
                            ", aula " +
                            horario.aula;
                    i++;
                }
                return infoAsignatura;
            }) + "\n\nSi corresponde a tu informaci\u00F3n, presiona <b>\"" + Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarSI + "\"</b> para confirmar o <b>\"" + Comandos.ConfirmarDatosEstudianteInlineOptsEnum.ConfirmarNO + "\"</b> si ves alguna inconsistencia\n", this.confirmarDatosEstudianteInlineOpts);
        };
        AccesoEstudianteReceiver.prototype.inicializarDatosEstudianteContexto = function () {
            var defaultEstudiante = {
                codigo: "",
                nombre: "",
                email: "",
                comando: Comandos.SolicitarCodigo,
                contexto: this.nombreContexto,
                registroConfirmado: false
            };
            var estudiante = __assign({}, this.estadoGlobal.infoUsuarioMensaje.estudiante);
            this.estadoGlobal.infoUsuarioMensaje.estudiante = defaultEstudiante;
            this.estadoGlobal.infoUsuarioMensaje.estudiante = __assign({}, estudiante);
            this.estadoGlobal.infoUsuarioMensaje.estudiante.comando =
                Comandos.SolicitarCodigo;
            this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
        };
        AccesoEstudianteReceiver.prototype.enviarAMenuEstudiante = function (msg) {
            this.enviarMensajeAReceiver(this.indexMain.menuPrincipalReceiver, this.indexMain.menuPrincipalReceiver.responderMenuPrincipalEstudiante, msg, MenuPrincipalReceiver_1.MenuPrincipal.Comandos.MenuPrincipalEstudiante);
        };
        return AccesoEstudianteReceiver;
    }(BotReceiver_1.BotReceiver));
    AccesoEstudiante.AccesoEstudianteReceiver = AccesoEstudianteReceiver;
})(AccesoEstudiante = exports.AccesoEstudiante || (exports.AccesoEstudiante = {}));
