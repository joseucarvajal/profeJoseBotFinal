import {
  TelegramBot as TelegramBotModel
} from './bot/TelegramBot';

import {
  token as tokenDev
} from './initBotTokenDev';

import {
  token as tokenDist
} from './initBotTokenDist';

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
let token = '';

let bot = null;

declare const process: any;
if (process.env.NODE_ENV.trim() == 'development') {

  console.log('dev stage');

  token = tokenDev;
  // Create a bot that uses 'polling' to fetch new updates
  const prodOptions = {
    webHook: {
      port: process.env.PORT || 5000
    }
  };

  const devOptions = {
    polling: true
  };

  bot = new TelegramBot(token, devOptions);

} else {

  console.log('prod stage');

  token = tokenDist;

  // Create a bot that uses 'polling' to fetch new updates
  const prodOptions = {
    webHook: {
      port: process.env.PORT || 5000
    }
  };
  
  bot = new TelegramBot(token, prodOptions);

  const url = 'https://kodefest8.herokuapp.com/dist/index.js';

  bot.setWebHook(`${url}/bot${token}`);
}

export {
  bot,
}

