"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BotSender_1 = require("./BotSender");
var Data = require("../../data");
var BotReceiver = /** @class */ (function () {
    function BotReceiver(estadoGlobal, indexMain, nombreContexto) {
        this.botSender = new BotSender_1.BotSender();
        this.estadoGlobal = estadoGlobal;
        this.indexMain = indexMain;
        this.informacionContexto = {
            contexto: nombreContexto
        };
    }
    BotReceiver.prototype.onRecibirMensajeBase = function (msg) {
        if (!msg.text && !msg.contact) {
            return;
        }
        this.onRecibirMensaje(msg);
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
    BotReceiver.prototype.estaComandoEnContexto = function (comando, contexto) {
        return (this.estaEnContextoActual(contexto) &&
            this.estadoGlobal.infoUsuarioMensaje.estudiante.comando == comando);
    };
    BotReceiver.prototype.enviarMensajeAReceiver = function (instanciaReceiver, fn, msg, comando) {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto =
            instanciaReceiver.nombreContexto;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
        Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
            fn(msg);
        });
    };
    BotReceiver.prototype.enviarMensajeHTML = function (msg, comando, html) {
        var _this = this;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
        Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
            return _this.botSender.responderMensajeHTML(msg, html);
        });
        return new Promise(function () { });
    };
    BotReceiver.prototype.enviarMensajeKeyboardMarkup = function (msg, label, opcionesKeyboard, comando) {
        var _this = this;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.contexto = this.nombreContexto;
        this.estadoGlobal.infoUsuarioMensaje.estudiante.comando = comando;
        Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, this.estadoGlobal.infoUsuarioMensaje.estudiante).then(function () {
            return _this.botSender.responderKeyboardMarkup(msg, label, opcionesKeyboard);
        });
        return new Promise(function () { });
    };
    return BotReceiver;
}());
exports.BotReceiver = BotReceiver;
