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
        var chatUserId = msgEntrante.chat
            ? msgEntrante.chat.id
            : msgEntrante.from.id;
        return initBot_1.bot.sendMessage(chatUserId, htmlText, messageOptions);
    };
    BotSender.prototype.responderMensajeErrorHTML = function (msgEntrante, htmlText) {
        var messageOptions = {
            parse_mode: "HTML"
        };
        var chatUserId = msgEntrante.chat
            ? msgEntrante.chat.id
            : msgEntrante.from.id;
        return initBot_1.bot.sendMessage(chatUserId, "\uD83D\uDE14 " + htmlText, messageOptions);
    };
    BotSender.prototype.responderKeyboardMarkup = function (msgEntrante, label, opcionesKeyboard) {
        var messageOptions = {
            parse_mode: "HTML",
            reply_markup: {
                remove_keyboard: true,
                one_time_keyboard: true,
                keyboard: opcionesKeyboard
            }
        };
        var chatUserId = msgEntrante.chat
            ? msgEntrante.chat.id
            : msgEntrante.from.id;
        return initBot_1.bot.sendMessage(chatUserId, label, messageOptions);
    };
    BotSender.prototype.responderInlineKeyboard = function (msgEntrante, label, opcionesInlineKeyboard) {
        var messageOptions = {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: opcionesInlineKeyboard,
                hide_keyboard: true
            }
        };
        var chatUserId = msgEntrante.chat
            ? msgEntrante.chat.id
            : msgEntrante.from.id;
        return initBot_1.bot.sendMessage(chatUserId, label, messageOptions);
    };
    BotSender.prototype.responderInLineQuery = function (msg, coleccionElementos) {
        return initBot_1.bot.answerInlineQuery(msg.id, coleccionElementos, {
            cache_time: "0"
        });
    };
    return BotSender;
}());
exports.BotSender = BotSender;
