"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var BotSender = /** @class */ (function () {
    function BotSender() {
    }
    BotSender.prototype.responderMensajeHTML = function (msgEntrante, htmlText) {
        var messageOptions = {
            parse_mode: "HTML"
        };
        return initBot_1.bot.sendMessage(msgEntrante.chat.id, htmlText, messageOptions);
    };
    BotSender.prototype.responderMensajeErrorHTML = function (msgEntrante, htmlText) {
        var messageOptions = {
            parse_mode: "HTML"
        };
        return initBot_1.bot.sendMessage(msgEntrante.chat.id, "\uD83D\uDE14 " + htmlText, messageOptions);
    };
    BotSender.prototype.responderKeyboardMarkup = function (msg, label, opcionesKeyboard) {
        var messageOptions = {
            parse_mode: "HTML",
            reply_markup: {
                remove_keyboard: true,
                one_time_keyboard: true,
                keyboard: opcionesKeyboard
            }
        };
        return initBot_1.bot.sendMessage(msg.chat.id, label, messageOptions);
    };
    return BotSender;
}());
exports.BotSender = BotSender;
