import { Message } from "../bot/Message";
import { dataBase } from "../initDatabase";

import {
  EstadoGlobal,
  Estudiante,
} from "../core/models";
import { ApiMessage } from "../api/ApiMessage";

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
    msg: Message & ApiMessage,
    estadoGlobal: EstadoGlobal
  ): Promise<Estudiante> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/estudiantes/" +
          estadoGlobal.idUsuarioChat
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Estudiantes/getEstudianteByChatId" + error);
      });
  };

  export const elminarChat = (
    msg: Message,
    estadoGlobal: EstadoGlobal,
  ): Promise<any> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/estudiantes/" +
          msg.chat.id
      )
      .remove();      
  };
}
