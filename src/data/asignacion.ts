import { Message } from "../bot/Message";
import { dataBase } from "../initDatabase";

import {
  EstadoGlobal,
  Asignatura,
  ListadoAsignaturas,
  Estudiante,
  Asistencia,
  AsignaturasDeEstudiante,
  AsignaturaEstudiantes,
  AsignaturaAsignadaAEstudiante,
  ListadoEstudiantes,
  ListadoAsistenciaAsignatura,
  ListadoAsistenciaFecha,
  HorarioAsignatura
} from "../core/models";
import { ApiMessage } from "../api/ApiMessage";
import { Constants } from "../core";
import { Utils } from "../utils/Utils";

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

  export const getAsignaturasXPeriodoAndDocenteAsArray = (
    estadoGlobal: EstadoGlobal
  ): Promise<Array<Asignatura>> => {
    return new Promise<Array<Asignatura>>((resolve, reject) => {
      getAsignaturasXPeriodoAndDocente(estadoGlobal).then(
        (listadoAsignaturas: ListadoAsignaturas) => {
          let listadoAsignaturasArray = new Array<Asignatura>();
          for (let codigoAsignatura in listadoAsignaturas) {
            listadoAsignaturasArray.push(listadoAsignaturas[codigoAsignatura]);
          }
          resolve(listadoAsignaturasArray);
        }
      );
    });
  };

  export const getTodosHorariosYAsignaturasDocente = (
    estadoGlobal: EstadoGlobal
  ): Promise<Array<HorarioAsignatura>> => {
    return new Promise<Array<HorarioAsignatura>>((resolve, reject) => {
      getAsignaturasXPeriodoAndDocente(estadoGlobal).then(
        (listadoAsignaturas: ListadoAsignaturas) => {
          let listaHorarioAsignatura = new Array<HorarioAsignatura>();
          let asignatura: Asignatura;
          for (let codigoAsignatura in listadoAsignaturas) {
            asignatura = listadoAsignaturas[codigoAsignatura];
            for (let codigoHorario in asignatura.horarios) {
              asignatura.horarios[codigoHorario].id = codigoAsignatura+'#|@'+codigoHorario;
              listaHorarioAsignatura.push({
                asignatura: asignatura,
                horario: asignatura.horarios[codigoHorario]
              } as HorarioAsignatura);
            }
          }
          resolve(listaHorarioAsignatura);
        }
      );
    });
  };

  export const asociarEstudianteAAsignatura = (
    estadoGlobal: EstadoGlobal,
    estudiante: Estudiante,
    codigoAsignatura: string
  ): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      registrarAsignaturaEstudiante(
        estadoGlobal,
        estudiante,
        codigoAsignatura
      ).then(() => {
        registrarEstudianteAsignatura(
          estadoGlobal,
          estudiante,
          codigoAsignatura
        ).then(() => {
          resolve();
        });
      });
    });
  };

  export const registrarAsignaturaEstudiante = (
    estadoGlobal: EstadoGlobal,
    estudiante: Estudiante,
    codigoAsignatura: string
  ): Promise<any> => {
    return dataBase
      .ref(
        `periodosAcademicos/${estadoGlobal.settings.periodoActual}/asignacion/${
          estadoGlobal.settings.celularDocente
        }/asignatura_estudiante/${codigoAsignatura}/${estudiante.codigo}`
      )
      .set({
        codigo: estudiante.codigo,
        nombre: estudiante.nombre,
        email: estudiante.email
      } as Estudiante);
  };

  export const registrarEstudianteAsignatura = (
    estadoGlobal: EstadoGlobal,
    estudiante: Estudiante,
    codigoAsignatura: string
  ): Promise<any> => {
    return dataBase
      .ref(
        `periodosAcademicos/${estadoGlobal.settings.periodoActual}/asignacion/${
          estadoGlobal.settings.celularDocente
        }/estudiante_asignatura/${estudiante.codigo}/${codigoAsignatura}`
      )
      .set({
        codigo: codigoAsignatura,
        estado: Constants.EstadoEstudianteAsignatura.Activa
      } as AsignaturaAsignadaAEstudiante);
  };

  export const registrarAsignaturasAEstudiante = (
    msg: ApiMessage,
    estadoGlobal: EstadoGlobal,
    listaAsignaturas: Array<Asignatura>
  ): Promise<any> => {
    let asignaturasEstudiante: any = {};
    asignaturasEstudiante.asignaturas = {};

    let estudianteAsignaturas = {
      [estadoGlobal.infoUsuarioMensaje.estudiante.codigo]:
        asignaturasEstudiante.asignaturas
    };

    for (let i = 0; i < listaAsignaturas.length; i++) {
      asignaturasEstudiante.asignaturas[listaAsignaturas[i].codigo] = {
        codigo: listaAsignaturas[i].codigo,
        estado: Constants.EstadoEstudianteAsignatura.Activa
      } as AsignaturaAsignadaAEstudiante;
    }

    return dataBase
      .ref(
        `periodosAcademicos/${estadoGlobal.settings.periodoActual}/asignacion/${
          estadoGlobal.settings.celularDocente
        }/estudiante_asignatura/`
      )
      .set(estudianteAsignaturas);
  };

  export const getTodasAsignaturasYSusEstudiantes = (
    estadoGlobal: EstadoGlobal
  ): Promise<AsignaturaEstudiantes> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          estadoGlobal.settings.celularDocente +
          "/asignatura_estudiante/"
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
      });
  };

  export const getEstudiantesInscritosEnAsignatura = (
    estadoGlobal: EstadoGlobal,
    codigoAsignatura: string
  ): Promise<ListadoEstudiantes> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          estadoGlobal.settings.celularDocente +
          "/asignatura_estudiante/" +
          codigoAsignatura
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
      });
  };

  export const getAsignaturasByEstudianteCodigo = (
    estadoGlobal: EstadoGlobal,
    codigoEstudiante: string
  ): Promise<AsignaturasDeEstudiante> => {
    return new Promise<AsignaturasDeEstudiante>((resolve, reject) => {
      getAsignaturasXPeriodoAndDocente(estadoGlobal).then(
        (listadoAsignaturas: ListadoAsignaturas) => {
          getTodasAsignaturasYSusEstudiantes(estadoGlobal).then(
            (listadoAsignaturaEstudiantes: AsignaturaEstudiantes) => {
              let estudianteAsignaturas: AsignaturasDeEstudiante = {
                listaAsignaturas: new Array<Asignatura>(),
                estudiante: {} as Estudiante
              } as AsignaturasDeEstudiante;

              let estudiante: Estudiante;
              for (let codigoAsignatura in listadoAsignaturaEstudiantes) {
                if (!listadoAsignaturas[codigoAsignatura]) {
                  estudianteAsignaturas.result = false; //error
                  estudianteAsignaturas.message = `La asignatura ${codigoAsignatura} no se encuentra en el nodo <b>asignaturas</b> del docente`;
                  resolve(estudianteAsignaturas);
                  return;
                }

                for (let codigoEstudianteFor in listadoAsignaturaEstudiantes[
                  codigoAsignatura
                ]) {
                  estudiante =
                    listadoAsignaturaEstudiantes[codigoAsignatura][
                      codigoEstudianteFor
                    ];

                  if (estudiante.codigo == codigoEstudiante) {
                    estudianteAsignaturas.listaAsignaturas.push(
                      listadoAsignaturas[codigoAsignatura]
                    );
                    estudianteAsignaturas.estudiante = estudiante;
                  }
                }
              }

              estudianteAsignaturas.result = true;
              resolve(estudianteAsignaturas);
            }
          );
        }
      );
    });
  };

  const getAsignaturasInscritasPorEstudiante = (
    estadoGlobal: EstadoGlobal
  ): Promise<ListadoAsignaturas> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          estadoGlobal.settings.celularDocente +
          "/estudiante_asignatura/" +
          estadoGlobal.infoUsuarioMensaje.estudiante.codigo
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
      });
  };

  export const getAsignaturasInscritasPorEstudianteCachedInfoCompleta = (
    estadoGlobal: EstadoGlobal,
    codigoEstudiante: string
  ): Promise<Array<Asignatura>> => {
    return new Promise<Array<Asignatura>>((resolve, reject) => {
      getAsignaturasXPeriodoAndDocente(estadoGlobal).then(
        (listadoTodasAsignaturas: ListadoAsignaturas) => {
          getAsignaturasInscritasPorEstudiante(estadoGlobal).then(
            (listadoEstudianteAsignatura: ListadoAsignaturas) => {
              let listaAsignaturasDeEstudiante = new Array<Asignatura>();

              let asignatura: Asignatura;
              for (let codigoAsignatura in listadoEstudianteAsignatura) {
                asignatura = listadoTodasAsignaturas[codigoAsignatura];
                asignatura.estado =
                  listadoEstudianteAsignatura[codigoAsignatura].estado;
                listaAsignaturasDeEstudiante.push(asignatura);
              }

              resolve(listaAsignaturasDeEstudiante);
            }
          );
        }
      );
    });
  };

  export const getAsignaturasQueNoTieneEstudiante = (
    estadoGlobal: EstadoGlobal,
    codigoEstudiante: string
  ): Promise<Array<Asignatura>> => {
    return new Promise<Array<Asignatura>>((resolve, reject) => {
      getAsignaturasInscritasPorEstudiante(estadoGlobal).then(
        (listadoAsignaturasEstudiante: ListadoAsignaturas) => {
          getAsignaturasXPeriodoAndDocente(estadoGlobal).then(
            (listadoAsignaturas: ListadoAsignaturas) => {
              let asignaturasQueNoTieneEstudiante = new Array<Asignatura>();

              for (let codigoAsignatura in listadoAsignaturas) {
                if (
                  !listadoAsignaturasEstudiante ||
                  !listadoAsignaturasEstudiante[codigoAsignatura]
                ) {
                  asignaturasQueNoTieneEstudiante.push(
                    listadoAsignaturas[codigoAsignatura]
                  );
                }
              }
              resolve(asignaturasQueNoTieneEstudiante);
            }
          );
        }
      );
    });
  };

  export const registrarAsistencia = (
    msg: Message,
    estadoGlobal: EstadoGlobal,
    codigoAsignatura: string
  ): Promise<any> => {
    let registroAsistencia = {
      latitud: msg.location.latitude,
      longitud: msg.location.longitude,
      fechaHora: msg.date
    } as Asistencia;

    let fechaAsistencia = new Date(Utils.getRealDate(msg.date));
    fechaAsistencia.setHours(0, 0, 0, 0);

    return dataBase
      .ref(
        `periodosAcademicos/${estadoGlobal.settings.periodoActual}/asignacion/${
          estadoGlobal.settings.celularDocente
        }/asistencias_asignatura/${codigoAsignatura}/${fechaAsistencia.getTime()}/${
          estadoGlobal.infoUsuarioMensaje.estudiante.codigo
        }/`
      )
      .set(registroAsistencia);
  };

  export const getAsignaturaByCodigo = (
    estadoGlobal: EstadoGlobal,
    codigoAsignatura: string
  ): Promise<Asignatura> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          estadoGlobal.settings.celularDocente +
          "/asignaturas/" +
          codigoAsignatura
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("Asignaturas/getAsignaturasXPeriodoAndDocente" + error);
      });
  };

  export const getListadoAsistenciaByAsignatura = (
    estadoGlobal: EstadoGlobal,
    asignatura: Asignatura
  ): Promise<ListadoAsistenciaFecha> => {
    return dataBase
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          estadoGlobal.settings.celularDocente +
          "/asistencias_asignatura/" +
          asignatura.codigo
      )
      .once("value")
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .catch((error: any) => {
        console.log("asignacion/getListadoAsistenciaByAsignatura" + error);
      });
  };

  export const actualizarGeoreferenciaAsignatura = (
    msg: Message,
    estadoGlobal: EstadoGlobal,
    codigoAsignatura:string,
    codigoHorario:string,
  ): Promise<any> => {
    return dataBase    
      .ref(
        "periodosAcademicos/" +
          estadoGlobal.settings.periodoActual +
          "/asignacion/" +
          estadoGlobal.settings.celularDocente +
          "/asignaturas/" + 
          codigoAsignatura +
          "/horarios/"           
      )
      .child(codigoHorario)
      .update({
        coordenadasAula:msg.location.latitude + "," + msg.location.longitude
      });
  };
}
