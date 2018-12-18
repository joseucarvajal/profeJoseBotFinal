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
var EditarInformacionBasica;
(function (EditarInformacionBasica) {
    var Comandos;
    (function (Comandos) {
        Comandos.IngresaTuCodigo = "Ingresa tu c\u00F3digo";
        Comandos.VerificaTuCodigo = "Verifica tu c\u00F3digo";
        Comandos.IngresaTuNombreCompleto = "Ingresa tu nombre completo";
        Comandos.IngresaTuEmail = "Ingresa tu email";
    })(Comandos = EditarInformacionBasica.Comandos || (EditarInformacionBasica.Comandos = {}));
    var nombreContexto = "EditarInformacionBasicaReceiver";
    var EditarInformacionBasicaReceiver = /** @class */ (function (_super) {
        __extends(EditarInformacionBasicaReceiver, _super);
        function EditarInformacionBasicaReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            _this.responderEditarInformacionBasica = _this.responderEditarInformacionBasica.bind(_this);
            return _this;
        }
        EditarInformacionBasicaReceiver.prototype.responderEditarInformacionBasica = function (msg) {
            if (!this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo) {
                this.solicitarCodigo(msg);
                return;
            }
            this.solicitarNombreCompleto(msg);
        };
        EditarInformacionBasicaReceiver.prototype.solicitarCodigo = function (msg) {
            this.enviarMensajeHTML(msg, Comandos.IngresaTuCodigo, "Ingresa tu código");
        };
        EditarInformacionBasicaReceiver.prototype.onRecibirMensaje = function (msg) {
            if (this.estaComandoEnContexto(Comandos.IngresaTuCodigo)) {
                this.actualizarCodigo(msg);
            }
            else if (this.estaComandoEnContexto(Comandos.VerificaTuCodigo)) {
                this.verificarCodigo(msg);
            }
            else if (this.estaComandoEnContexto(Comandos.IngresaTuNombreCompleto)) {
                this.actualizarNombre(msg);
            }
            else if (this.estaComandoEnContexto(Comandos.IngresaTuEmail)) {
                this.actualizarEmail(msg);
            }
        };
        EditarInformacionBasicaReceiver.prototype.actualizarCodigo = function (msg) {
            var _this = this;
            var estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
            estudiante.codigo = msg.text;
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, estudiante).then(function () {
                _this.solicitarVerificarCodigo(msg);
            }, function () {
                console.error("EditarInformacionBasicaReceiver/actualizarCodigo");
            });
        };
        EditarInformacionBasicaReceiver.prototype.solicitarVerificarCodigo = function (msg) {
            this.enviarMensajeHTML(msg, Comandos.VerificaTuCodigo, Comandos.VerificaTuCodigo);
        };
        EditarInformacionBasicaReceiver.prototype.verificarCodigo = function (msg) {
            var _this = this;
            if (this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo != msg.text) {
                this.botSender
                    .responderMensajeErrorHTML(msg, "Tu c\u00F3digo no coincide")
                    .then(function () {
                    _this.solicitarCodigo(msg);
                });
                return;
            }
            this.solicitarNombreCompleto(msg);
        };
        EditarInformacionBasicaReceiver.prototype.solicitarNombreCompleto = function (msg) {
            this.enviarMensajeHTML(msg, Comandos.IngresaTuNombreCompleto, Comandos.IngresaTuNombreCompleto);
        };
        EditarInformacionBasicaReceiver.prototype.actualizarNombre = function (msg) {
            var _this = this;
            var estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
            estudiante.nombre = msg.text;
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, estudiante).then(function () {
                _this.solicitarEmail(msg);
            }, function () {
                console.error("EditarInformacionBasicaReceiver/actualizarCodigo");
            });
        };
        EditarInformacionBasicaReceiver.prototype.solicitarEmail = function (msg) {
            this.enviarMensajeHTML(msg, Comandos.IngresaTuEmail, "\u2709\uFE0F " + Comandos.IngresaTuEmail);
        };
        EditarInformacionBasicaReceiver.prototype.actualizarEmail = function (msg) {
            var _this = this;
            var estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
            estudiante.email = msg.text;
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, estudiante).then(function () {
                _this.enviarMensajeDatosActualizadosConExito(msg).then(function () {
                    _this.irAMenuPrincipal(msg);
                });
            }, function () {
                console.error("EditarInformacionBasicaReceiver/actualizarCodigo");
            });
        };
        EditarInformacionBasicaReceiver.prototype.enviarMensajeDatosActualizadosConExito = function (msg) {
            return this.botSender.responderMensajeHTML(msg, "\u2705 Has actualizado tus datos con \u00E9xito");
        };
        return EditarInformacionBasicaReceiver;
    }(BotReceiver_1.BotReceiver));
    EditarInformacionBasica.EditarInformacionBasicaReceiver = EditarInformacionBasicaReceiver;
})(EditarInformacionBasica = exports.EditarInformacionBasica || (exports.EditarInformacionBasica = {}));
