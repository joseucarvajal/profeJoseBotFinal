"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBotToken_1 = require("./initBotToken");
var core_1 = require("./core");
var dateFormat = require('dateformat');
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
    console.log('prod stage v2.3');
    // Create a bot that uses 'polling' to fetch new updates
    var prodOptions = {
        webHook: {
            port: process.env.PORT || 5000
        }
    };
    exports.bot = bot = new TelegramBot(initBotToken_1.token, prodOptions);
    var url = core_1.Constants.UrlServidor + "/dist/index.js";
    bot.setWebHook(url + "/bot" + initBotToken_1.token);
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
