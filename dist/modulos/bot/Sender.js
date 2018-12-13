"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sender = /** @class */ (function () {
    function Sender() {
        this.sendMessage = function (msg) {
            var messageOptions = {
                parse_mode: 'HTML'
            };
            bot.sendMessage(msg.chat.id, "Hola estudiante", messageOptions);
        };
    }
    Sender.prototype.enviarMensajeHTML = function (msg) {
    };
    return Sender;
}());
exports.Sender = Sender;
