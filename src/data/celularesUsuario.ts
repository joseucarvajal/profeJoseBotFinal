import { Message } from "../bot/Message";
import { dataBase } from "../initDatabase";

import { EstadoGlobal, Estudiante, CelularUsuario } from "../core/models";

export namespace CelularesUsuario {
  export const getCelularUsuario = (
    msg: Message,
    estadoGlobal: EstadoGlobal
  ): Promise<CelularUsuario> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/celularesUsuario/" +
          msg.contact.phone_number
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Estudiantes/getEstudianteByChatId" + error);
      });
  };

  export const actualizarCelularUsuario = (
    msg: Message,
    estadoGlobal: EstadoGlobal,
    nroCelular: string,
    celularUsuario: CelularUsuario
  ): Promise<any> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/celularesUsuario/" +
          nroCelular
      )
      .set(celularUsuario);
  };
}
