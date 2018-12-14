"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data = require("../data");
var MenuPrincipalReceiver_1 = require("./menuPrincipal/MenuPrincipalReceiver");
var AccesoEstudianteReceiver_1 = require("./accesoEstudiante/AccesoEstudianteReceiver");
var index;
(function (index) {
    var Main = /** @class */ (function () {
        function Main(estadoGlobal) {
            this.estadoGlobal = estadoGlobal;
            this.accesoEstudianteReceiver = new AccesoEstudianteReceiver_1.AccesoEstudiante.AccesoEstudianteReceiver(this.estadoGlobal);
            this.menuPrincipalReceiver = new MenuPrincipalReceiver_1.MenuPrincipal.MenuPrincipalReceiver(this.estadoGlobal);
        }
        Main.prototype.escucharMensajesBot = function () {
            this.accesoEstudianteReceiver.escucharMensajesBot();
            this.menuPrincipalReceiver.escucharMensajesBot();
        };
        return Main;
    }());
    Data.Settings.getSettings().then(function (settings) {
        var estadoGlobal = {
            settings: settings
        };
        var main = new Main(estadoGlobal);
        main.escucharMensajesBot();
    });
})(index = exports.index || (exports.index = {}));
