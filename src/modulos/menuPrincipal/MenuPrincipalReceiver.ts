import { bot } from '../../initBot';
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

import { BotSender } from "../bot/BotSender";
import { BotReceiver } from "../bot/BotReceiver";
import { KeyboardButton } from '../../bot/KeyboardButton';

import * as Data from '../../data';
import { EstadoGlobal } from '../../core';
import { IndexMain } from '../indexContracts';

export namespace MenuPrincipal {

    export namespace Comandos {

        export const MenuPrincipal = "menuPrincipal";

        export enum MenuPrincipalOpts {
            RegistrarAsistencia = "⏱ Registrar asistencia",
            RegistrarAsignatura = "📚 Inscribir asignatura",
            DesInscribirAsignatura = "❌ Des-inscribir asignatura",
            EditarInfoBasica = "✏️ Editar información básica",
        }    
    }
    
    let nombreContexto = "MenuPrincipalReceiver";
    export class MenuPrincipalReceiver extends BotReceiver {
              
        nombreContexto = nombreContexto;
                 
        constructor(estadoGlobal:EstadoGlobal, indexMain: IndexMain){  

            super(estadoGlobal, indexMain, nombreContexto);

            this.responderMenuPrincipal = this.responderMenuPrincipal.bind(this);
        }

        startResponse:Array<Array<KeyboardButton>> = [
            [{ text: Comandos.MenuPrincipalOpts.RegistrarAsistencia }],
            [{ text: Comandos.MenuPrincipalOpts.RegistrarAsignatura }],
            [{ text: Comandos.MenuPrincipalOpts.DesInscribirAsignatura }],
            [{ text: Comandos.MenuPrincipalOpts.EditarInfoBasica }],
        ];
    
        public responderMenuPrincipal(msg: Message){
            this.botSender.responderKeyboardMarkup(msg, `Selecciona una opción`, this.startResponse);
        }

        protected onRecibirMensaje(msg: Message){
            if (this.estaComandoEnContexto(Comandos.MenuPrincipalOpts.EditarInfoBasica)) {
                
            }
        }        
    }
}
