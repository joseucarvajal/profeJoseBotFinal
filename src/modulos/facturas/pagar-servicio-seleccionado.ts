import { Message } from "../../bot/Message";
import { ReplyKeyboardMarkup } from "../../bot/ReplyKeyboardMarkup";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { bot } from '../../initBot';
import * as Data from '../../data';

import { ChatModel } from "../../core/models";
import {
    Contextos,
    Comandos,
    Constants,
    ServicioModel,
    ProductoModel,
    MovimientoModel
} from '../../core';
import { ApiMessage } from "../../api/ApiMessage";
import { EditMessageTextOptions } from "../../bot/EditMessageTextOptions";
import { InlineKeyboardMarkup } from "../../bot/InlineKeyboardMarkup";

import {
    InscribirCuentaServicios
} from './inscribir-cuenta-servicios';
import { Validaciones } from "../../utils/validations";

export namespace PagarServicioSeleccionado {

    enum Options {
        Volver = '<< Volver',
    }

    let _productoCliente: any = null;
    let _numeroFactura: number = 0;
    let _valorPagar: number = 0;

    export namespace Metodos {

        export const sendMessage = (msg: Message, update?: boolean) => {
            Data.Chats.actualizarChat(msg.chat.id, Contextos.Facturas.PagarServicioSeleccionado.getNumeroFactura, Comandos.Facturas.PagarServicioSeleccionado.getNumeroFactura).then(() => {
                const messageOptions = {
                    parse_mode: 'HTML'
                } as SendMessageOptions;

                bot.sendMessage(
                    msg.chat.id,
                    `Ingresa el número de la factura`,
                    messageOptions
                );
            });
        }

        export const onPagarServicioSeleccionado = (msg: Message, productoCliente: ProductoModel, update?: boolean) => {
            sendMessage(msg, update);
            _productoCliente = productoCliente;
        }

        export const solicitarValorAPagar = (msg: Message) => {
            Data.Chats.actualizarChat(msg.chat.id, Contextos.Facturas.PagarServicioSeleccionado.getValorPagar, Comandos.Facturas.PagarServicioSeleccionado.getValorPagar).then(() => {
                const messageOptions = {
                    parse_mode: 'HTML'
                } as SendMessageOptions;

                bot.sendMessage(
                    msg.chat.id,
                    `Ingresa el valor a pagar.`,
                    messageOptions
                );
            });
        }

        export const enviarMensajeNumeroFacturaInvalido = (msg: Message) => {
            bot.sendMessage(msg.chat.id, `❌ El número de la factura no es válida, esta debe tener sólo números.`);
        };

        export const enviarMensajeValorAPagarInvalido = (msg: Message) => {
            bot.sendMessage(msg.chat.id, `❌ El número de la factura no es válida, esta debe tener sólo números.`);
        };

        export const enviarMensajeServicioPagado = (msg: Message) => {
            bot.sendMessage(msg.chat.id, `✅ Pago exitoso, estás al día con tu factura.`);
        };
    }

    export namespace eventHandlers {

        export const listen = () => {

            bot.on('message', (msg: Message) => {
                if (!msg.text) {
                    return;
                }

                Data.Chats.getChat(msg).then((chat: ChatModel) => {
                    if (chat.contexto == Contextos.Facturas.PagarServicioSeleccionado.getNumeroFactura
                        && chat.comando == Comandos.Facturas.PagarServicioSeleccionado.getNumeroFactura) {
                        if (Validaciones.esNumeroRequeridoValido(msg.text)) {
                            Metodos.solicitarValorAPagar(msg);
                        } else {
                            Metodos.enviarMensajeNumeroFacturaInvalido(msg);
                        }
                    } else if (chat.contexto == Contextos.Facturas.PagarServicioSeleccionado.getValorPagar
                        && chat.comando == Comandos.Facturas.PagarServicioSeleccionado.getValorPagar) {
                        if (Validaciones.esNumeroRequeridoValido(msg.text)) {
                            Data.Movimientos.setMovimiento(msg.from.id, {
                                fechaHora: msg.date,
                                numero: Validaciones.generarGUID(),
                                valor: parseInt(msg.text),
                                tipo: Constants.TipoMovimientoEnum.PagoServicios
                            } as MovimientoModel).then(() => {
                                Metodos.enviarMensajeServicioPagado(msg);
                            });
                        } else {
                            Metodos.enviarMensajeValorAPagarInvalido(msg);
                        }
                    }
                });
            });
        }
    }
}

//PagarServicioSeleccionado.eventHandlers.listen();