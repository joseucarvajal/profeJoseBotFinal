"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../initBot");
var Data = require("../data");
var MenuPrincipalReceiver_1 = require("./menuPrincipal/MenuPrincipalReceiver");
var AccesoEstudianteReceiver_1 = require("./accesoEstudiante/AccesoEstudianteReceiver");
var EditarInformacionBasicaReceiver_1 = require("./EditarInformacionBasica/EditarInformacionBasicaReceiver");
var InscribirAsignaturaReceiver_1 = require("./InscribirAsignatura/InscribirAsignaturaReceiver");
var RegistrarAsistenciaReceiver_1 = require("./registrarAsistencia/RegistrarAsistenciaReceiver");
var SolicitudesDocenteReceiver_1 = require("./solicitudesDocente/SolicitudesDocenteReceiver");
var DocenteReceiver_1 = require("./docente/DocenteReceiver");
var index;
(function (index) {
    var MainReceiver = (function () {
        function MainReceiver(estadoGlobal) {
            this.estadoGlobal = estadoGlobal;
            this.accesoEstudianteReceiver = new AccesoEstudianteReceiver_1.AccesoEstudiante.AccesoEstudianteReceiver(this.estadoGlobal, this);
            this.menuPrincipalReceiver = new MenuPrincipalReceiver_1.MenuPrincipal.MenuPrincipalReceiver(this.estadoGlobal, this);
            this.editarInformacionBasicaReceiver = new EditarInformacionBasicaReceiver_1.EditarInformacionBasica.EditarInformacionBasicaReceiver(this.estadoGlobal, this);
            this.inscribirAsignaturaReceiver = new InscribirAsignaturaReceiver_1.InscribirAsignatura.InscribirAsignaturaReceiver(this.estadoGlobal, this);
            this.registrarAsistenciaReceiver = new RegistrarAsistenciaReceiver_1.RegistrarAsistencia.RegistrarAsistenciaReceiver(this.estadoGlobal, this);
            this.solicitudesDocenteReceiver = new SolicitudesDocenteReceiver_1.SolicitudesDocente.SolicitudesDocenteReceiver(this.estadoGlobal, this);
            this.docenteReceiver = new DocenteReceiver_1.Docente.DocenteReceiver(this.estadoGlobal, this);
            this.receiversList = [
                this.accesoEstudianteReceiver,
                this.menuPrincipalReceiver,
                this.editarInformacionBasicaReceiver,
                this.inscribirAsignaturaReceiver,
                this.registrarAsistenciaReceiver,
                this.solicitudesDocenteReceiver,
                this.docenteReceiver
            ];
            this.responderAMensaje = this.responderAMensaje.bind(this);
            this.responderAInlineQuery = this.responderAInlineQuery.bind(this);
            this.responderChosenInlineResult = this.responderChosenInlineResult.bind(this);
            this.responderCallbackQuery = this.responderCallbackQuery.bind(this);
            this.responderOnLocation = this.responderOnLocation.bind(this);
        }
        MainReceiver.prototype.responderAMensaje = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onRecibirMensajeBase(msg);
            }
        };
        MainReceiver.prototype.responderAInlineQuery = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onRecibirInlineQueryBase(msg);
            }
        };
        MainReceiver.prototype.responderChosenInlineResult = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onChosenInlineResultBase(msg);
            }
        };
        MainReceiver.prototype.responderCallbackQuery = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onCallbackQueryBase(msg);
            }
        };
        MainReceiver.prototype.responderOnLocation = function (msg) {
            for (var i = 0; i < this.receiversList.length; i++) {
                this.receiversList[i].onLocationBase(msg);
            }
        };
        return MainReceiver;
    }());
    initBot_1.bot.on("message", function (msg) {
        vincularData(msg, "message");
    });
    initBot_1.bot.on("inline_query", function (msg) {
        vincularData(msg, "inline_query");
    });
    initBot_1.bot.on("callback_query", function (msg) {
        vincularData(msg, "callback_query");
    });
    initBot_1.bot.on("chosen_inline_result", function (msg) {
        vincularData(msg, "chosen_inline_result");
    });
    initBot_1.bot.on("location", function (msg) {
        vincularData(msg, "location");
    });
    var vincularData = function (msg, cmd) {
        Data.Settings.getSettings().then(function (settings) {
            var estadoGlobal = {
                settings: settings
            };
            var mainReceiverFn;
            var mainReceiver = new MainReceiver(estadoGlobal);
            switch (cmd) {
                case "message":
                    estadoGlobal.idUsuarioChat = msg.chat.id.toString();
                    mainReceiverFn = mainReceiver.responderAMensaje;
                    break;
                case "inline_query":
                    estadoGlobal.idUsuarioChat = msg.from.id.toString();
                    mainReceiverFn = mainReceiver.responderAInlineQuery;
                    break;
                case "location":
                    estadoGlobal.idUsuarioChat = msg.chat.id.toString();
                    mainReceiverFn = mainReceiver.responderOnLocation;
                    break;
                case "callback_query":
                    estadoGlobal.idUsuarioChat = msg.from.id.toString();
                    mainReceiverFn = mainReceiver.responderCallbackQuery;
                    break;
                case "chosen_inline_result":
                    estadoGlobal.idUsuarioChat = msg.from.id.toString();
                    mainReceiverFn = mainReceiver.responderChosenInlineResult;
                    break;
            }
            Data.Estudiantes.getEstudianteByChatId(msg, estadoGlobal).then(function (estudiante) {
                if (estudiante == null) {
                    estudiante = {
                        comando: AccesoEstudianteReceiver_1.AccesoEstudiante.Comandos.SolicitarCodigo,
                        contexto: AccesoEstudianteReceiver_1.AccesoEstudiante.nombreContexto
                    };
                }
                estadoGlobal.infoUsuarioMensaje = {
                    estudiante: estudiante
                };
                mainReceiverFn(msg);
            });
        });
    };
})(index = exports.index || (exports.index = {}));
