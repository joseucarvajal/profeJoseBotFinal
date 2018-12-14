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
(function (MenuPrincipal_1) {
    var Comandos;
    (function (Comandos) {
        Comandos.MenuPrincipal = "menuPrincipal";
        var MenuPrincipalOpts;
        (function (MenuPrincipalOpts) {
            MenuPrincipalOpts["RegistrarAsistencia"] = "\u23F1 Registrar asistencia";
            MenuPrincipalOpts["RegistrarAsignatura"] = "\uD83D\uDCDA Inscribir asignatura";
            MenuPrincipalOpts["DesInscribirAsignatura"] = "\u274C Des-inscribir asignatura";
            MenuPrincipalOpts["EditarInfoBasica"] = "\u270F\uFE0F Editar informaci\u00F3n b\u00E1sica";
        })(MenuPrincipalOpts = Comandos.MenuPrincipalOpts || (Comandos.MenuPrincipalOpts = {}));
    })(Comandos = MenuPrincipal_1.Comandos || (MenuPrincipal_1.Comandos = {}));
    var MenuPrincipalReceiver = /** @class */ (function (_super) {
        __extends(MenuPrincipalReceiver, _super);
        function MenuPrincipalReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain) || this;
            _this.nombreContexto = "MenuPrincipalReceiver";
            _this.startResponse = [
                [{ text: Comandos.MenuPrincipalOpts.RegistrarAsistencia }],
                [{ text: Comandos.MenuPrincipalOpts.RegistrarAsignatura }],
                [{ text: Comandos.MenuPrincipalOpts.DesInscribirAsignatura }],
                [{ text: Comandos.MenuPrincipalOpts.EditarInfoBasica }],
            ];
            _this.responderMenuPrincipal = _this.responderMenuPrincipal.bind(_this);
            return _this;
        }
        MenuPrincipalReceiver.prototype.responderMenuPrincipal = function (msg) {
            this.botSender.responderKeyboardMarkup(msg, "Selecciona una opci\u00F3n", this.startResponse);
        };
        MenuPrincipalReceiver.prototype.onRecibirMensaje = function (msg) {
            if (this.estaComandoEnContexto(Comandos.MenuPrincipalOpts.EditarInfoBasica)) {
            }
        };
        return MenuPrincipalReceiver;
    }(BotReceiver_1.BotReceiver));
    MenuPrincipal_1.MenuPrincipalReceiver = MenuPrincipalReceiver;
})(MenuPrincipal = exports.MenuPrincipal || (exports.MenuPrincipal = {}));
