import { Message } from "../bot/Message";
import { dataBase } from "../initDatabase";

import {
  EstadoGlobal,
  Asignatura,
  ListadoAsignaturas,
  Estudiante
} from "../core/models";
import { ApiMessage } from "../api/ApiMessage";

export namespace Asignacion {
  export const getAsignaturasXPeriodoAndDocente = (
    msg: Message,
    estadoGlobal: EstadoGlobal,
    celularDocente: string
  ): Promise<ListadoAsignaturas> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          celularDocente +
          "/asignaturas/"
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
      });
  };

  export const registrarEstudianteAAsignatura = (
    msg: ApiMessage,
    estadoGlobal: EstadoGlobal,
    estudiante: Estudiante,
    codigoAsignatura: string
  ): Promise<any> => {
    return dataBase
      .ref(
        `periodosAcademicos/${estadoGlobal.settings.periodoActual}/asignacion/${
          estadoGlobal.celularDocente
        }/asignaturas/${codigoAsignatura}/estudiantes/${estadoGlobal.idUsuarioChat}`
      )
      .set({
        idUsuarioChat:estadoGlobal.idUsuarioChat
      });
  };

  export const registrarAsignaturaAEstudiante = (
    msg: ApiMessage,
    estadoGlobal: EstadoGlobal,
    estudiante: Estudiante,
    codigoAsignatura: string
  ): Promise<any> => {
    return dataBase
      .ref(
        `periodosAcademicos/${estadoGlobal.settings.periodoActual}/estudiantes/${
          estadoGlobal.idUsuarioChat
        }/asignaturas/${codigoAsignatura}`
      )
      .set({
        codigoAsignatura:codigoAsignatura
      });
  };
}