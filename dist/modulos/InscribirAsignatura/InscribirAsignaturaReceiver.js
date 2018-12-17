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
var InscribirAsignatura;
(function (InscribirAsignatura) {
    var Comandos;
    (function (Comandos) {
        var SeleccionarAsignaturaOptsEnum;
        (function (SeleccionarAsignaturaOptsEnum) {
            SeleccionarAsignaturaOptsEnum["SeleccionarAsignatura"] = "\u2714\uFE0FSeleccionar asignatura";
        })(SeleccionarAsignaturaOptsEnum = Comandos.SeleccionarAsignaturaOptsEnum || (Comandos.SeleccionarAsignaturaOptsEnum = {}));
        Comandos.InscripcionAsignaturas = "InscripcionAsignaturas";
        Comandos.EsperandoInscripcionAsignaturasRpta = "EsperandoInscripcionAsignaturasRpta";
        var OpcionesInscripcionAsignaturasOptsEnum;
        (function (OpcionesInscripcionAsignaturasOptsEnum) {
            OpcionesInscripcionAsignaturasOptsEnum["ConfirmarSI"] = "\u2714\uFE0F Si";
            OpcionesInscripcionAsignaturasOptsEnum["InscribirOtraAsignatura"] = "\uD83D\uDCCB Seleccionar otra asignatura";
        })(OpcionesInscripcionAsignaturasOptsEnum = Comandos.OpcionesInscripcionAsignaturasOptsEnum || (Comandos.OpcionesInscripcionAsignaturasOptsEnum = {}));
    })(Comandos = InscribirAsignatura.Comandos || (InscribirAsignatura.Comandos = {}));
    var nombreContexto = "InscribirAsignaturaReceiver";
    var InscribirAsignaturaReceiver = /** @class */ (function (_super) {
        __extends(InscribirAsignaturaReceiver, _super);
        function InscribirAsignaturaReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            _this.seleccionarAsignaturaInlineOpts = [
                [
                    {
                        text: Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura,
                        switch_inline_query_current_chat: ""
                    }
                ]
            ];
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
        InscribirAsignaturaReceiver.prototype.enviarOpcionSeleccionarAsignaturas = function (msg) {
            this.enviarOpcionesInscripcionAsignaturas(msg);
        };
        InscribirAsignaturaReceiver.prototype.enviarOpcionSeleccionarAsignaturasOld = function (msg) {
            var _this = this;
            this.actualizarContextoComando(msg, Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura).then(function () {
                _this.botSender.responderInlineKeyboard(msg, "Haz click en la opci\u00F3n <b>\"" + Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura + "\"</b> para seleccionar tus asignaturas", _this.seleccionarAsignaturaInlineOpts);
            });
        };
        //#region parent events
        InscribirAsignaturaReceiver.prototype.onRecibirMensaje = function (msg) { };
        InscribirAsignaturaReceiver.prototype.onCallbackQuery = function (msg) {
            if (this.estaComandoEnContexto(Comandos.EsperandoInscripcionAsignaturasRpta)) {
                this.onResponderInscripcionAsignatura(msg);
            }
        };
        InscribirAsignaturaReceiver.prototype.onRecibirInlineQuery = function (msg) {
            if (!this.estaComandoEnContexto(Comandos.OpcionesInscripcionAsignaturasOptsEnum.InscribirOtraAsignatura)) {
                this.enviarAsignaturasQueNoTieneInscritasElEstudiante(msg);
            }
            else if (!this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura)) {
                return;
            }
        };
        //#endregion
        InscribirAsignaturaReceiver.prototype.onResponderInscripcionAsignatura = function (msg) {
            if (msg.data == Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI) {
                this.guardarAsignaturasEstudiante(msg);
            }
        };
        InscribirAsignaturaReceiver.prototype.enviarAsignaturasQueNoTieneInscritasElEstudiante = function (msg) {
            var _this = this;
            Data.Asignacion.getAsignaturasQueNoTieneEstudiante(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo).then(function (listadoAsignaturas) {
                var opcionesListaAsignaturas = new Array();
                var asignatura;
                for (var i = 0; i < listadoAsignaturas.length; i++) {
                    asignatura = listadoAsignaturas[i];
                    var mensajeHorarios = "";
                    var horario = void 0;
                    var horarioCounter = 0;
                    for (var codigoHorario in asignatura.horarios) {
                        horario = asignatura.horarios[codigoHorario];
                        if (horarioCounter > 0) {
                            mensajeHorarios += " y ";
                        }
                        mensajeHorarios += horario.dia + ", " + horario.horaFin + " a " + horario.horaFin;
                        horarioCounter++;
                    }
                    opcionesListaAsignaturas.push({
                        id: asignatura.codigo,
                        type: "article",
                        title: asignatura.nombre + ", grupo " + asignatura.grupo,
                        description: "" + mensajeHorarios,
                        input_message_content: {
                            message_text: asignatura.nombre + ", grupo " + asignatura.grupo
                        }
                    });
                }
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
                Data.Asignacion.registrarAsignaturasAEstudiante(msg, _this.estadoGlobal, asignaturasDeEstudiante.listaAsignaturas).then(function () {
                    _this.enviarMensajeHTML(msg, "", "Se han registrado tus asignaturas con \u00E9xito");
                });
            });
        };
        InscribirAsignaturaReceiver.prototype.enviarOpcionesInscripcionAsignaturas = function (msg) {
            var _this = this;
            Data.Asignacion.getAsignaturasByEstudianteCodigo(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo).then(function (asignaturasDeEstudiante) {
                if (asignaturasDeEstudiante.result == false) {
                    _this.botSender.responderMensajeErrorHTML(msg, "Ha ocurrido un error, por favor notif\u00EDcale al profe Jose");
                    _this.enviarMensajeErrorHTMLAProfesor(asignaturasDeEstudiante.message);
                    return;
                }
                var opcionesInscripcion = new Array();
                var estudiante = asignaturasDeEstudiante.estudiante;
                _this.listaAsignaturasEstudiante =
                    asignaturasDeEstudiante.listaAsignaturas;
                var mensaje;
                if (_this.listaAsignaturasEstudiante.length > 0) {
                    opcionesInscripcion = _this.enviarOpcionesInscripcionAsignaturasOpts;
                    mensaje = "\n          \u26A0\uFE0F Por favor verifica estos datos:\n          \n          <b>C\u00F3digo:</b> " + estudiante.codigo + "\n          <b>Nombre:</b> " + estudiante.nombre + "\n          <b>Email:</b> " + estudiante.email + "\n          \n<b>Asignaturas</b>: " + _this.listaAsignaturasEstudiante.map(function (asignatura) {
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
                    }) + "\n          \nPresiona <b>\"" + Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI + "\"</b> para confirmar o haz click en <b>\"" + Comandos.OpcionesInscripcionAsignaturasOptsEnum
                        .InscribirOtraAsignatura + "</b>\" para enviar una solicitud al profe Jose\n          ";
                }
                else {
                    opcionesInscripcion = [
                        [
                            {
                                text: Comandos.OpcionesInscripcionAsignaturasOptsEnum
                                    .InscribirOtraAsignatura,
                                callback_data: Comandos.OpcionesInscripcionAsignaturasOptsEnum
                                    .InscribirOtraAsignatura
                            }
                        ]
                    ];
                    mensaje = "\uD83D\uDE26 No apareces en el listado de matr\u00EDcula de ninguna asignatura del profe Jose, haz click en <b>\"" + Comandos.OpcionesInscripcionAsignaturasOptsEnum
                        .InscribirOtraAsignatura + "</b>\" para enviar una solicitud al profe";
                }
                _this.enviarOpcionesInscripcionAsignaturasOpts;
                _this.enviarMensajeInlineKeyBoard(msg, Comandos.EsperandoInscripcionAsignaturasRpta, mensaje, opcionesInscripcion);
            });
        };
        InscribirAsignaturaReceiver.prototype.guardarConfirmacionDatosEstudiante = function (msg) {
            var _this = this;
            var apiMessage = msg;
            if (apiMessage.data ==
                Comandos.OpcionesInscripcionAsignaturasOptsEnum.InscribirOtraAsignatura) {
                this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado = false;
                this.botSender.responderMensajeHTML(msg, "Se notificar\u00E1 al profesor sobre el caso");
                var msgProfesor = {
                    chat: {
                        id: this.estadoGlobal.settings.idUsuarioChatDocente
                    }
                };
                this.botSender.responderMensajeErrorHTML(msgProfesor, "El estudiante " + this.estadoGlobal.infoUsuarioMensaje.estudiante.nombre + " - c\u00F3digo: " + this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo + " ha reportado una inconsistencia");
            }
            else {
                this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado = true;
            }
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                if (_this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado) {
                    //this.enviarAMenuEstudiante(msg);
                }
            });
        };
        InscribirAsignaturaReceiver.prototype.getAsignaturasByEstudiante = function (msg) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo = msg.text;
                Data.Estudiantes.getEstudianteByCodigoAsignatura(msg, _this.estadoGlobal, _this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo, _this.listaAsignaturasEstudiante[0].codigo).then(function (estudiante) {
                    if (estudiante == null) {
                        _this.botSender.responderMensajeErrorHTML(msg, "A\u00FAn no est\u00E1s en el listado de la asignatura <b>" + _this.listaAsignaturasEstudiante[0].nombre + "</b>, grupo: <b>" + _this.listaAsignaturasEstudiante[0].grupo + "</b>, c\u00F3digo: <b>" + _this.listaAsignaturasEstudiante[0].codigo + "</b> p\u00EDdele al profe que te agregue");
                        var mensajeProfesor = {
                            chat: {
                                id: _this.estadoGlobal.settings.idUsuarioChatDocente
                            }
                        };
                        _this.botSender.responderMensajeErrorHTML(mensajeProfesor, "El estudiante <b>" + msg.from.first_name + "</b>, c\u00F3digo: <b>" + msg.text + "</b>, existe en la asignatura, pero no se encuentra en la lista (asignatura_estudiante) de la asignatura <b>" + _this.listaAsignaturasEstudiante[0].nombre + ", c\u00F3digo: " + _this.listaAsignaturasEstudiante[0].codigo + "</b>");
                        reject();
                        return;
                    }
                    _this.estadoGlobal.infoUsuarioMensaje.estudiante = estudiante;
                    Data.Estudiantes.actualizarChat(msg, _this.estadoGlobal, _this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                        resolve();
                    });
                });
            });
        };
        InscribirAsignaturaReceiver.prototype.enviarListadoAsignaturas = function (msg) {
            var _this = this;
            Data.Asignacion.getAsignaturasXPeriodoAndDocente(this.estadoGlobal).then(function (listadoAsignaturasXDocente) {
                var listaAsignaturas = new Array();
                var asignatura;
                for (var codigoAsignatura in listadoAsignaturasXDocente) {
                    asignatura = listadoAsignaturasXDocente[codigoAsignatura];
                    listaAsignaturas.push({
                        id: asignatura.codigo,
                        type: "article",
                        title: asignatura.nombre,
                        input_message_content: {
                            message_text: "Has seleccionado " + asignatura.nombre
                        }
                    });
                }
                _this.botSender.responderInLineQuery(msg, listaAsignaturas);
            });
        };
        InscribirAsignaturaReceiver.prototype.onChosenInlineResult = function (msg) {
            if (!this.estaComandoEnContexto(Comandos.OpcionesInscripcionAsignaturasOptsEnum.InscribirOtraAsignatura)) {
                this.botSender.responderMensajeHTML(msg, "Vas a inscribir " + msg.result_id);
            }
        };
        InscribirAsignaturaReceiver.prototype.registrarAsignaturaAEstudiante = function (msg) { };
        return InscribirAsignaturaReceiver;
    }(BotReceiver_1.BotReceiver));
    InscribirAsignatura.InscribirAsignaturaReceiver = InscribirAsignaturaReceiver;
})(InscribirAsignatura = exports.InscribirAsignatura || (exports.InscribirAsignatura = {}));
