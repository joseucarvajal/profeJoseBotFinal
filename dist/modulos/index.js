"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../initBot");
var Data = require("../data");
var MenuPrincipalReceiver_1 = require("./menuPrincipal/MenuPrincipalReceiver");
var AccesoEstudianteReceiver_1 = require("./accesoEstudiante/AccesoEstudianteReceiver");
var EditarInformacionBasicaReceiver_1 = require("./EditarInformacionBasica/EditarInformacionBasicaReceiver");
var index;
(function (index) {
    var Main = /** @class */ (function () {
        function Main(estadoGlobal) {
            this.estadoGlobal = estadoGlobal;
            this.accesoEstudianteReceiver = new AccesoEstudianteReceiver_1.AccesoEstudiante.AccesoEstudianteReceiver(this.estadoGlobal, this);
            this.menuPrincipalReceiver = new MenuPrincipalReceiver_1.MenuPrincipal.MenuPrincipalReceiver(this.estadoGlobal, this);
            this.editarInformacionBasicaReceiver = new EditarInformacionBasicaReceiver_1.EditarInformacionBasica.EditarInformacionBasicaReceiver(this.estadoGlobal, this);
            this.receiversList = [
                this.accesoEstudianteReceiver,
                this.menuPrincipalReceiver,
                this.editarInformacionBasicaReceiver
            ];
        }
        Main.prototype.responderAMensaje = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onRecibirMensajeBase(msg);
            }
        };
        return Main;
    }());
    initBot_1.bot.on("message", function (msg) {
        //console.log("index msg: ", msg);
        Data.Settings.getSettings().then(function (settings) {
            var estadoGlobal = {
                settings: settings
            };
            Data.Estudiantes.getEstudianteByChatId(msg, estadoGlobal).then(function (estudiante) {
                if (estudiante == null) {
                    estudiante = {
                        comando: AccesoEstudianteReceiver_1.AccesoEstudiante.Comandos.SolicitarCelular,
                        contexto: AccesoEstudianteReceiver_1.AccesoEstudiante.nombreContexto
                    };
                }
                estadoGlobal.infoUsuarioMensaje = {
                    estudiante: estudiante
                };
                var main = new Main(estadoGlobal);
                main.responderAMensaje(msg);
            });
        });
    });
})(index = exports.index || (exports.index = {}));
