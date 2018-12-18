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
          "/chats/" +
          estadoGlobal.idUsuarioChat
      )
      .set(estudiante);
  };

  export const getEstudianteXChatId = (
    msg: Message & ApiMessage,
    estadoGlobal: EstadoGlobal,
    chatId:string,
  ): Promise<Estudiante> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/chats/" +
          chatId
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Estudiantes/getEstudianteByChatId" + error);
      });
  };

  export const getEstudianteByChatId = (
    msg: Message & ApiMessage,
    estadoGlobal: EstadoGlobal
  ): Promise<Estudiante> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/chats/" +
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

  export const getEstudianteByCodigoAsignatura = (
    msg: Message & ApiMessage,
    estadoGlobal: EstadoGlobal,
    codigoEstudiante:string,
    codigoAsignatura:string
  ): Promise<Estudiante> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          estadoGlobal.settings.celularDocente +
          "/asignatura_estudiante/" +
          codigoAsignatura + "/" +
          codigoEstudiante
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Estudiantes/getEstudianteCodigoAsignatura" + error);
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
          "/chats/" +
          msg.chat.id
      )
      .remove();      
  };
}
