import { Constants } from "./constants";

//#region

export interface Settings {
  celularDocente: string;
  periodoActual: string;
  idUsuarioChatDocente:string;
}

export interface InformacionContexto {
    contexto: string;
    comando: string;
}

export interface Estudiante extends InformacionContexto {  
    codigo:string;
    nombre:string;
    email:string;     
    registroConfirmado:boolean; //Cuando un estudiante ha confirmado su registro en el bot (el código corresponde y tiene asignaturas asociadas)
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

export interface Asignatura {  
  codigo:string;
  nombre:string;
  grupo:number;
  estudiantesMatriculados:Array<string>;
  horarios:ListadoHorarios;
}

//#endregion