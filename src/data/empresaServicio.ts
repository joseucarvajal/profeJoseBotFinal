import { Message } from "../bot/Message";
import { dataBase } from '../initDatabase';
import { getListFromFirebaseObject } from './common';
import { ServicioModel } from "../core/models";

export namespace EmpresaServicio {

    export const getEmpresaServicios = (chatId: string | number): Promise<Array<ServicioModel>> => {

        return dataBase.ref('empresaServicio').once('value')
            .then((snapshot: any) => {
                return getListFromFirebaseObject<ServicioModel>(snapshot.val());
            })
            .catch((error: any) => {
                console.log("EmpresaServicio/getEmpresaServicios" + error);
            });
    }

    export const getEmpresaServiciosById = (chatId: string | number, empresaServicioId: number | string): Promise<any> => {

        return dataBase.ref('empresaServicio/' + empresaServicioId).once('value');
    }
}