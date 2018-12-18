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
}

export interface AsignaturaEstudiantes {
  [key: string]: ListadoEstudiantes;
}

export interface RegistroAsistenciaModel {
  latitud:number,
  longitud:number
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
//#endregion