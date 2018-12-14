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
var MenuPrincipal;
(function (MenuPrincipal) {
    var Comandos;
    (function (Comandos) {
        Comandos.MenuPrincipalEstudiante = "menuPrincipalEstudiante";
        var MenuPrincipalEstudianteOpts;
        (function (MenuPrincipalEstudianteOpts) {
            MenuPrincipalEstudianteOpts["RegistrarAsistencia"] = "\u23F1 Registrar asistencia";
            MenuPrincipalEstudianteOpts["RegistrarAsignatura"] = "\uD83D\uDCDA Inscribir asignatura";
            MenuPrincipalEstudianteOpts["DesInscribirAsignatura"] = "\u274C Des-inscribir asignatura";
            MenuPrincipalEstudianteOpts["EditarInfoBasica"] = "\u270F\uFE0F Editar informaci\u00F3n b\u00E1sica";
        })(MenuPrincipalEstudianteOpts = Comandos.MenuPrincipalEstudianteOpts || (Comandos.MenuPrincipalEstudianteOpts = {}));
    })(Comandos = MenuPrincipal.Comandos || (MenuPrincipal.Comandos = {}));
    var nombreContexto = "MenuPrincipalReceiver";
    var MenuPrincipalReceiver = /** @class */ (function (_super) {
        __extends(MenuPrincipalReceiver, _super);
        function MenuPrincipalReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            _this.startResponse = [
                [{ text: Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia }],
                [{ text: Comandos.MenuPrincipalEstudianteOpts.RegistrarAsignatura }],
                [{ text: Comandos.MenuPrincipalEstudianteOpts.DesInscribirAsignatura }],
                [{ text: Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica }]
            ];
            _this.responderMenuPrincipalEstudiante = _this.responderMenuPrincipalEstudiante.bind(_this);
            return _this;
        }
        MenuPrincipalReceiver.prototype.responderMenuPrincipalEstudiante = function (msg) {
            this.botSender.responderKeyboardMarkup(msg, "Selecciona una opci\u00F3n", this.startResponse);
        };
        MenuPrincipalReceiver.prototype.onRecibirMensaje = function (msg) {
            if (this.estaComandoEnContexto(Comandos.MenuPrincipalEstudiante) &&
                msg.text == Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica) {
                this.enviarMensajeAReceiver(this.indexMain.editarInformacionBasicaReceiver, this.indexMain.editarInformacionBasicaReceiver
                    .responderEditarInformacionBasica, msg, MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica);
            }
        };
        return MenuPrincipalReceiver;
    }(BotReceiver_1.BotReceiver));
    MenuPrincipal.MenuPrincipalReceiver = MenuPrincipalReceiver;
})(MenuPrincipal = exports.MenuPrincipal || (exports.MenuPrincipal = {}));
