import {
  token
} from './initBotToken';
import { Constants } from './core';

let dateFormat = require('dateformat');

const TelegramBot = require('node-telegram-bot-api');

let bot:any = null;

declare const process: any;
if (process.env.NODE_ENV.trim() == 'development') {

  console.log('dev stage');
  
  // Create a bot that uses 'polling' to fetch new updates

  const devOptions = {
    polling: true
  };

  bot = new TelegramBot(token, devOptions);

} else {

  console.log('prod stage v2.1');

  // Create a bot that uses 'polling' to fetch new updates
  const prodOptions = {
    webHook: {
      port: process.env.PORT || 5000
    }
  };
  
  bot = new TelegramBot(token, prodOptions);

  const url = `${Constants.UrlServidor}/dist/index.js`;

  bot.setWebHook(`${url}/bot${token}`);
}

export {
  bot,
}

dateFormat.i18n = {
    dayNames: [
        'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab',
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ],
    monthNames: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};