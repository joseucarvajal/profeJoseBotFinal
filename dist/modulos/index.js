"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../initBot");
var Data = require("../data");
var MenuPrincipalReceiver_1 = require("./menuPrincipal/MenuPrincipalReceiver");
var AccesoEstudianteReceiver_1 = require("./accesoEstudiante/AccesoEstudianteReceiver");
var EditarInformacionBasicaReceiver_1 = require("./EditarInformacionBasica/EditarInformacionBasicaReceiver");
var InscribirAsignaturaReceiver_1 = require("./InscribirAsignatura/InscribirAsignaturaReceiver");
var index;
(function (index) {
    var Main = /** @class */ (function () {
        function Main(estadoGlobal) {
            this.estadoGlobal = estadoGlobal;
            this.accesoEstudianteReceiver = new AccesoEstudianteReceiver_1.AccesoEstudiante.AccesoEstudianteReceiver(this.estadoGlobal, this);
            this.menuPrincipalReceiver = new MenuPrincipalReceiver_1.MenuPrincipal.MenuPrincipalReceiver(this.estadoGlobal, this);
            this.editarInformacionBasicaReceiver = new EditarInformacionBasicaReceiver_1.EditarInformacionBasica.EditarInformacionBasicaReceiver(this.estadoGlobal, this);
            this.inscribirAsignaturaReceiver = new InscribirAsignaturaReceiver_1.InscribirAsignatura.InscribirAsignaturaReceiver(this.estadoGlobal, this);
            this.receiversList = [
                this.accesoEstudianteReceiver,
                this.menuPrincipalReceiver,
                this.editarInformacionBasicaReceiver,
                this.inscribirAsignaturaReceiver
            ];
            this.responderAMensaje = this.responderAMensaje.bind(this);
            this.responderAInlineQuery = this.responderAInlineQuery.bind(this);
            this.responderChosenInlineResult = this.responderChosenInlineResult.bind(this);
        }
        Main.prototype.responderAMensaje = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onRecibirMensajeBase(msg);
            }
        };
        Main.prototype.responderAInlineQuery = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onRecibirInlineQueryBase(msg);
            }
        };
        Main.prototype.responderChosenInlineResult = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onChosenInlineResultBase(msg);
            }
        };
        return Main;
    }());
    initBot_1.bot.on("message", function (msg) {
        vincularData(msg, "message");
    });
    initBot_1.bot.on("inline_query", function (msg) {
        vincularData(msg, "inline_query");
    });
    initBot_1.bot.on('chosen_inline_result', function (msg) {
        vincularData(msg, "chosen_inline_result");
    });
    var vincularData = function (msg, cmd) {
        Data.Settings.getSettings().then(function (settings) {
            var estadoGlobal = {
                settings: settings,
                celularDocente: "573137763601"
            };
            var mainFn;
            var main = new Main(estadoGlobal);
            switch (cmd) {
                case "message":
                    estadoGlobal.idUsuarioChat = msg.chat.id.toString();
                    mainFn = main.responderAMensaje;
                    break;
                case "inline_query":
                    estadoGlobal.idUsuarioChat = msg.from.id.toString();
                    mainFn = main.responderAInlineQuery;
                    break;
                case "chosen_inline_result":
                    estadoGlobal.idUsuarioChat = msg.from.id.toString();
                    mainFn = main.responderChosenInlineResult;
                    break;
            }
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
                mainFn(msg);
            });
        });
    };
})(index = exports.index || (exports.index = {}));
