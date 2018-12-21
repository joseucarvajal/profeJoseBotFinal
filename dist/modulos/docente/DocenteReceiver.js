"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BotReceiver_1 = require("../bot/BotReceiver");
var dateFormat = require('dateformat');
var Data = require("../../data");
var CalculoReporteAsistenciaAsignaturas_1 = require("./CalculoReporteAsistenciaAsignaturas");
var Docente;
(function (Docente) {
    var Comandos;
    (function (Comandos) {
        Comandos.MenuDocente = "MenuDocente";
        var MenuDocenteOpts;
        (function (MenuDocenteOpts) {
            MenuDocenteOpts["ReporteAsistencias"] = "\uD83D\uDCC6 Reporte asistencia asignatura";
            MenuDocenteOpts["GeorreferenciarAula"] = "\uD83C\uDF0E Georeferenciar aula";
        })(MenuDocenteOpts = Comandos.MenuDocenteOpts || (Comandos.MenuDocenteOpts = {}));
        var SeleccionarAsignaturaOpts;
        (function (SeleccionarAsignaturaOpts) {
            SeleccionarAsignaturaOpts["SeleccionarAsignaturaReporteAsistencia"] = "\uD83D\uDCC6 Seleccionar asignatura";
            SeleccionarAsignaturaOpts["SeleccionarAsignaturaGeoreferenciar"] = "\uD83C\uDF0E Georeferenciar aula asignatura";
        })(SeleccionarAsignaturaOpts = Comandos.SeleccionarAsignaturaOpts || (Comandos.SeleccionarAsignaturaOpts = {}));
        Comandos.ConfirmarGeoreferenciacion = "ConfirmarGeoreferenciacion";
        var ConfirmarGereferenciarAsignaturasOpts;
        (function (ConfirmarGereferenciarAsignaturasOpts) {
            ConfirmarGereferenciarAsignaturasOpts["ConfirmarGeoreferenciarAsignatura"] = "\u2714\uFE0F Confirmar georeferenciacion";
            ConfirmarGereferenciarAsignaturasOpts["Volver"] = "\uD83D\uDD19 Volver";
        })(ConfirmarGereferenciarAsignaturasOpts = Comandos.ConfirmarGereferenciarAsignaturasOpts || (Comandos.ConfirmarGereferenciarAsignaturasOpts = {}));
    })(Comandos = Docente.Comandos || (Docente.Comandos = {}));
    var nombreContexto = "DocenteReceiver";
    var DocenteReceiver = (function (_super) {
        __extends(DocenteReceiver, _super);
        function DocenteReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            _this.menuDocenteOpts = [
                [
                    {
                        text: Comandos.MenuDocenteOpts.ReporteAsistencias
                    }
                ],
                [
                    {
                        text: Comandos.MenuDocenteOpts.GeorreferenciarAula
                    }
                ]
            ];
            _this.seleccionarAsignaturaAsistenciaOPts = [
                [
                    {
                        text: Comandos.SeleccionarAsignaturaOpts
                            .SeleccionarAsignaturaReporteAsistencia,
                        switch_inline_query_current_chat: ""
                    }
                ]
            ];
            _this.seleccionarAsignaturaGeoreferenciarOPts = [
                [
                    {
                        text: Comandos.SeleccionarAsignaturaOpts
                            .SeleccionarAsignaturaGeoreferenciar,
                        switch_inline_query_current_chat: ""
                    }
                ]
            ];
            _this.confirmarGeoreferenciacionOpts = [
                [
                    {
                        text: Comandos.ConfirmarGereferenciarAsignaturasOpts
                            .ConfirmarGeoreferenciarAsignatura,
                        request_location: true
                    }
                ],
                [
                    {
                        text: Comandos.ConfirmarGereferenciarAsignaturasOpts.Volver
                    }
                ]
            ];
            _this.calculoReporteAsistenciaAsignaturas = new CalculoReporteAsistenciaAsignaturas_1.CalculoReporteAsistenciaAsignaturas(_this.estadoGlobal);
            _this.responderMenu = _this.responderMenu.bind(_this);
            return _this;
        }
        //#region Public
        DocenteReceiver.prototype.responderMenu = function (msg) {
            this.botSender.responderKeyboardMarkup(msg, "Selecciona una opci\u00F3n", this.menuDocenteOpts);
        };
        //#endregion
        //#region parent events
        DocenteReceiver.prototype.onRecibirMensaje = function (msg) {
            if (msg.text == "/profesor") {
                this.irAMenuPrincipalAndSaveState(msg);
            }
            else if (this.seHaSeleccionadoOpcionDeMenu(msg, Comandos.MenuDocenteOpts.ReporteAsistencias)) {
                this.enviarMenuOpcionesReporteAsistenciaAsignatura(msg, "Selecciona la asignatura para generar el reporte");
            }
            else if (this.seHaSeleccionadoOpcionDeMenu(msg, Comandos.MenuDocenteOpts.GeorreferenciarAula)) {
                this.enviarMenuOpcionesSeleccionarHorarioGereferenciar(msg);
            }
            else if (this.seHaSeleccionadoOpcionDeMenu(msg, Comandos.ConfirmarGereferenciarAsignaturasOpts.Volver)) {
                this.responderMenu(msg);
            }
        };
        DocenteReceiver.prototype.onCallbackQuery = function (msg) { };
        DocenteReceiver.prototype.onLocation = function (msg) {
            if (this.estaEnContextoActual()) {
                this.georeferenciarAula(msg);
            }
        };
        DocenteReceiver.prototype.onRecibirInlineQuery = function (msg) {
            if (this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaOpts
                .SeleccionarAsignaturaReporteAsistencia)) {
                this.enviarListadoAsignaturasDocente(msg);
            }
            else if (this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaOpts.SeleccionarAsignaturaGeoreferenciar)) {
                this.enviarListadoHorariosAsignaturaDocente(msg);
            }
        };
        DocenteReceiver.prototype.onChosenInlineResult = function (msg) {
            if (this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaOpts
                .SeleccionarAsignaturaReporteAsistencia)) {
                this.enviarReporteAsistenciaAsignatura(msg, msg.result_id);
            }
            else if (this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaOpts.SeleccionarAsignaturaGeoreferenciar)) {
                this.enviarConfirmacionGeoreferenciarAsignatura(msg);
            }
        };
        //#endregion
        DocenteReceiver.prototype.georeferenciarAula = function (msg) {
            var _this = this;
            var datosHorarioAsignatura = this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData.split("#|@");
            var codigoAsignatura = datosHorarioAsignatura[0];
            var codigoHorario = datosHorarioAsignatura[1];
            Data.Asignacion.actualizarGeoreferenciaAsignatura(msg, this.estadoGlobal, codigoAsignatura, codigoHorario).then(function () {
                _this.botSender.responderMensajeHTML(msg, "\u2705 Se ha geoferenciado la asignatura con \u00E9xito");
            });
        };
        DocenteReceiver.prototype.enviarMenuOpcionesSeleccionarHorarioGereferenciar = function (msg) {
            this.enviarMensajeInlineKeyBoard(msg, Comandos.SeleccionarAsignaturaOpts.SeleccionarAsignaturaGeoreferenciar, "Selecciona 1 horario de asignatura para georeferenciar", this.seleccionarAsignaturaGeoreferenciarOPts);
        };
        DocenteReceiver.prototype.enviarMenuOpcionesReporteAsistenciaAsignatura = function (msg, label) {
            this.enviarMensajeInlineKeyBoard(msg, Comandos.SeleccionarAsignaturaOpts
                .SeleccionarAsignaturaReporteAsistencia, label, this.seleccionarAsignaturaAsistenciaOPts);
        };
        DocenteReceiver.prototype.enviarListadoAsignaturasDocente = function (msg) {
            var _this = this;
            Data.Asignacion.getAsignaturasXPeriodoAndDocenteAsArray(this.estadoGlobal).then(function (listaAsignaturas) {
                var opcionesListaAsignaturas = _this.getAsignaturasFormatoInlineQuery(listaAsignaturas);
                _this.botSender.responderInLineQuery(msg, opcionesListaAsignaturas);
            });
        };
        DocenteReceiver.prototype.enviarListadoHorariosAsignaturaDocente = function (msg) {
            var _this = this;
            Data.Asignacion.getTodosHorariosYAsignaturasDocente(this.estadoGlobal).then(function (listaHorarioAsignatura) {
                var opcionesListaHorarios = new Array();
                for (var i = 0; i < listaHorarioAsignatura.length; i++) {
                    opcionesListaHorarios.push({
                        id: listaHorarioAsignatura[i].horario.id,
                        type: "article",
                        title: listaHorarioAsignatura[i].asignatura.nombre + ", " + listaHorarioAsignatura[i].horario.dia,
                        description: "aula " + listaHorarioAsignatura[i].horario.aula + ", " + listaHorarioAsignatura[i].horario.horaInicio + " a " + listaHorarioAsignatura[i].horario.horaFin,
                        input_message_content: {
                            message_text: listaHorarioAsignatura[i].asignatura.nombre + ", " + listaHorarioAsignatura[i].horario.dia + " - " + listaHorarioAsignatura[i].horario.horaInicio + " a " + listaHorarioAsignatura[i].horario.horaFin
                        }
                    });
                }
                _this.botSender.responderInLineQuery(msg, opcionesListaHorarios);
            });
        };
        DocenteReceiver.prototype.enviarReporteAsistenciaAsignatura = function (msg, codigoAsignatura) {
            var _this = this;
            this.calculoReporteAsistenciaAsignaturas
                .calcularReporteAsistenciaAsignaturas(msg, codigoAsignatura)
                .then(function (resultadoReporteAsistencia) {
                var listaHorarios = new Array();
                for (var codigoHorario in resultadoReporteAsistencia.asignatura
                    .horarios) {
                    listaHorarios.push(resultadoReporteAsistencia.asignatura.horarios[codigoHorario]);
                }
                var htmlReporte = "\n          <div style=\"font-size:12px\">\n          <br/>\n          <center><h3>Reporte asistencia " + resultadoReporteAsistencia.asignatura.nombre + " - " + dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss tt") + "</h3></center>\n          <table style=\"font-size:12px\">\n            <tr><td><strong>Asignatura:</strong></td><td>" + resultadoReporteAsistencia.asignatura.nombre + " - (" + resultadoReporteAsistencia.asignatura.codigo + ") </td>\n            </tr>\n            <tr><td><strong>Grupo</strong></td><td>" + resultadoReporteAsistencia.asignatura.grupo + "</td></tr>\n            <tr><td><strong>Horarios</strong></td>\n            <td>\n              \n              " + listaHorarios.map(function (horario, i) {
                    var y = i > 0 ? " y " : "";
                    return (y +
                        horario.dia +
                        " " +
                        horario.horaInicio +
                        " a " +
                        horario.horaFin +
                        ", aula: " +
                        horario.aula);
                }) + "\n            </td>\n            </tr>\n          </table><br/>\n          <table border=\"1\" cellspacing=\"0\" style=\"width: 100%; border:1px solid;position: relative; font-size:12px\">\n          <tr><th>C\u00F3digo</th><th>Nombre</th><th>Email</th><th>Asistencias</th><th>Fallas</th></tr>\n        ";
                var htmlRegistroEstudiante = "";
                var resultadoByEst;
                for (var codigoEstudiante in resultadoReporteAsistencia.listaResultadoAsistenciasIndxByEstCodigo) {
                    resultadoByEst =
                        resultadoReporteAsistencia
                            .listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante];
                    htmlRegistroEstudiante = "<tr><td>" + resultadoByEst.estudiante.codigo + "</td><td>" + resultadoByEst.estudiante.nombre + "</td><td>" + resultadoByEst.estudiante.email + "</td><td>" + resultadoByEst.countAsistencias + "</td><td>" + resultadoByEst.countFallas + "</td></tr>";
                    htmlReporte += htmlRegistroEstudiante;
                }
                htmlReporte += "</table></div>";
                _this.botSender.enviarHTMLComoDocumentoPDF(msg, "asistencia_" + resultadoReporteAsistencia.asignatura.nombre + ".pdf", htmlReporte, "Reporte asistencia");
            });
        };
        DocenteReceiver.prototype.enviarConfirmacionGeoreferenciarAsignatura = function (msg) {
            var _this = this;
            this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData = msg.result_id;
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                var datosHorarioAsignatura = msg.result_id.split("#|@");
                var codigoAsignatura = datosHorarioAsignatura[0];
                var codigoHorario = datosHorarioAsignatura[1];
                Data.Asignacion.getAsignaturaByCodigo(_this.estadoGlobal, codigoAsignatura).then(function (asignatura) {
                    _this.enviarMensajeKeyboardMarkup(msg, "Confirmas que deseas gereferenciar la asignatura <b>" + asignatura.nombre + "</b>, aula: " + asignatura.horarios[codigoHorario].aula + " en el horario: " + asignatura.horarios[codigoHorario].dia + ", de " + asignatura.horarios[codigoHorario].horaInicio + " a " + asignatura.horarios[codigoHorario].horaFin + "\u2753", _this.confirmarGeoreferenciacionOpts, Comandos.ConfirmarGereferenciarAsignaturasOpts
                        .ConfirmarGeoreferenciarAsignatura);
                });
            });
        };
        DocenteReceiver.prototype.irAMenuPrincipalAndSaveState = function (msg) {
            if (msg.from.id != this.estadoGlobal.settings.idUsuarioChatDocente) {
                this.botSender.responderMensajeErrorHTML(msg, "Lo siento, s\u00F3lo puedo darle acceso al profe <b>Jose</b>");
                return;
            }
            this.enviarMensajeAReceiver(this, this.responderMenu, msg, Comandos.MenuDocente);
        };
        return DocenteReceiver;
    }(BotReceiver_1.BotReceiver));
    Docente.DocenteReceiver = DocenteReceiver;
})(Docente = exports.Docente || (exports.Docente = {}));
