import { Message } from "../bot/Message";
import { dataBase } from "../initDatabase";
import { Settings } from "./settings";

import { ChatModel, EstadoGlobal, InformacionContexto, Estudiante } from "../core/models";

export namespace Estudiantes {

  export const actualizarChat = (
    msg: Message,
    estadoGlobal: EstadoGlobal,
    estudiante: Estudiante
  ): Promise<any> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/estudiantes/" +
          msg.chat.id
      )
      .set(estudiante);
  };

  export const getEstudianteByChatId = (
      msg: Message, 
      estadoGlobal: EstadoGlobal
    ): Promise<Estudiante> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/estudiantes/" +
          msg.chat.id          
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Estudiantes/getEstudianteByChatId" + error);
      });
  };
}
