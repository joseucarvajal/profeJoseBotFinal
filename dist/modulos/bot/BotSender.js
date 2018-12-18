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
            cache_time: "0"
        });
    };
    BotSender.prototype.enviarDocumento = function (msg, path) {
        return new Promise(function (resolve) {
            var messageOptions = {
                caption: "Descarga el documento"
            };
            var config = { format: "A4" };
            var html = "\n      <style>\n      table {\n        /*\n        border-collapse: collapse;\n        */\n      }\n      </style>\n    <table border=\"1\" cellspacing=\"1\" style=\"width: 100%; border:1px solid;position: relative;\">\n      <tr>\n        <th>hello</th>\n        <th>world</th>\n      </tr>\n      <tr>\n        <td>1</td>\n        <td>1</td>\n      </tr>\n      <tr>\n        <td>2</td>\n        <td>2</td>\n      </tr>\n    </table>\n      ";
            pdf.create(html, config).toFile(path, function (err, res) {
                if (err) {
                    return console.error("Generating PDF", err);
                }
                initBot_1.bot.sendDocument(msg.from.id, path, messageOptions, {}).then(function () {
                    resolve();
                });
            });
        });
    };
    return BotSender;
}());
exports.BotSender = BotSender;
