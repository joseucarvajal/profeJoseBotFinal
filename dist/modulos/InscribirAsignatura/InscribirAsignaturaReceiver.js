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
        Comandos.SeleccionarAsignatura = "SeleccionarAsignatura";
        var SeleccionarAsignaturaOptsEnum;
        (function (SeleccionarAsignaturaOptsEnum) {
            SeleccionarAsignaturaOptsEnum["SeleccionarAsignatura"] = "\u2714\uFE0FSeleccionar asignatura";
        })(SeleccionarAsignaturaOptsEnum = Comandos.SeleccionarAsignaturaOptsEnum || (Comandos.SeleccionarAsignaturaOptsEnum = {}));
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
            _this.mostrarOpcionSeleccionarAsignaturas = _this.mostrarOpcionSeleccionarAsignaturas.bind(_this);
            return _this;
        }
        InscribirAsignaturaReceiver.prototype.mostrarOpcionSeleccionarAsignaturas = function (msg) {
            var _this = this;
            this.actualizarContextoComando(msg, Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura).then(function () {
                _this.botSender.responderInlineKeyboard(msg, "Haz click en la opci\u00F3n <b>\"" + Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura + "\"</b> para seleccionar tus asignaturas", _this.seleccionarAsignaturaInlineOpts);
            });
        };
        InscribirAsignaturaReceiver.prototype.onRecibirMensaje = function (msg) { };
        InscribirAsignaturaReceiver.prototype.onRecibirInlineQuery = function (msg) {
            if (!this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura)) {
                return;
            }
            this.enviarListadoAsignaturas(msg);
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
            if (!this.estaComandoEnContexto(Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura)) {
                return;
            }
            this.registrarAsignaturaAEstudiante(msg);
        };
        InscribirAsignaturaReceiver.prototype.registrarAsignaturaAEstudiante = function (msg) {
        };
        return InscribirAsignaturaReceiver;
    }(BotReceiver_1.BotReceiver));
    InscribirAsignatura.InscribirAsignaturaReceiver = InscribirAsignaturaReceiver;
})(InscribirAsignatura = exports.InscribirAsignatura || (exports.InscribirAsignatura = {}));
