import { Message } from "../bot/Message";
import { dataBase } from '../initDatabase';
import { getListFromFirebaseObject } from './common';
import { ServicioModel, MovimientoModel } from "../core/models";

export namespace Movimientos {

    export const setMovimiento = (chatId: string | number, movimientoModel: MovimientoModel): Promise<Array<ServicioModel>> => {
        return dataBase.ref('clientes/' + chatId + '/movimientos').push(movimientoModel);
    }

    export const getMovimientosDeCliente = (chatId: number | string): Promise<Array<MovimientoModel>> => {
        return dataBase.ref('clientes/' + chatId + '/movimientos').once('value')
            .then((snapshot: any) => {
                return getListFromFirebaseObject<MovimientoModel>(snapshot.val());
            })
            .catch((error: any) => {
                console.log("Movimientos/getMovimientosDeCliente" + error);
            });
    }
}