import {
  TelegramBot as TelegramBotModel
} from './bot/TelegramBot';

import {
  token
} from './initBotToken';

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

  console.log('prod stage');

  // Create a bot that uses 'polling' to fetch new updates
  const prodOptions = {
    webHook: {
      port: process.env.PORT || 5000
    }
  };
  
  bot = new TelegramBot(token, prodOptions);

  const url = 'https://evening-headland-56271.herokuapp.com/dist/index.js';

  bot.setWebHook(`${url}/bot${token}`);
}

export {
  bot,
}

