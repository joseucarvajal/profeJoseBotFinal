import {
  EstadoGlobal,
  Asignatura,
  ListadoEstudiantes,
  Estudiante,
  ListadoAsistenciaFecha,
  ListadoAsistenciaEstudiante,
  ListaResultadoAsistenciasIndxByEstCodigo,
  ContadorAsistenciasEstudiante,
  ResultadoReporteAsistencia
} from "../../core";

import * as Data from "../../data";
import { ApiMessage } from "../../api/ApiMessage";
import { Message } from "../../bot/Message";

/*
Calcula todo el reporte así:
Asignatura: XXXXXXX
------------------------------------------------------------------------
estudiante codigo | estudiante nombre | Nro. Asistencias | Nro. Fallas |

*/
export class CalculoReporteAsistenciaAsignaturas {
  //Mensaje Telegram
  private msg: Message & ApiMessage;

  //Asignatura para generar el reporte "periodo/2018-03/asignacion/celular-docente/asignaturas"
  asignatura: Asignatura;

  //Estudiantes inscritos(matriculados) en asignatura "periodo/2018-03/asignacion/celular-docente/asignatura_estudiante"
  listadoEstudiantes: ListadoEstudiantes;

  //Asistencias de la asignatura indexadas por fecha: "periodo/2018-03/asignacion/celular-docente/asistencias_asignatura"
  listadoAsistenciaFecha: ListadoAsistenciaFecha;

  //Resultados: estudiante con sus contadores de asistencias y fallas.
  listaResultadoAsistenciasIndxByEstCodigo: ListaResultadoAsistenciasIndxByEstCodigo;

  //Resultado final del reporte, con la asignatura y los resultados de asistencia por estudiante
  resultadoReporteAsistencia:ResultadoReporteAsistencia;

  constructor(private estadoGlobal: EstadoGlobal) {
    this.msg = {} as Message & ApiMessage;
    this.asignatura = {} as Asignatura;
    this.listadoEstudiantes = {} as ListadoEstudiantes;
    this.listadoAsistenciaFecha = {} as ListadoAsistenciaFecha;
    this.listaResultadoAsistenciasIndxByEstCodigo = {} as ListaResultadoAsistenciasIndxByEstCodigo;
    this.resultadoReporteAsistencia = {} as ResultadoReporteAsistencia;
  }

  public calcularReporteAsistenciaAsignaturas(
    msg: Message & ApiMessage,
    codigoAsignatura: string
  ): Promise<ResultadoReporteAsistencia> {
    return new Promise<ResultadoReporteAsistencia>((resolve, reject) => {
      this.msg = msg;
      Data.Asignacion.getAsignaturaByCodigo(
        this.estadoGlobal,
        codigoAsignatura
      ).then((asignatura: Asignatura) => {
        this.asignatura = asignatura;
        this.resultadoReporteAsistencia.asignatura = this.asignatura;
        Data.Asignacion.getEstudiantesInscritosEnAsignatura(
          this.estadoGlobal,
          this.asignatura.codigo
        ).then((listadoEstudiantes: ListadoEstudiantes) => {
          this.listadoEstudiantes = listadoEstudiantes;
          for (let codigoEstudiante in this.listadoEstudiantes) {
            this.listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante] = {
              estudiante: this.listadoEstudiantes[codigoEstudiante],
              countAsistencias: 0,
              countFallas: 0
            } as ContadorAsistenciasEstudiante;
          }
          Data.Asignacion.getListadoAsistenciaByAsignatura(
            this.estadoGlobal,
            this.asignatura
          ).then((listadoAsistenciaAsignatura: ListadoAsistenciaFecha) => {
            this.listadoAsistenciaFecha = listadoAsistenciaAsignatura;
            this.calcularAsistenciasYAusenciasXEstudiantes();
            resolve(this.resultadoReporteAsistencia);
          });
        });
      });
    });
  }

  private calcularAsistenciasYAusenciasXEstudiantes() {
    let estudiante: Estudiante;
    let asistenciaEstudiante: ListadoAsistenciaEstudiante;
    for (let codigoEstudiante in this.listadoEstudiantes) {
      estudiante = this.listadoEstudiantes[codigoEstudiante];
      for (let fechaAsistenciaMilsecs in this.listadoAsistenciaFecha) {
        asistenciaEstudiante = this.listadoAsistenciaFecha[
          fechaAsistenciaMilsecs
        ];
        if (asistenciaEstudiante[estudiante.codigo]) {
          //Se encuentra el estudiante en la asistencia
          this.listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante]
            .countAsistencias++;
        } else {
          this.listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante]
            .countFallas++;
        }
      }
    }
    this.resultadoReporteAsistencia.listaResultadoAsistenciasIndxByEstCodigo = this.listaResultadoAsistenciasIndxByEstCodigo;
  }
}
