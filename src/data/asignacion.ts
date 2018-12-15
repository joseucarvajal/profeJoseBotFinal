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
    estadoGlobal: EstadoGlobal
  ): Promise<ListadoAsignaturas> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          estadoGlobal.settings.celularDocente +
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
          estadoGlobal.settings.celularDocente
        }/asignaturas/${codigoAsignatura}/estudiantes/${
          estadoGlobal.idUsuarioChat
        }`
      )
      .set({
        idUsuarioChat: estadoGlobal.idUsuarioChat
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
        `periodosAcademicos/${
          estadoGlobal.settings.periodoActual
        }/estudiantes/${
          estadoGlobal.idUsuarioChat
        }/asignaturas/${codigoAsignatura}`
      )
      .set({
        codigoAsignatura: codigoAsignatura
      });
  };

  export const getAsignaturasByEstudianteCodigo = (
    estadoGlobal: EstadoGlobal,
    codigoEstudiante: string
  ): Promise<Array<Asignatura>> => {
    return new Promise<Array<Asignatura>>((resolve, reject) => {
      getAsignaturasXPeriodoAndDocente(estadoGlobal).then(
        (listadoAsignaturasXDocente: ListadoAsignaturas) => {
          let asignatura: Asignatura;
          let listaAsignaturas = Array<Asignatura>();
          for (let codigoAsignatura in listadoAsignaturasXDocente) {
            asignatura = listadoAsignaturasXDocente[codigoAsignatura];
            if (
              asignatura.estudiantesMatriculados &&
              asignatura.estudiantesMatriculados.indexOf(codigoEstudiante) != -1
            ) {
              listaAsignaturas.push(
                listadoAsignaturasXDocente[codigoAsignatura]
              );
            }
          }
          resolve(listaAsignaturas);
        }
      );
    });
  };
}
