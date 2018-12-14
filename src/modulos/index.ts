import { bot } from "../initBot";
import * as Data from "../data";

import { Message } from "../bot/Message";

import {
  EstadoGlobal,
  Settings,
  Estudiante,
  InfoUsuarioMensaje
} from "../core/models";

import { MenuPrincipal } from "./menuPrincipal/MenuPrincipalReceiver";
import { AccesoEstudiante } from "./accesoEstudiante/AccesoEstudianteReceiver";
import { IndexMain } from "./indexContracts";
import { EditarInformacionBasica } from "./EditarInformacionBasica/EditarInformacionBasicaReceiver";
import { BotReceiver } from "./bot/BotReceiver";

export namespace index {
  class Main implements IndexMain {
    estadoGlobal: EstadoGlobal;

    accesoEstudianteReceiver: AccesoEstudiante.AccesoEstudianteReceiver;
    menuPrincipalReceiver: MenuPrincipal.MenuPrincipalReceiver;
    editarInformacionBasicaReceiver: EditarInformacionBasica.EditarInformacionBasicaReceiver;

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

      this.receiversList = [
        this.accesoEstudianteReceiver,
        this.menuPrincipalReceiver,
        this.editarInformacionBasicaReceiver
      ];
    }

    public responderAMensaje(msg:Message){
        for(let i=0; i<this.receiversList.length; i++){
            this.receiversList[i].onRecibirMensajeBase(msg);
        }
    }
  }

  bot.on("message", (msg: Message) => {

    //console.log("index msg: ", msg);

    Data.Settings.getSettings().then((settings: Settings) => {
      let estadoGlobal = {
        settings: settings
      } as EstadoGlobal;

      Data.Estudiantes.getEstudianteByChatId(msg, estadoGlobal).then(
        (estudiante: Estudiante) => {

          if(estudiante == null){
            estudiante = {
              comando : AccesoEstudiante.Comandos.SolicitarCelular,
              contexto : AccesoEstudiante.nombreContexto
            } as Estudiante;
          }

          estadoGlobal.infoUsuarioMensaje = {
            estudiante: estudiante
          } as InfoUsuarioMensaje;
          let main: Main = new Main(estadoGlobal);
          main.responderAMensaje(msg);
        }
      );
    });
  });
}
