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
var dateFormat = require("dateformat");
var RegistrarAsistencia;
(function (RegistrarAsistencia) {
    var Comandos;
    (function (Comandos) {
        Comandos.SolicitarAsistenciaGPS = "SolicitarAsistenciaGPS";
        Comandos.SeleccionarComandoInline = "SeleccionarComandoInline";
        var SeleccionarComandoInlineOptsEnum;
        (function (SeleccionarComandoInlineOptsEnum) {
            SeleccionarComandoInlineOptsEnum["SeleccionarAsignaturaByDefault"] = "\u2714\uFE0F Registrar asistencia";
            SeleccionarComandoInlineOptsEnum["Volver"] = "\uD83D\uDD19 Volver";
        })(SeleccionarComandoInlineOptsEnum = Comandos.SeleccionarComandoInlineOptsEnum || (Comandos.SeleccionarComandoInlineOptsEnum = {}));
        var SeleccionarAsignaturaAsistenciaOPts;
        (function (SeleccionarAsignaturaAsistenciaOPts) {
            SeleccionarAsignaturaAsistenciaOPts["SeleccionarAsignatura"] = "\u2197\uFE0F Seleccionar una asignatura";
        })(SeleccionarAsignaturaAsistenciaOPts = Comandos.SeleccionarAsignaturaAsistenciaOPts || (Comandos.SeleccionarAsignaturaAsistenciaOPts = {}));
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
                ],
                [
                    {
                        text: Comandos.SeleccionarComandoInlineOptsEnum.Volver
                    }
                ]
            ];
            _this.seleccionarAsignaturaAsistenciaOPts = [
                [
                    {
                        text: Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura,
                        switch_inline_query_current_chat: ""
                    }
                ]
            ];
            _this.distanciaEstudianteCentroAula = 0;
            _this.registrarAsistencia = _this.registrarAsistencia.bind(_this);
            _this.solicitarAsistenciaGPS = _this.solicitarAsistenciaGPS.bind(_this);
            return _this;
        }
        //#region public
        RegistrarAsistenciaReceiver.prototype.registrarAsistencia = function (msg) {
            if (!this.validarQueEstudianteHayaIngresadoDatosBasicos(msg)) {
                return;
            }
            this.enviarOpcionesInscripcionAsignaturas();
        };
        RegistrarAsistenciaReceiver.prototype.solicitarAsistenciaGPS = function (msg) {
            if (!this.validarQueEstudianteHayaIngresadoDatosBasicos(msg)) {
                return;
            }
            this.enviarOpcionesSeleccionAsignaturaParaRegistrarAsistencia(msg);
        };
        //#endregion
        //#region parent events
        RegistrarAsistenciaReceiver.prototype.onCallbackQuery = function (msg) { };
        RegistrarAsistenciaReceiver.prototype.onLocation = function (msg) {
            if (this.estaComandoEnContexto(Comandos.SeleccionarComandoInlineOptsEnum
                .SeleccionarAsignaturaByDefault)) {
                this.guardarAsistencia(msg);
            }
        };
        RegistrarAsistenciaReceiver.prototype.onRecibirMensaje = function (msg) {
            if (this.estaOpcionSeleccionadaEnContexto(Comandos.SeleccionarComandoInlineOptsEnum.Volver, msg)) {
                this.irAMenuPrincipal(msg);
            }
        };
        RegistrarAsistenciaReceiver.prototype.onRecibirInlineQuery = function (msg) {
            if (this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura)) {
                this.enviarListaAsignaturasParaReportarAsistencia(msg);
            }
        };
        RegistrarAsistenciaReceiver.prototype.onChosenInlineResult = function (msg) {
            if (this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura)) {
                this.guardarAsignaturaSeleccionadaTemporal(msg);
            }
        };
        //#endregion
        RegistrarAsistenciaReceiver.prototype.guardarAsignaturaSeleccionadaTemporal = function (msg) {
            var _this = this;
            this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData = msg.result_id;
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
                Data.Asignacion.getAsignaturaByCodigo(_this.estadoGlobal, msg.result_id).then(function (asignatura) {
                    _this.enviarOpcionRegistrarAsistenciaUnaAsignatura(msg, asignatura, new Date());
                });
            });
        };
        RegistrarAsistenciaReceiver.prototype.guardarAsistencia = function (msg) {
            var _this = this;
            Data.Asignacion.getAsignaturaByCodigo(this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData).then(function (asignatura) {
                if (!_this.validarHorarioRegistroAsistencia(msg, asignatura)) {
                    _this.irAMenuPrincipal(msg);
                    return;
                }
                if (!_this.validarDistanciaRegistroAsistencia(msg, asignatura)) {
                    return;
                }
                Data.Asignacion.registrarAsistencia(msg, _this.estadoGlobal, _this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData).then(function () {
                    _this.botSender
                        .responderMensajeHTML(msg, "\u2705 Has registrado asistencia con \u00E9xito. Est\u00E1s ubicado a <b>" + _this.distanciaEstudianteCentroAula.toFixed(1) + " metros</b> aproximadamente del centro del sal\u00F3n de clase")
                        .then(function () {
                        _this.irAMenuPrincipal(msg);
                    });
                });
            });
        };
        //true: es válido
        //false: no es válido
        RegistrarAsistenciaReceiver.prototype.validarHorarioRegistroAsistencia = function (msg, asignatura) {
            var _this = this;
            var fechaHoy = new Date();
            var horario = this.getHorarioRegistroAsistencia(asignatura);
            if (!horario) {
                this.botSender.responderMensajeErrorHTML(msg, "Hoy no tienes ning\u00FAn horario para registrar asistencia en " + asignatura.nombre);
                return false;
            }
            var horaHoy = dateFormat(fechaHoy, "HH:MM");
            var horaMinutosInicioClase = horario.horaInicio.split(":");
            var fechaHoraInicioClase = new Date();
            fechaHoraInicioClase.setHours(parseInt(horaMinutosInicioClase[0], 10));
            fechaHoraInicioClase.setMinutes(parseInt(horaMinutosInicioClase[1], 10));
            var horaMinutosFinClase = horario.horaFin.split(":");
            var fechaHoraFinClase = new Date();
            fechaHoraFinClase.setHours(parseInt(horaMinutosFinClase[0], 10));
            fechaHoraFinClase.setMinutes(parseInt(horaMinutosFinClase[1], 10));
            var horasDiferencia;
            if (horaHoy < horario.horaInicio) {
                horasDiferencia = Math.abs(fechaHoraInicioClase - fechaHoy) / 36e5;
                this.botSender
                    .responderMensajeHTML(msg, "Son las <b>" + horaHoy + "</b> y la clase <b>" + asignatura.nombre + "</b> inicia en <b>" + horasDiferencia.toFixed(2) + " horas</b> aproximadamente. A\u00FAn es muy temprano para registrar asistencia.")
                    .then(function () {
                    _this.botSender.responderMensajeHTML(msg, "\uD83D\uDE05");
                });
                return false;
            }
            else if (horaHoy > horario.horaFin) {
                horasDiferencia = Math.abs(fechaHoraFinClase - fechaHoy) / 36e5;
                this.botSender
                    .responderMensajeHTML(msg, "Son las <b>" + horaHoy + "</b> y la clase <b>" + asignatura.nombre + "</b> termin\u00F3 hace <b>" + horasDiferencia.toFixed(2) + " horas</b> aproximadamente. Ya es tarde para registrar asistencia.")
                    .then(function () {
                    _this.botSender.responderMensajeHTML(msg, "\uD83D\uDE22");
                });
                return false;
            }
            return true;
        };
        RegistrarAsistenciaReceiver.prototype.validarDistanciaRegistroAsistencia = function (msg, asignatura) {
            var _this = this;
            var horario = this.getHorarioRegistroAsistencia(asignatura);
            var latitudLongitudHorario = horario.coordenadasAula.split(",");
            var latitudHorario = parseFloat(latitudLongitudHorario[0]);
            var longitudHorario = parseFloat(latitudLongitudHorario[1]);
            //Distancia en km
            var distancia = this.distanciaEntreDosGeolocalizaciones(latitudHorario, longitudHorario, msg.location.latitude, msg.location.longitude, "K");
            distancia = distancia * 1000; //Convertir a metros
            this.distanciaEstudianteCentroAula = distancia;
            if (distancia <=
                this.estadoGlobal.settings.radioMaxDistanciaAsistenciaMetros) {
                return true;
            }
            this.botSender
                .responderMensajeHTML(msg, "Est\u00E1s muy lejos <b>(" + distancia.toFixed(1) + " metros)</b> aproximadamente del sal\u00F3n de clases")
                .then(function () {
                _this.botSender.responderMensajeHTML(msg, "\uD83D\uDE1E");
            });
            return false;
        };
        RegistrarAsistenciaReceiver.prototype.distanciaEntreDosGeolocalizaciones = function (lat1, lon1, lat2, lon2, unit) {
            if (lat1 == lat2 && lon1 == lon2) {
                return 0;
            }
            else {
                var radlat1 = (Math.PI * lat1) / 180;
                var radlat2 = (Math.PI * lat2) / 180;
                var theta = lon1 - lon2;
                var radtheta = (Math.PI * theta) / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) +
                    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = (dist * 180) / Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit == "K") {
                    dist = dist * 1.609344;
                }
                if (unit == "N") {
                    dist = dist * 0.8684;
                }
                return dist;
            }
        };
        RegistrarAsistenciaReceiver.prototype.getHorarioRegistroAsistencia = function (asignatura) {
            var horario;
            var fechaHoy = new Date();
            for (var codigoHorario in asignatura.horarios) {
                horario = asignatura.horarios[codigoHorario];
                if (core_1.Constants.DiasSemana.get(fechaHoy.getDay()) == horario.dia) {
                    return horario;
                }
            }
            return {};
        };
        RegistrarAsistenciaReceiver.prototype.enviarOpcionesInscripcionAsignaturas = function () {
            this.enviarMensajeAReceiver(this.indexMain.inscribirAsignaturaReceiver, this.indexMain.inscribirAsignaturaReceiver
                .enviarOpcionSeleccionarAsignaturas, this.message, InscribirAsignaturaReceiver_1.InscribirAsignatura.Comandos.InscripcionAsignaturas);
        };
        RegistrarAsistenciaReceiver.prototype.enviarOpcionesSeleccionAsignaturaParaRegistrarAsistencia = function (msg) {
            var _this = this;
            var fechaHoy = new Date();
            this.getAsignaturasAsistenciaHoy(msg).then(function (listadoAsignaturasDeEstudianteHoy) {
                if (listadoAsignaturasDeEstudianteHoy.length == 0) {
                    _this.enviarOpcionesRegistrarAsistenciaNoAsignaturas(msg);
                }
                else if (listadoAsignaturasDeEstudianteHoy.length == 1) {
                    _this.enviarOpcionRegistrarAsistenciaUnaAsignatura(msg, listadoAsignaturasDeEstudianteHoy[0], fechaHoy);
                }
                else {
                    _this.enviarOpcionRegistrarAsistenciaMultiplesAsignaturas(msg, listadoAsignaturasDeEstudianteHoy, fechaHoy);
                }
            });
        };
        RegistrarAsistenciaReceiver.prototype.getAsignaturasAsistenciaHoy = function (msg) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var fechaHoy = new Date();
                Data.Asignacion.getAsignaturasInscritasPorEstudianteCachedInfoCompleta(_this.estadoGlobal, _this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo).then(function (listadoAsignaturasDeEstudiante) {
                    var asignatura;
                    var horario;
                    var listadoAsignaturasDeEstudianteHoy = new Array();
                    for (var i = 0; i < listadoAsignaturasDeEstudiante.length; i++) {
                        asignatura = listadoAsignaturasDeEstudiante[i];
                        for (var codigoHorario in asignatura.horarios) {
                            horario = asignatura.horarios[codigoHorario];
                            if (core_1.Constants.DiasSemana.get(fechaHoy.getDay()) == horario.dia &&
                                asignatura.estado == core_1.Constants.EstadoEstudianteAsignatura.Activa) {
                                listadoAsignaturasDeEstudianteHoy.push(asignatura);
                            }
                        }
                    }
                    resolve(listadoAsignaturasDeEstudianteHoy);
                });
            });
        };
        RegistrarAsistenciaReceiver.prototype.enviarOpcionesRegistrarAsistenciaNoAsignaturas = function (msg) {
            var _this = this;
            this.botSender
                .responderMensajeErrorHTML(msg, "No tienes asignaturas para registrar asistencia el d\u00EDa de <b>hoy</b>")
                .then(function () {
                _this.irAMenuPrincipal(msg);
            });
        };
        RegistrarAsistenciaReceiver.prototype.enviarOpcionRegistrarAsistenciaUnaAsignatura = function (msg, asignatura, fechaHoy) {
            if (!this.validarHorarioRegistroAsistencia(msg, asignatura)) {
                return;
            }
            this.estadoGlobal.infoUsuarioMensaje.estudiante.tempData =
                asignatura.codigo;
            this.enviarMensajeKeyboardMarkup(msg, "Hoy es <b>" + core_1.Constants.DiasSemana.get(fechaHoy.getDay()) + "</b>. Deseas reportar asistencia en la asignatura <b>" + asignatura.nombre + "\u2753 </b>", this.seleccionarAsignaturaInlineOpts, Comandos.SeleccionarComandoInlineOptsEnum.SeleccionarAsignaturaByDefault);
        };
        RegistrarAsistenciaReceiver.prototype.enviarOpcionRegistrarAsistenciaMultiplesAsignaturas = function (msg, listadoAsignaturasDeEstudianteHoy, fechaHoy) {
            this.enviarMensajeInlineKeyBoard(msg, Comandos.SeleccionarAsignaturaAsistenciaOPts.SeleccionarAsignatura, "Hoy es <b>" + core_1.Constants.DiasSemana.get(fechaHoy.getDay()) + "</b> y tienes " + listadoAsignaturasDeEstudianteHoy.length + " asignaturas para reportar asistencia.", this.seleccionarAsignaturaAsistenciaOPts);
        };
        RegistrarAsistenciaReceiver.prototype.enviarListaAsignaturasParaReportarAsistencia = function (msg) {
            var _this = this;
            this.getAsignaturasAsistenciaHoy(msg).then(function (listadoAsignaturasDeEstudianteHoy) {
                var opcionesListaAsignaturas = _this.getAsignaturasFormatoInlineQuery(listadoAsignaturasDeEstudianteHoy);
                _this.botSender.responderInLineQuery(msg, opcionesListaAsignaturas);
            });
        };
        return RegistrarAsistenciaReceiver;
    }(BotReceiver_1.BotReceiver));
    RegistrarAsistencia.RegistrarAsistenciaReceiver = RegistrarAsistenciaReceiver;
})(RegistrarAsistencia = exports.RegistrarAsistencia || (exports.RegistrarAsistencia = {}));
