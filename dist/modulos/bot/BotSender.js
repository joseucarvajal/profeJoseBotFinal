"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var BotSender = /** @class */ (function () {
    function BotSender() {
    }
    BotSender.prototype.enviarMensajeHTML = function (msg, htmlText) {
        var messageOptions = {
            parse_mode: 'HTML'
        };
        initBot_1.bot.sendMessage(msg.chat.id, htmlText, messageOptions);
    };
    return BotSender;
}());
exports.BotSender = BotSender;
