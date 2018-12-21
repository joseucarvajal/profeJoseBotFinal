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
var Data = require("../../data");
var core_1 = require("../../core");
var InscribirAsignatura;
(function (InscribirAsignatura) {
    var Comandos;
    (function (Comandos) {
        Comandos.InscripcionAsignaturas = "InscripcionAsignaturas";
        Comandos.EsperandoInscripcionAsignaturasRpta = "EsperandoInscripcionAsignaturasRpta";
        var OpcionesInscripcionAsignaturasOptsEnum;
        (function (OpcionesInscripcionAsignaturasOptsEnum) {
            OpcionesInscripcionAsignaturasOptsEnum["ConfirmarSI"] = "\u2714\uFE0F Si";
            OpcionesInscripcionAsignaturasOptsEnum["InscribirOtraAsignatura"] = "\u21AA\uFE0F Solicitar inscripci\u00F3n";
        })(OpcionesInscripcionAsignaturasOptsEnum = Comandos.OpcionesInscripcionAsignaturasOptsEnum || (Comandos.OpcionesInscripcionAsignaturasOptsEnum = {}));
    })(Comandos = InscribirAsignatura.Comandos || (InscribirAsignatura.Comandos = {}));
    var nombreContexto = "InscribirAsignaturaReceiver";
    var InscribirAsignaturaReceiver = (function (_super) {
        __extends(InscribirAsignaturaReceiver, _super);
        function InscribirAsignaturaReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            _this.enviarOpcionesInscripcionAsignaturasOpts = [
                [
                    {
                        text: Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI,
                        callback_data: Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI
                    },
                    {
                        text: Comandos.OpcionesInscripcionAsignaturasOptsEnum
                            .InscribirOtraAsignatura,
                        switch_inline_query_current_chat: ""
                    }
                ]
            ];
            _this.listaAsignaturasEstudiante = new Array();
            _this.enviarOpcionSeleccionarAsignaturas = _this.enviarOpcionSeleccionarAsignaturas.bind(_this);
            return _this;
        }
        //#region public
        InscribirAsignaturaReceiver.prototype.enviarOpcionSeleccionarAsignaturas = function (msg) {
            if (!this.validarQueEstudianteHayaIngresadoDatosBasicos(msg)) {
                return;
            }
            this.enviarOpcionesInscripcionAsignaturas(msg);
        };
        //#endregion
        //#region parent events
        InscribirAsignaturaReceiver.prototype.onRecibirMensaje = function (msg) { };
        InscribirAsignaturaReceiver.prototype.onCallbackQuery = function (msg) {
            if (this.estaComandoEnContexto(Comandos.EsperandoInscripcionAsignaturasRpta)) {
                this.onResponderInscripcionAsignatura(msg);
            }
        };
        InscribirAsignaturaReceiver.prototype.onRecibirInlineQuery = function (msg) {
            if (this.estaComandoEnContexto(Comandos.EsperandoInscripcionAsignaturasRpta)) {
                this.enviarAsignaturasQueNoTieneInscritasElEstudiante(msg);
            }
        };
        InscribirAsignaturaReceiver.prototype.onChosenInlineResult = function (msg) {
            if (this.estaComandoEnContexto(Comandos.EsperandoInscripcionAsignaturasRpta)) {
                this.enviarSolicitudInscribirAsignaturaADocente(msg);
            }
        };
        //#endregion
        InscribirAsignaturaReceiver.prototype.enviarSolicitudInscribirAsignaturaADocente = function (msg) {
            var _this = this;
            this.indexMain.solicitudesDocenteReceiver
                .enviarSolicitudInscribirAsignatura(msg, this.estadoGlobal.infoUsuarioMensaje.estudiante, msg.from.id, msg.result_id)
                .then(function () {
                _this.botSender
                    .responderMensajeHTML(msg, "\u2709\uFE0F Se ha enviado la <b>solicitud</b> al profe Jose de manera satisfactoria. Recibir\u00E1s un mensaje cuando el profe haya aprobado o rechazado la solicitud")
                    .then(function () {
                    _this.irAMenuPrincipal(msg);
                });
            });
        };
        InscribirAsignaturaReceiver.prototype.onResponderInscripcionAsignatura = function (msg) {
            if (msg.data == Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI) {
                this.guardarAsignaturasEstudiante(msg);
            }
        };
        InscribirAsignaturaReceiver.prototype.enviarAsignaturasQueNoTieneInscritasElEstudiante = function (msg) {
            var _this = this;
            Data.Asignacion.getAsignaturasQueNoTieneEstudiante(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo).then(function (listadoAsignaturas) {
                var opcionesListaAsignaturas = _this.getAsignaturasFormatoInlineQuery(listadoAsignaturas);
                _this.botSender.responderInLineQuery(msg, opcionesListaAsignaturas);
            });
        };
        InscribirAsignaturaReceiver.prototype.guardarAsignaturasEstudiante = function (msg) {
            var _this = this;
            Data.Asignacion.getAsignaturasByEstudianteCodigo(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo).then(function (asignaturasDeEstudiante) {
                if (!asignaturasDeEstudiante.result) {
                    _this.botSender.responderMensajeErrorHTML(msg, asignaturasDeEstudiante.message);
                    return;
                }
                _this.estadoGlobal.infoUsuarioMensaje.estudiante.inscripcionAsignaturasConfirmado = true;
                Data.Estudiantes.actualizarChat(msg, _this.estadoGlobal, _this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                    Data.Asignacion.registrarAsignaturasAEstudiante(msg, _this.estadoGlobal, asignaturasDeEstudiante.listaAsignaturas).then(function () {
                        _this.enviarMensajeHTML(msg, "", "\u2705 Se han registrado tus asignaturas con \u00E9xito").then(function () {
                            _this.irAMenuPrincipal(msg);
                        });
                    });
                });
            });
        };
        InscribirAsignaturaReceiver.prototype.enviarOpcionesInscripcionAsignaturas = function (msg) {
            var _this = this;
            if (this.estadoGlobal.infoUsuarioMensaje.estudiante
                .inscripcionAsignaturasConfirmado) {
                this.responderOpcionesEstudianteConInscripcionConfirmada(msg);
                return;
            }
            Data.Asignacion.getAsignaturasByEstudianteCodigo(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo).then(function (asignaturasDeEstudiante) {
                if (asignaturasDeEstudiante.result == false) {
                    _this.responderErrorEstudianteSinAsignaturas(msg, asignaturasDeEstudiante.message);
                    return;
                }
                _this.listaAsignaturasEstudiante =
                    asignaturasDeEstudiante.listaAsignaturas;
                if (_this.listaAsignaturasEstudiante.length > 0) {
                    _this.responderAsignaturasPendientesPorInscribirEstudiante(msg, asignaturasDeEstudiante.estudiante);
                }
                else {
                    _this.responderOpcionesEstudianteQueNoApareceEnMatriculados(msg);
                }
            });
        };
        InscribirAsignaturaReceiver.prototype.responderErrorEstudianteSinAsignaturas = function (msg, message) {
            this.botSender.responderMensajeErrorHTML(msg, "Ha ocurrido un error, por favor notif\u00EDcale al profe Jose");
            this.enviarMensajeErrorHTMLAProfesor(message);
        };
        InscribirAsignaturaReceiver.prototype.responderAsignaturasPendientesPorInscribirEstudiante = function (msg, estudiante) {
            var mensaje = "\n\u26A0\uFE0F Por favor verifica estos datos:\n\n<b>C\u00F3digo:</b> " + estudiante.codigo + "\n<b>Nombre:</b> " + estudiante.nombre + "\n<b>Email:</b> " + estudiante.email + "\n      \n<b>Asignaturas</b>: " + this.listaAsignaturasEstudiante.map(function (asignatura) {
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
                        conector +
                            "<i>" +
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
            }) + "\n      \nPresiona <b>\"" + Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI + "\"</b> para confirmar o haz click en <b>\"" + Comandos.OpcionesInscripcionAsignaturasOptsEnum.InscribirOtraAsignatura + "</b>\" para enviar una solicitud al profe Jose\n      ";
            this.enviarMensajeInlineKeyBoard(msg, Comandos.EsperandoInscripcionAsignaturasRpta, mensaje, this.enviarOpcionesInscripcionAsignaturasOpts);
        };
        InscribirAsignaturaReceiver.prototype.responderOpcionesEstudianteQueNoApareceEnMatriculados = function (msg) {
            var opcionesMenuInscripcion = [
                [
                    {
                        text: Comandos.OpcionesInscripcionAsignaturasOptsEnum
                            .InscribirOtraAsignatura,
                        switch_inline_query_current_chat: ""
                    }
                ]
            ];
            var mensaje = "\uD83D\uDE26 No apareces en el listado de matr\u00EDcula de las asignaturas del profe Jose. Si deseas puedes enviarle al profe una <b>solicitud</b> para inscribir una asignatura";
            this.enviarOpcionesInscribirOtrasAsignaturas(msg, mensaje, opcionesMenuInscripcion);
        };
        InscribirAsignaturaReceiver.prototype.responderOpcionesEstudianteConInscripcionConfirmada = function (msg) {
            var _this = this;
            var opcionesMenuInscripcion = [
                [
                    {
                        text: Comandos.OpcionesInscripcionAsignaturasOptsEnum
                            .InscribirOtraAsignatura,
                        switch_inline_query_current_chat: ""
                    }
                ]
            ];
            Data.Asignacion.getAsignaturasInscritasPorEstudianteCachedInfoCompleta(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo).then(function (listaAsignaturas) {
                var mensajeListadoAsignaturas = "";
                var asignatura;
                for (var i = 0; i < listaAsignaturas.length; i++) {
                    asignatura = listaAsignaturas[i];
                    if (asignatura.estado == core_1.Constants.EstadoEstudianteAsignatura.Activa) {
                        mensajeListadoAsignaturas += "\n" + (i + 1) + ". <b>" + asignatura.nombre + "</b>, grupo <b>" + asignatura.grupo + "</b>";
                    }
                }
                var mensaje = "\n\uD83D\uDCA1  Ya has inscrito las siguientes asignaturas:\n" + mensajeListadoAsignaturas + "\n\nSi deseas puedes enviarle al profe Jose una <b>solicitud</b> para inscribir otra asignatura";
                _this.enviarOpcionesInscribirOtrasAsignaturas(msg, mensaje, opcionesMenuInscripcion);
            });
        };
        InscribirAsignaturaReceiver.prototype.enviarOpcionesInscribirOtrasAsignaturas = function (msg, message, opcionesMenuInscripcion) {
            this.enviarMensajeInlineKeyBoard(msg, Comandos.EsperandoInscripcionAsignaturasRpta, message, opcionesMenuInscripcion);
        };
        return InscribirAsignaturaReceiver;
    }(BotReceiver_1.BotReceiver));
    InscribirAsignatura.InscribirAsignaturaReceiver = InscribirAsignaturaReceiver;
})(InscribirAsignatura = exports.InscribirAsignatura || (exports.InscribirAsignatura = {}));
