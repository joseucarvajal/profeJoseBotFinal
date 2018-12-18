"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initBot_1 = require("../../initBot");
var fs = require("fs");
var pdf = require("pdf-thumbnail");
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
            fs.access(path, fs.F_OK, function (err) {
                if (err) {
                    console.log("file to send doesn't exists", err);
                    return;
                }
                var pdfBuffer = fs.readFileSync(path);
                var thumbnailOpts = {
                    compress: {
                        type: "JPEG",
                        quality: 70 //default
                    }
                };
                pdf(pdfBuffer /*Buffer or stream of the pdf*/, thumbnailOpts)
                    .then(function (data) {
                    /*Stream of the image*/
                    // ...
                    /*
                    bot.sendDocument(msg.from.id, path).then(() => {
                      resolve();
                    });
                    */
                    var messageOptions = {
                        chat_id: msg.id,
                        document: path
                    };
                    console.log("llega 2");
                    initBot_1.bot.sendMessage(msg.id, messageOptions);
                })
                    .catch(function (err) {
                    console.log("Error generatin PDF thumbnail", err);
                });
            });
        });
    };
    return BotSender;
}());
exports.BotSender = BotSender;
