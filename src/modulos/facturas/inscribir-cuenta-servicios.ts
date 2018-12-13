import * as Data from '../../data';
import { ServicioModel, ChatModel } from "../../core/models";
import { Message } from "../../bot/Message";

export namespace InscribirCuentaServicios {

    export const getEmpresaServiciosByCliente = (chatId: number | string): Promise<Array<ServicioModel>> => {

        return Data.EmpresaServicio.getEmpresaServicios(chatId).then((ListaEmpresaDeServicios: Array<ServicioModel>) => {
            return Data.Clientes.getEmpresasInscritasFromCliente({
                chat: {
                    id: chatId
                }
            } as Message).then((listaEmpresasDeServiciosAsociadosACliente: Array<ServicioModel>) => {
                let empresasInscritasByClienteList = new Array<ServicioModel>();

                if (!listaEmpresasDeServiciosAsociadosACliente) {
                    empresasInscritasByClienteList = ListaEmpresaDeServicios;
                    return empresasInscritasByClienteList;
                }

                for (let i = 0; i < ListaEmpresaDeServicios.length; i++) {

                    let empresaAsociadaResultado = listaEmpresasDeServiciosAsociadosACliente.find((empresa: ServicioModel) => empresa.id == ListaEmpresaDeServicios[i].id);
                    if(empresaAsociadaResultado){
                        continue;
                    }

                    empresasInscritasByClienteList.push(ListaEmpresaDeServicios[i]);
                }

                return empresasInscritasByClienteList;
            });
        });
    }
}