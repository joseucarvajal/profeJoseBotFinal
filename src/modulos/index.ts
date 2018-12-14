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
import { IndexMain } from "./indexContracts";
import { EditarInformacionBasica } from "./EditarInformacionBasica/EditarInformacionBasicaReceiver";
import { BotReceiver } from "./bot/BotReceiver";
import { InscribirAsignatura } from "./InscribirAsignatura/InscribirAsignaturaReceiver";
import { ApiMessage } from "../api/ApiMessage";

export namespace index {
  class Main implements IndexMain {
    estadoGlobal: EstadoGlobal;

    accesoEstudianteReceiver: AccesoEstudiante.AccesoEstudianteReceiver;
    menuPrincipalReceiver: MenuPrincipal.MenuPrincipalReceiver;
    editarInformacionBasicaReceiver: EditarInformacionBasica.EditarInformacionBasicaReceiver;
    inscribirAsignaturaReceiver: InscribirAsignatura.InscribirAsignaturaReceiver;

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

    public responderAMensaje(msg: Message) {
      for (let i = 0; i < this.receiversList.length; i++) {
        this.receiversList[i].onRecibirMensajeBase(msg);
      }
    }

    public responderAInlineQuery(msg: ApiMessage){
      for (let i = 0; i < this.receiversList.length; i++) {
        this.receiversList[i].onRecibirInlineQueryBase(msg);
      }
    }

    public responderChosenInlineResult(msg: ApiMessage){
      for (let i = 0; i < this.receiversList.length; i++) {
        this.receiversList[i].onChosenInlineResultBase(msg);
      }
    }

  }

  bot.on("message", (msg: Message & ApiMessage) => {
    vincularData(msg, "message");
  });

  bot.on("inline_query", (msg: ApiMessage & Message) => {
    vincularData(msg, "inline_query");
  });

  bot.on('chosen_inline_result', (msg: ApiMessage & Message) => {
    vincularData(msg, "chosen_inline_result");
  });

  let vincularData = (msg: Message & ApiMessage, cmd: string) => {

    Data.Settings.getSettings().then((settings: Settings) => {
      let estadoGlobal = {
        settings: settings,
        celularDocente: "573137763601"
      } as EstadoGlobal;

      let mainFn:(msg: Message & ApiMessage)=>void;
      let main: Main = new Main(estadoGlobal);

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

      Data.Estudiantes.getEstudianteByChatId(msg, estadoGlobal).then(
        (estudiante: Estudiante) => {
          if (estudiante == null) {
            estudiante = {
              comando: AccesoEstudiante.Comandos.SolicitarCelular,
              contexto: AccesoEstudiante.nombreContexto
            } as Estudiante;
          }

          estadoGlobal.infoUsuarioMensaje = {
            estudiante: estudiante
          } as InfoUsuarioMensaje;

          mainFn(msg);
        }
      );
    });
  };
}
