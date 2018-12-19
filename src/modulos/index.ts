import { bot } from "../initBot";
import * as Data from "../data";

import { Message } from "../bot/Message";

import {
  EstadoGlobal,
  Settings,
  Estudiante,
  InfoUsuarioMensaje,
  Asignatura,
  ListadoAsignaturas
} from "../core/models";

import { MenuPrincipal } from "./menuPrincipal/MenuPrincipalReceiver";
import { AccesoEstudiante } from "./accesoEstudiante/AccesoEstudianteReceiver";
import { MainReceiverContract } from "./indexContracts";
import { EditarInformacionBasica } from "./EditarInformacionBasica/EditarInformacionBasicaReceiver";
import { BotReceiver } from "./bot/BotReceiver";
import { InscribirAsignatura } from "./InscribirAsignatura/InscribirAsignaturaReceiver";
import { ApiMessage } from "../api/ApiMessage";
import { RegistrarAsistencia } from "./registrarAsistencia/RegistrarAsistenciaReceiver";
import { SolicitudesDocente } from "./solicitudesDocente/SolicitudesDocenteReceiver";
import { Docente } from "./docente/DocenteReceiver";

export namespace index {
  class MainReceiver implements MainReceiverContract {
    estadoGlobal: EstadoGlobal;

    accesoEstudianteReceiver: AccesoEstudiante.AccesoEstudianteReceiver;
    menuPrincipalReceiver: MenuPrincipal.MenuPrincipalReceiver;
    editarInformacionBasicaReceiver: EditarInformacionBasica.EditarInformacionBasicaReceiver;
    inscribirAsignaturaReceiver: InscribirAsignatura.InscribirAsignaturaReceiver;
    registrarAsistenciaReceiver: RegistrarAsistencia.RegistrarAsistenciaReceiver;
    solicitudesDocenteReceiver: SolicitudesDocente.SolicitudesDocenteReceiver;
    docenteReceiver: Docente.DocenteReceiver;

    receiversList: Array<BotReceiver>;

    constructor(estadoGlobal: EstadoGlobal) {
      this.estadoGlobal = estadoGlobal;

      this.accesoEstudianteReceiver = new AccesoEstudiante.AccesoEstudianteReceiver(
        this.estadoGlobal,
        this
      );

      this.menuPrincipalReceiver = new MenuPrincipal.MenuPrincipalReceiver(
        this.estadoGlobal,
        this
      );

      this.editarInformacionBasicaReceiver = new EditarInformacionBasica.EditarInformacionBasicaReceiver(
        this.estadoGlobal,
        this
      );

      this.inscribirAsignaturaReceiver = new InscribirAsignatura.InscribirAsignaturaReceiver(
        this.estadoGlobal,
        this
      );

      this.registrarAsistenciaReceiver = new RegistrarAsistencia.RegistrarAsistenciaReceiver(
        this.estadoGlobal,
        this
      );

      this.solicitudesDocenteReceiver = new SolicitudesDocente.SolicitudesDocenteReceiver(
        this.estadoGlobal,
        this
      );

      this.docenteReceiver = new Docente.DocenteReceiver(
        this.estadoGlobal,
        this
      );

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
      this.responderChosenInlineResult = this.responderChosenInlineResult.bind(
        this
      );
      this.responderCallbackQuery = this.responderCallbackQuery.bind(this);
      this.responderOnLocation = this.responderOnLocation.bind(this);
    }

    public responderAMensaje(msg: Message & ApiMessage) {
      for (let i = 0; i < this.receiversList.length; i++) {
        this.receiversList[i].onRecibirMensajeBase(msg);
      }
    }

    public responderAInlineQuery(msg: Message & ApiMessage) {
      for (let i = 0; i < this.receiversList.length; i++) {
        this.receiversList[i].onRecibirInlineQueryBase(msg);
      }
    }

    public responderChosenInlineResult(msg: Message & ApiMessage) {
      for (let i = 0; i < this.receiversList.length; i++) {
        this.receiversList[i].onChosenInlineResultBase(msg);
      }
    }

    public responderCallbackQuery(msg: Message & ApiMessage) {
      for (let i = 0; i < this.receiversList.length; i++) {
        this.receiversList[i].onCallbackQueryBase(msg);
      }
    }

    public responderOnLocation(msg: Message & ApiMessage) {
      for (let i = 0; i < this.receiversList.length; i++) {
        this.receiversList[i].onLocationBase(msg);
      }
    }
  }

  bot.on("message", (msg: Message & ApiMessage) => {
    vincularData(msg, "message");
  });

  bot.on("inline_query", (msg: ApiMessage & Message) => {
    vincularData(msg, "inline_query");
  });

  bot.on("callback_query", (msg: ApiMessage & Message) => {
    vincularData(msg, "callback_query");
  });

  bot.on("chosen_inline_result", (msg: ApiMessage & Message) => {
    vincularData(msg, "chosen_inline_result");
  });

  bot.on("location", (msg: ApiMessage & Message) => {
    vincularData(msg, "location");
  });

  let vincularData = (msg: Message & ApiMessage, cmd: string) => {
    Data.Settings.getSettings().then((settings: Settings) => {
      let estadoGlobal = {
        settings: settings
      } as EstadoGlobal;

      let mainReceiverFn: (msg: Message & ApiMessage) => void;
      let mainReceiver: MainReceiver = new MainReceiver(estadoGlobal);

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

      Data.Estudiantes.getEstudianteByChatId(msg, estadoGlobal).then(
        (estudiante: Estudiante) => {
          if (estudiante == null) {
            estudiante = {
              comando: AccesoEstudiante.Comandos.SolicitarCodigo,
              contexto: AccesoEstudiante.nombreContexto
            } as Estudiante;
          }

          estadoGlobal.infoUsuarioMensaje = {
            estudiante: estudiante
          } as InfoUsuarioMensaje;

          mainReceiverFn(msg);
        }
      );
    });
  };
}