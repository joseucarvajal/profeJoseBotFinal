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
var CalculoReporteAsistenciaAsignaturas_1 = require("./CalculoReporteAsistenciaAsignaturas");
var Docente;
(function (Docente) {
    var Comandos;
    (function (Comandos) {
        Comandos.MenuDocente = "MenuDocente";
        var MenuDocenteOpts;
        (function (MenuDocenteOpts) {
            MenuDocenteOpts["ReporteAsistencias"] = "\uD83D\uDCC6 Reporte asistencia asignatura";
        })(MenuDocenteOpts = Comandos.MenuDocenteOpts || (Comandos.MenuDocenteOpts = {}));
    })(Comandos = Docente.Comandos || (Docente.Comandos = {}));
    var nombreContexto = "DocenteReceiver";
    var DocenteReceiver = /** @class */ (function (_super) {
        __extends(DocenteReceiver, _super);
        function DocenteReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            _this.menuDocenteOpts = [
                [
                    {
                        text: Comandos.MenuDocenteOpts.ReporteAsistencias
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
                this.enviarReporteAsistenciaAsignatura(msg);
            }
        };
        DocenteReceiver.prototype.onCallbackQuery = function (msg) { };
        DocenteReceiver.prototype.onLocation = function (msg) { };
        DocenteReceiver.prototype.onRecibirInlineQuery = function (msg) { };
        //#endregion
        DocenteReceiver.prototype.enviarReporteAsistenciaAsignatura = function (msg) {
            var _this = this;
            this.calculoReporteAsistenciaAsignaturas
                .calcularReporteAsistenciaAsignaturas(msg, "dummy")
                .then(function (resultadoReporteAsistencia) {
                var htmlReporte = "\n          <table border=\"1\" cellspacing=\"0\" style=\"width: 100%; border:1px solid;position: relative;\">\n          <tr><th>C\u00F3digo</th><th>Nombre</th><th>Email</th><th>Asistencias</th><th>Fallas</th></tr>\n        ";
                var htmlRegistroEstudiante = "";
                var resultadoByEst;
                for (var codigoEstudiante in resultadoReporteAsistencia.listaResultadoAsistenciasIndxByEstCodigo) {
                    resultadoByEst =
                        resultadoReporteAsistencia
                            .listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante];
                    htmlRegistroEstudiante = "<tr><td>" + resultadoByEst.estudiante.codigo + "</td><td>" + resultadoByEst.estudiante.nombre + "</td><td>" + resultadoByEst.estudiante.email + "</td><td>" + resultadoByEst.countAsistencias + "</td><td>" + resultadoByEst.countFallas + "</td></tr>";
                    htmlReporte += htmlRegistroEstudiante;
                }
                htmlReporte += "</table>";
                var opcionesFormatoFecha = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                };
                _this.botSender.enviarHTMLComoDocumentoPDF(msg, "asistencia_" + resultadoReporteAsistencia.asignatura.nombre + ".pdf", htmlReporte, "Reporte asistencia \nasignatura: \"<b>" + resultadoReporteAsistencia.asignatura.nombre + "</b>\" \nFecha: <b>" + new Date().toLocaleDateString("es-ES") + "</b>");
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
