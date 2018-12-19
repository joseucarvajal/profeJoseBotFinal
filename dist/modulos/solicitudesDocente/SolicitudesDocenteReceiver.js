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
var SolicitudesDocente;
(function (SolicitudesDocente) {
    var Comandos;
    (function (Comandos) {
        Comandos.AprobacionInscripcion = "AprobacionInscripcion";
        var OpcionesAprobarInscripcionAsignaturaEnum;
        (function (OpcionesAprobarInscripcionAsignaturaEnum) {
            OpcionesAprobarInscripcionAsignaturaEnum["ConfirmarSI"] = "\u2714\uFE0F Si";
            OpcionesAprobarInscripcionAsignaturaEnum["ConfirmarNo"] = "\uFE0F\u274C No";
        })(OpcionesAprobarInscripcionAsignaturaEnum = Comandos.OpcionesAprobarInscripcionAsignaturaEnum || (Comandos.OpcionesAprobarInscripcionAsignaturaEnum = {}));
    })(Comandos = SolicitudesDocente.Comandos || (SolicitudesDocente.Comandos = {}));
    SolicitudesDocente.nombreContexto = "SolicitudesDocenteReceiver";
    var SolicitudesDocenteReceiver = /** @class */ (function (_super) {
        __extends(SolicitudesDocenteReceiver, _super);
        function SolicitudesDocenteReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, SolicitudesDocente.nombreContexto) || this;
            _this.nombreContexto = SolicitudesDocente.nombreContexto;
            return _this;
        }
        //#region public
        SolicitudesDocenteReceiver.prototype.enviarSolicitudInscribirAsignatura = function (msg, estudiante, chatIdEstudiante, codigoAsignatura) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var aprobarInscripcionAsignaturaOpts = [
                    [
                        {
                            text: Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarSI,
                            callback_data: Comandos.AprobacionInscripcion + "|" + Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarSI + "|" + chatIdEstudiante + "|" + codigoAsignatura
                        },
                        {
                            text: Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarNo,
                            callback_data: Comandos.AprobacionInscripcion + "|" + Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarNo + "|" + chatIdEstudiante + "|" + codigoAsignatura
                        }
                    ]
                ];
                Data.Asignacion.getAsignaturaByCodigo(_this.estadoGlobal, codigoAsignatura).then(function (asignatura) {
                    var msgDocente = {
                        chat: {
                            id: _this.estadoGlobal.settings.idUsuarioChatDocente
                        }
                    };
                    _this.botSender
                        .responderInlineKeyboard(msgDocente, "Profe, aprueba la <b>solicitud</b> de inscripci\u00F3n de la asignatura <b>" + asignatura.nombre + "</b>, grupo <b>" + asignatura.grupo + "</b>, al estudiante <b>" + estudiante.nombre + "</b>, c\u00F3digo: <b>" + estudiante.codigo + "</b>\u2049", aprobarInscripcionAsignaturaOpts)
                        .then(function () {
                        resolve();
                    });
                });
            });
        };
        //#endregion
        //#region parent events
        SolicitudesDocenteReceiver.prototype.onRecibirMensaje = function (msg) { };
        SolicitudesDocenteReceiver.prototype.onCallbackQuery = function (msg) {
            var datosMensajeArr = msg.data.split("|");
            if (datosMensajeArr.length > 1) {
                if (datosMensajeArr[0] == Comandos.AprobacionInscripcion) {
                    this.aprobarORechazarSolicitudInscripcionAsignatura(msg, datosMensajeArr);
                }
            }
        };
        //#endregion
        SolicitudesDocenteReceiver.prototype.aprobarORechazarSolicitudInscripcionAsignatura = function (msg, datosAprobacionArr) {
            var _this = this;
            var resultadoAprobacion = datosAprobacionArr[1];
            var chatIdEstudiante = parseInt(datosAprobacionArr[2]);
            var codigoAsignatura = datosAprobacionArr[3];
            Data.Asignacion.getAsignaturaByCodigo(this.estadoGlobal, codigoAsignatura).then(function (asignatura) {
                var mensajeAEstudiante = {
                    chat: {
                        id: chatIdEstudiante
                    }
                };
                Data.Estudiantes.getEstudianteXChatId(msg, _this.estadoGlobal, chatIdEstudiante.toString()).then(function (estudiante) {
                    if (resultadoAprobacion ==
                        Comandos.OpcionesAprobarInscripcionAsignaturaEnum.ConfirmarNo) {
                        _this.botSender.responderMensajeErrorHTML(mensajeAEstudiante, "El profe Jose ha <b>rechazado</b> la solicitud de inscripci\u00F3n a la asignatura <b>" + asignatura.nombre + "</b>, comun\u00EDcate con el profe o int\u00E9ntalo de nuevo").then(function () {
                            _this.irAMenuPrincipal(msg);
                        });
                        _this.botSender.responderMensajeHTML(msg, "\u2705 Se ha <b>rechazado</b> la solicitud de inscripci\u00F3n del estudiante " + estudiante.nombre + " a la asignatura <b>" + asignatura.nombre + "</b> satisfactoriamente");
                    }
                    else {
                        Data.Asignacion.asociarEstudianteAAsignatura(_this.estadoGlobal, estudiante, codigoAsignatura).then(function () {
                            _this.botSender.responderMensajeHTML(mensajeAEstudiante, "\uD83D\uDCE9 El profe <i>Jose</i> ha <b>aprobado</b> la solicitud de inscripci\u00F3n a la asignatura <b>" + asignatura.nombre + "</b>, ya puedes registrar asistencia para esta asignatura.").then(function () {
                                _this.irAMenuPrincipal(msg);
                            });
                            var msgActualizarChat = {
                                chat: {
                                    id: chatIdEstudiante
                                },
                                from: {
                                    id: chatIdEstudiante
                                }
                            };
                            var mensajeInscripcionAprobada = "\u2705 Se ha <b>aprobado</b> la solicitud de inscripci\u00F3n del estudiante " + estudiante.nombre + " a la asignatura <b>" + asignatura.nombre + "</b> satisfactoriamente";
                            if (!estudiante.inscripcionAsignaturasConfirmado) {
                                Data.Estudiantes.actualizarChat(msg, _this.estadoGlobal, estudiante).then(function () {
                                    estudiante.inscripcionAsignaturasConfirmado = true;
                                }).then(function () {
                                    _this.botSender.responderMensajeHTML(msg, mensajeInscripcionAprobada);
                                });
                            }
                            else {
                                _this.botSender.responderMensajeHTML(msg, mensajeInscripcionAprobada);
                            }
                        });
                    }
                });
            });
        };
        return SolicitudesDocenteReceiver;
    }(BotReceiver_1.BotReceiver));
    SolicitudesDocente.SolicitudesDocenteReceiver = SolicitudesDocenteReceiver;
})(SolicitudesDocente = exports.SolicitudesDocente || (exports.SolicitudesDocente = {}));
