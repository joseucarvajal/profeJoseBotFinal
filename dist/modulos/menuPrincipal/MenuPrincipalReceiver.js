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
            MenuPrincipalEstudianteOpts["InscribirAsignatura"] = "\uD83D\uDCDA Inscribir asignatura";
            MenuPrincipalEstudianteOpts["DesInscribirAsignatura"] = "\u274C Des-inscribir asignatura";
            MenuPrincipalEstudianteOpts["EditarInfoBasica"] = "\u270F\uFE0F Editar informaci\u00F3n b\u00E1sica";
        })(MenuPrincipalEstudianteOpts = Comandos.MenuPrincipalEstudianteOpts || (Comandos.MenuPrincipalEstudianteOpts = {}));
    })(Comandos = MenuPrincipal.Comandos || (MenuPrincipal.Comandos = {}));
    var nombreContexto = "MenuPrincipalEstudianteReceiver";
    var MenuPrincipalReceiver = /** @class */ (function (_super) {
        __extends(MenuPrincipalReceiver, _super);
        function MenuPrincipalReceiver(estadoGlobal, indexMain) {
            var _this = _super.call(this, estadoGlobal, indexMain, nombreContexto) || this;
            _this.nombreContexto = nombreContexto;
            _this.startKeyboardOpts = [
                [{ text: Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia }],
                [{ text: Comandos.MenuPrincipalEstudianteOpts.InscribirAsignatura }],
                //[{ text: Comandos.MenuPrincipalEstudianteOpts.DesInscribirAsignatura }],
                [{ text: Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica }]
            ];
            _this.responderMenuPrincipalEstudiante = _this.responderMenuPrincipalEstudiante.bind(_this);
            return _this;
        }
        MenuPrincipalReceiver.prototype.responderMenuPrincipalEstudiante = function (msg) {
            this.botSender.responderKeyboardMarkup(msg, "Selecciona una opci\u00F3n", this.startKeyboardOpts);
        };
        MenuPrincipalReceiver.prototype.onRecibirMensaje = function (msg) {
            var esOpcionMenuPpalEstudiante = false;
            for (var i = 0; i < this.startKeyboardOpts.length; i++) {
                if (this.startKeyboardOpts[i][0].text == msg.text) {
                    esOpcionMenuPpalEstudiante = true;
                    break;
                }
            }
            if (esOpcionMenuPpalEstudiante) {
                switch (msg.text) {
                    case Comandos.MenuPrincipalEstudianteOpts.EditarInfoBasica:
                        this.goToEditarInformacionBasica(msg);
                        break;
                    case Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia:
                        this.gotoRegistrarAsistencia(msg);
                        break;
                }
            }
        };
        MenuPrincipalReceiver.prototype.goToEditarInformacionBasica = function (msg) {
            this.enviarMensajeAReceiver(this.indexMain.registrarAsistenciaReceiver, this.indexMain.registrarAsistenciaReceiver
                .registrarAsistencia, msg, MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia);
        };
        MenuPrincipalReceiver.prototype.gotoRegistrarAsistencia = function (msg) {
            this.enviarMensajeAReceiver(this.indexMain.registrarAsistenciaReceiver, this.indexMain.registrarAsistenciaReceiver.registrarAsistencia, msg, MenuPrincipal.Comandos.MenuPrincipalEstudianteOpts.RegistrarAsistencia);
        };
        return MenuPrincipalReceiver;
    }(BotReceiver_1.BotReceiver));
    MenuPrincipal.MenuPrincipalReceiver = MenuPrincipalReceiver;
})(MenuPrincipal = exports.MenuPrincipal || (exports.MenuPrincipal = {}));
