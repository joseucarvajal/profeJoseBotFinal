"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBotToken_1 = require("./initBotToken");
var TelegramBot = require('node-telegram-bot-api');
var bot = null;
exports.bot = bot;
if (process.env.NODE_ENV.trim() == 'development') {
    console.log('dev stage');
    // Create a bot that uses 'polling' to fetch new updates
    var devOptions = {
        polling: true
    };
    exports.bot = bot = new TelegramBot(initBotToken_1.token, devOptions);
}
else {
    console.log('prod stage');
    // Create a bot that uses 'polling' to fetch new updates
    var prodOptions = {
        webHook: {
            port: process.env.PORT || 5000
        }
    };
    exports.bot = bot = new TelegramBot(initBotToken_1.token, prodOptions);
    var url = 'https://kodefest8.herokuapp.com/dist/index.js';
    bot.setWebHook(url + "/bot" + initBotToken_1.token);
}
