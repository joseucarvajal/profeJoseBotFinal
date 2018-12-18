export namespace Constants {

    export let DiasSemana = new Map<number, string>([
        [0, `domingo`],
        [1, `lunes`],
        [2, `martes`],
        [3, `miercoles`],
        [4, `jueves`],
        [5, `viernes`],
        [6, `sabado`],
    ]);

    export enum EstadoEstudianteAsignatura {
        Activa = "activo",
        Cancelada = "cancelada"        
    }

    export const UrlServidor = 'https://evening-headland-56271.herokuapp.com';
}

