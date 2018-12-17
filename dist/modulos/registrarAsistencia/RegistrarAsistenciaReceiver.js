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
Object.defineProperty(exports, "__esModule", { value: true });
var BotReceiver_1 = require("../bot/BotReceiver");
var Data = require("../../data");
var core_1 = require("../../core");
var InscribirAsignaturaReceiver_1 = require("../InscribirAsignatura/InscribirAsignaturaReceiver");
var RegistrarAsistencia;
(function (RegistrarAsistencia) {
    var Comandos;
    (function (Comandos) {
        Comandos.SolicitarCodigo = "Ingresa tu código";
        Comandos.SeleccionarComandoInline = "SeleccionarComandoInline";
        var SeleccionarComandoInlineOptsEnum;
        (function (SeleccionarComandoInlineOptsEnum) {
            SeleccionarComandoInlineOptsEnum["SeleccionarAsignaturaByDefault"] = "\u2714\uFE0F Registrar asistencia";
        })(SeleccionarComandoInlineOptsEnum = Comandos.SeleccionarComandoInlineOptsEnum || (Comandos.SeleccionarComandoInlineOptsEnum = {}));
    })(Comandos = RegistrarAsistencia.Comandos || (RegistrarAsistencia.Comandos = {}));
    var nombreContexto = "RegistrarAsistenciaReceiver";
    var RegistrarAsistenciaReceiver = /** @class */ (function (_super) {
        __extends(RegistrarAsistenciaReceiver, _super);
        function RegistrarAsistenciaReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            _this.seleccionarAsignaturaInlineOpts = [
                [
                    {
                        text: Comandos.SeleccionarComandoInlineOptsEnum
                            .SeleccionarAsignaturaByDefault,
                        request_location: true
                    }
                ]
            ];
            _this.registrarAsistencia = _this.registrarAsistencia.bind(_this);
            return _this;
        }
        //#region parent events
        RegistrarAsistenciaReceiver.prototype.registrarAsistencia = function (msg) {
            if (!this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo) {
                this.enviarSolicitudCodigo(msg);
            }
            else {
                this.enviarOpcionesInscripcionAsignaturas();
            }
        };
        RegistrarAsistenciaReceiver.prototype.onRecibirMensaje = function (msg) {
            if (this.estaComandoEnContexto(Comandos.SolicitarCodigo)) {
                this.recibirCodigo();
            }
        };
        RegistrarAsistenciaReceiver.prototype.onRecibirInlineQuery = function (msg) { };
        //#endregion
        RegistrarAsistenciaReceiver.prototype.enviarSolicitudCodigo = function (msg) {
            this.enviarMensajeHTML(msg, Comandos.SolicitarCodigo, Comandos.SolicitarCodigo);
        };
        RegistrarAsistenciaReceiver.prototype.recibirCodigo = function () {
            var _this = this;
            this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo = this.message.text;
            Data.Estudiantes.actualizarChat(this.message, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                _this.enviarOpcionesInscripcionAsignaturas();
            });
        };
        RegistrarAsistenciaReceiver.prototype.enviarOpcionesInscripcionAsignaturas = function () {
            this.enviarMensajeAReceiver(this.indexMain.inscribirAsignaturaReceiver, this.indexMain.inscribirAsignaturaReceiver
                .enviarOpcionSeleccionarAsignaturas, this.message, InscribirAsignaturaReceiver_1.InscribirAsignatura.Comandos.InscripcionAsignaturas);
        };
        RegistrarAsistenciaReceiver.prototype.enviarOpcionesSeleccionAsignatura = function (msg) {
            var _this = this;
            var fechaHoy = new Date();
            Data.Asignacion.getAsignaturasByEstudianteCodigo(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo).then(function (asignaturasDeEstudiante) {
                if (asignaturasDeEstudiante.result == false) {
                    _this.botSender.responderMensajeErrorHTML(msg, "Ha ocurrido un error, por favor notif\u00EDcale al profe Jose");
                    _this.enviarMensajeErrorHTMLAProfesor(asignaturasDeEstudiante.message);
                    return;
                }
                var asignatura;
                var horario;
                var tieneAlgunHorarioHoy = false;
                for (var i = 0; i < asignaturasDeEstudiante.listaAsignaturas.length; i++) {
                    asignatura = asignaturasDeEstudiante.listaAsignaturas[i];
                    for (var codigoHorario in asignatura.horarios) {
                        horario = asignatura.horarios[codigoHorario];
                        if (core_1.Constants.DiasSemana.get(fechaHoy.getDay()) == horario.dia) {
                            tieneAlgunHorarioHoy = true;
                            _this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData =
                                asignatura.codigo;
                            _this.enviarMensajeKeyboardMarkup(msg, "Hoy es <i>" + core_1.Constants.DiasSemana.get(fechaHoy.getDay()) + "</i>. Deseas reportar asistencia en la asignatura <b>" + asignatura.nombre + "\u2753 </b>", _this.seleccionarAsignaturaInlineOpts, Comandos.SeleccionarComandoInlineOptsEnum
                                .SeleccionarAsignaturaByDefault);
                        }
                    }
                }
                if (!tieneAlgunHorarioHoy) {
                    _this.botSender.responderMensajeErrorHTML(msg, "No tienes asignaturas para registrar asistencia el d\u00EDa de hoy");
                }
            });
        };
        RegistrarAsistenciaReceiver.prototype.onCallbackQuery = function (msg) { };
        RegistrarAsistenciaReceiver.prototype.onLocation = function (msg) {
            var _this = this;
            if (this.estaComandoEnContexto(Comandos.SeleccionarComandoInlineOptsEnum
                .SeleccionarAsignaturaByDefault)) {
                Data.Asignacion.registrarAsistencia(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData).then(function () {
                    _this.botSender.responderMensajeHTML(msg, "\u2705 Has registrado asistencia con \u00E9xito");
                });
            }
        };
        return RegistrarAsistenciaReceiver;
    }(BotReceiver_1.BotReceiver));
    RegistrarAsistencia.RegistrarAsistenciaReceiver = RegistrarAsistenciaReceiver;
})(RegistrarAsistencia = exports.RegistrarAsistencia || (exports.RegistrarAsistencia = {}));
