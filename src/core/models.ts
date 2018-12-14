import { Constants } from "./constants";

export interface IModel {
  id: string | number;
}

export interface ChatModel extends IModel {
  id: number | string;
  contexto: string;
  comando: string;
  datosComando?: string;
}

export interface ClienteModel extends IModel {
  id: string | number;
  documento: string;
  nombre: string;
  productos: Array<ProductoModel>;
  serviciosPublicosInscritos: Array<ServicioModel>;
}

export interface ProductoModel extends IModel {
  id: string | number;
  numero: string;
  idProducto: number;
  cupoMaximo: number;
  cupoMinimo: number;
  saldo: number;
  movimientos: Array<MovimientoModel>;
  saldosMensuales: Array<SaldoMensualModel>;
}

export interface ProductoBanco extends IModel {
  id: string | number;
  icono: string;
  nombre: string;
}

export interface MovimientoModel extends IModel {
  id: string | number;
  numero: string;
  tipo: Constants.TipoMovimientoEnum;
  fechaHora: number;
  valor: number;
}

export interface ServicioModel extends IModel {
  id: string | number;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface SaldoMensualModel extends IModel {
  id: string | number;
  mes: string; //{'ene', 'feb', 'mar', 'abr'...'dic'}
  valor: number;
}

//#region

export interface Settings {
  codigoAccesoEstudiante: string;
  periodoActual: string;
}

export interface InformacionContexto {
    contexto: string;
    comando: string;
}

export interface Estudiante extends InformacionContexto {
    codigo:string;
    nombre:string;
    email:string;    
}

export interface InfoUsuarioMensaje{
    estudiante:Estudiante;
}

export interface EstadoGlobal {
    settings: Settings;
    infoUsuarioMensaje:InfoUsuarioMensaje;
}


//#endregion
