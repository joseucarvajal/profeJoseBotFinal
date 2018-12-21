"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var fs = require("fs");
var pdf = require("html-pdf");
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
            cache_time: "0",
        });
    };
    BotSender.prototype.enviarHTMLComoDocumentoPDF = function (msg, nombreDocumento, html, description) {
        return new Promise(function (resolve) {
            var patDocumento = "./dist/tmp/" + nombreDocumento;
            var messageOptions = {
                caption: description,
                parse_mode: "HTML",
            };
            var config = { format: "A4" };
            pdf.create(html, config).toFile(patDocumento, function (err, res) {
                if (err) {
                    return console.error("Generating PDF", err);
                }
                initBot_1.bot.sendDocument(msg.from.id, patDocumento, messageOptions, {}).then(function () {
                    resolve();
                });
            });
        });
    };
    //https://github.com/yagop/node-telegram-bot-api/blob/release/doc/api.md#TelegramBot+sendChatAction
    BotSender.prototype.enviarAction = function (msg, action, options) {
        return initBot_1.bot.sendChatAction(msg.from.id, action, options);
    };
    BotSender.prototype.enviarActionTyping = function (msg, options) {
        return initBot_1.bot.sendChatAction(msg.from.id, 'typing', options);
    };
    return BotSender;
}());
exports.BotSender = BotSender;
