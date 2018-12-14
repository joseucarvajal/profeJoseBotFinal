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
            this.enviarMensajeHTML(msg, Comandos.IngresaTuCodigo, "Ingresa tu código");
        };
        EditarInformacionBasicaReceiver.prototype.onRecibirMensaje = function (msg) {
            if (this.estaComandoEnContexto(Comandos.IngresaTuCodigo)) {
                this.actualizarCodigo(msg);
            }
        };
        EditarInformacionBasicaReceiver.prototype.actualizarCodigo = function (msg) {
            var _this = this;
            var estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
            estudiante.codigo = msg.text;
            Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, estudiante).then(function () {
                _this.enviarMensajeHTML(msg, Comandos.VerificaTuCodigo, Comandos.VerificaTuCodigo);
            }, function () {
                console.error("AccesoEstudianteReceiver/onRecibirComandoStart");
            });
        };
        return EditarInformacionBasicaReceiver;
    }(BotReceiver_1.BotReceiver));
    EditarInformacionBasica.EditarInformacionBasicaReceiver = EditarInformacionBasicaReceiver;
})(EditarInformacionBasica = exports.EditarInformacionBasica || (exports.EditarInformacionBasica = {}));
