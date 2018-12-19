import { Constants } from "./constants";

//#region

export interface Settings {
  celularDocente: string;
  periodoActual: string;
  idUsuarioChatDocente:number;
}

export interface InformacionContexto {
    contexto: string;
    comando: string;
}

export interface Estudiante extends InformacionContexto {  
    codigo:string;
    nombre:string;
    email:string;     
    inscripcionAsignaturasConfirmado:boolean; //Cuando un estudiante ha confirmado su registro en el bot (el código corresponde y tiene asignaturas asociadas)
    tempData:string;
    asignaturas?:ListadoAsignaturas;
}

export interface CelularUsuario {
  idUsuario:string; //Id usuario en Telegram
  tipoUsuario:string; //"e" (estudiante) | "p" (profesor)
}

export interface InfoUsuarioMensaje{
    estudiante:Estudiante;
}

export interface EstadoGlobal {
    settings: Settings;
    infoUsuarioMensaje:InfoUsuarioMensaje;    
    idUsuarioChat:string;
}

export interface Horario {
  dia:string;
  horaInicio:string;
  horaFin:string;
  aula:string;
  coordenadasAula:string;
}


export interface ListadoAsignaturas {
  [key: string]: Asignatura;
}

export interface ListadoHorarios {
  [key: string]: Horario;
}

export interface ListadoEstudiantes {
  [key: string]: Estudiante;
}

export interface Asignatura { 
  codigo:string;
  nombre:string;
  grupo:number;
  horarios:ListadoHorarios;
  estado?:Constants.EstadoEstudianteAsignatura;
  
  /* 
  En milisegundos
  1. milisegundos to date: new Date(milisegundos)
  2. date a milisegundos: date.getTime()
  */
  fechaInicioClases:number; 
  
}

export interface AsignaturaEstudiantes {
  [key: string]: ListadoEstudiantes;
}

export interface Asistencia {
  latitud:number,
  longitud:number,
  fechaHora:number; //milliseconds
}

export interface AsignaturasDeEstudiante {
  estudiante: Estudiante;
  listaAsignaturas: Array<Asignatura>;
  result:boolean;
  message:string;
}

export interface AsignaturaAsignadaAEstudiante {
  codigo:string;
  estado:Constants.EstadoEstudianteAsignatura;
}

export interface ListadoAsistenciaEstudiante {
  [codigoEstudiante:string]:Asistencia;
}

export interface ListadoAsistenciaFecha {
  [milisegundosFecha:number]:ListadoAsistenciaEstudiante;
}

export interface ListadoAsistenciaAsignatura{
  [codigoAsignatura:string]:ListadoAsistenciaFecha;
}

export interface ContadorAsistenciasEstudiante {
  estudiante:Estudiante;
  countAsistencias:number;
  countFallas:number;
}

export interface ListaResultadoAsistenciasIndxByEstCodigo{
  [codigoEstudiante:string]:ContadorAsistenciasEstudiante;
}

export interface ResultadoReporteAsistencia{
  asignatura:Asignatura;
  listaResultadoAsistenciasIndxByEstCodigo:ListaResultadoAsistenciasIndxByEstCodigo;
}

//#endregion