"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BotSender_1 = require("./BotSender");
var Data = require("../../data");
var MenuPrincipalReceiver_1 = require("../menuPrincipal/MenuPrincipalReceiver");
var BotReceiver = (function () {
    function BotReceiver(estadoGlobal, indexMain, nombreContexto) {
        this.botSender = new BotSender_1.BotSender();
        this.estadoGlobal = estadoGlobal;
        this.indexMain = indexMain;
        this.informacionContexto = {
            contexto: nombreContexto
        };
        this.message = {};
        this.apiMessage = {};
    }
    BotReceiver.prototype.onRecibirMensajeBase = function (msg) {
        var _this = this;
        this.botSender.enviarActionTyping(msg).then(function () {
            if (!msg.text && !msg.contact) {
                return;
            }
            _this.initializeMessage(msg);
            _this.onRecibirMensaje(msg);
        });
    };
    BotReceiver.prototype.onRecibirInlineQueryBase = function (msg) {
        var _this = this;
        this.botSender.enviarActionTyping(msg).then(function () {
            _this.initializeMessage(msg);
            _this.onRecibirInlineQuery(msg);
        });
    };
    BotReceiver.prototype.onRecibirInlineQuery = function (msg) { };
    BotReceiver.prototype.onChosenInlineResultBase = function (msg) {
        var _this = this;
        this.botSender.enviarActionTyping(msg).then(function () {
            _this.initializeMessage(msg);
            _this.onChosenInlineResult(msg);
        });
    };
    BotReceiver.prototype.onChosenInlineResult = function (msg) { };
    BotReceiver.prototype.onCallbackQueryBase = function (msg) {
        var _this = this;
        this.botSender.enviarActionTyping(msg).then(function () {
            _this.initializeMessage(msg);
            _this.onCallbackQuery(msg);
        });
    };
    BotReceiver.prototype.onCallbackQuery = function (msg) { };
    BotReceiver.prototype.onLocationBase = function (msg) {
        var _this = this;
        this.botSender.enviarActionTyping(msg).then(function () {
            _this.initializeMessage(msg);
            _this.onLocation(msg);
        });
    };
    BotReceiver.prototype.onLocation = function (msg) { };
    BotReceiver.prototype.validarQueEstudianteHayaIngresadoDatosBasicos = function (msg) {
        var _this = this;
        if (!this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo ||
            !this.estadoGlobal.infoUsuarioMensaje.estudiante.nombre ||
            !this.estadoGlobal.infoUsuarioMensaje.estudiante.email) {
            this.botSender
                .responderMensajeErrorHTML(msg, "No se puede responder la solicitud, primero debes <b>Actualizar tus datos b\u00E1sicos</b>")
                .then(function () {
                _this.irAMenuPrincipal(msg);
            });
            return false;
        }
        return true;
    };
    BotReceiver.prototype.irAMenuPrincipal = function (msg) {
        this.enviarMensajeAReceiver(this.indexMain.menuPrincipalReceiver, this.indexMain.menuPrincipalReceiver.responderMenuPrincipalEstudiante, msg, MenuPrincipalReceiver_1.MenuPrincipal.Comandos.MenuPrincipalEstudiante);
    };
    BotReceiver.prototype.initializeMessage = function (msg) {
        if (msg.chat) {
            this.message = msg;
            return;
        }
        this.apiMessage = msg;
    };
    BotReceiver.prototype.estaEnContextoActual = function (contexto) {
        if (!this.estadoGlobal.infoUsuarioMensaje.estudiante) {
            return false;
        }
        if (contexto) {
            return (contexto == this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto);
        }
        return (this.nombreContexto ==
            this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto);
    };
    BotReceiver.prototype.estaOpcionSeleccionadaEnContexto = function (opcionSeleccionada, msg) {
        return this.estaEnContextoActual() && msg.text == opcionSeleccionada;
    };
    BotReceiver.prototype.estaComandoEnContexto = function (comando, contexto) {
        return (this.estaEnContextoActual(contexto) &&
            this.estadoGlobal.infoUsuarioMensaje.estudiante.comando === comando);
    };
    BotReceiver.prototype.enviarMensajeAReceiver = function (instanciaReceiver, fn, msg, comandoARegistrarEstudiante) {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto =
            instanciaReceiver.nombreContexto;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comandoARegistrarEstudiante;
        Data.Estudiantes.actualizarContextoChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto, this.estadoGlobal.infoUsuarioMensaje.estudiante.comando).then(function () {
            fn(msg);
        });
    };
    BotReceiver.prototype.enviarMensajeHTML = function (msg, comando, html) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = _this.nombreContexto;
            _this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
            Data.Estudiantes.actualizarContextoChat(msg, _this.estadoGlobal, _this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto, _this.estadoGlobal.infoUsuarioMensaje.estudiante.comando).then(function () {
                _this.botSender.responderMensajeHTML(msg, html).then(function () {
                    resolve();
                });
            });
        });
    };
    BotReceiver.prototype.enviarMensajeInlineKeyBoard = function (msg, comandoAActualizar, label, opcionesInlineKeyboard) {
        var _this = this;
        this.actualizarContextoComando(msg, comandoAActualizar).then(function () {
            _this.botSender.responderInlineKeyboard(msg, label, opcionesInlineKeyboard);
        });
    };
    BotReceiver.prototype.actualizarContextoComando = function (msg, comando) {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
        return Data.Estudiantes.actualizarContextoChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto, this.estadoGlobal.infoUsuarioMensaje.estudiante.comando);
    };
    BotReceiver.prototype.goToAndGuardarContextoComando = function (instanciaReceiver, fn, msg, comando) {
        var _this = this;
        this.actualizarContextoComando(msg, comando).then(function () {
            _this.enviarMensajeAReceiver(instanciaReceiver, fn, msg, comando);
        });
    };
    BotReceiver.prototype.enviarMensajeKeyboardMarkup = function (msg, label, opcionesKeyboard, comando) {
        var _this = this;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
        Data.Estudiantes.actualizarContextoChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto, this.estadoGlobal.infoUsuarioMensaje.estudiante.comando).then(function () {
            return _this.botSender.responderKeyboardMarkup(msg, label, opcionesKeyboard);
        });
        return new Promise(function () { });
    };
    BotReceiver.prototype.seHaSeleccionadoOpcionDeMenu = function (msg, opcion) {
        return this.estaEnContextoActual() && msg.text == opcion;
    };
    BotReceiver.prototype.enviarMensajeErrorHTMLAProfesor = function (message) {
        var msg = {
            chat: {
                id: this.estadoGlobal.settings.idUsuarioChatDocente
            }
        };
        this.botSender.responderMensajeErrorHTML(msg, message);
    };
    BotReceiver.prototype.enviarMensajeHTMLAProfesor = function (message) {
        var msg = {
            chat: {
                id: this.estadoGlobal.settings.idUsuarioChatDocente
            }
        };
        this.botSender.responderMensajeHTML(msg, message);
    };
    BotReceiver.prototype.getMesssage = function () {
        if (this.message) {
            return this.message;
        }
        return this.apiMessage;
    };
    BotReceiver.prototype.getAsignaturasFormatoInlineQuery = function (listadoAsignaturas) {
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
                mensajeHorarios +=
                    horario.dia + ", " + horario.horaInicio + " a " + horario.horaFin;
                horarioCounter++;
            }
            opcionesListaAsignaturas.push({
                id: asignatura.codigo,
                type: "article",
                title: asignatura.nombre + ", grupo " + asignatura.grupo,
                description: "" + mensajeHorarios,
                input_message_content: {
                    message_text: asignatura.nombre + " (" + asignatura.codigo + "), grupo " + asignatura.grupo
                }
            });
        }
        return opcionesListaAsignaturas;
    };
    return BotReceiver;
}());
exports.BotReceiver = BotReceiver;
