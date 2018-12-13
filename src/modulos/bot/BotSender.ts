import { bot } from '../../initBot';
import { Message } from "../../bot/Message";
import { SendMessageOptions } from "../../bot/SendMessageOptions";

export class BotSender {

    enviarMensajeHTML(msg: Message, htmlText:string){
        
        const messageOptions = {
            parse_mode: 'HTML'
        } as SendMessageOptions;

        bot.sendMessage(
            msg.chat.id,
            htmlText,
            messageOptions
        );        
    }
}