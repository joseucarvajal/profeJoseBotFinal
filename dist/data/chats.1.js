"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var Chats;
(function (Chats) {
    Chats.guardarContexto = function (msg, contexto) {
        return initDatabase_1.dataBase.ref('chats/' + msg.chat.id + '/contexto').set(contexto);
    };
    Chats.guardarComando = function (msg, comando) {
        return initDatabase_1.dataBase.ref('chats/' + msg.chat.id + '/comando').set(comando);
    };
    Chats.guardarComandoByChatId = function (chatId, comando) {
        return initDatabase_1.dataBase.ref('chats/' + chatId + '/comando').set(comando);
    };
    Chats.actualizarDatoComando = function (chatId, datosComando) {
        return initDatabase_1.dataBase.ref('chats/' + chatId + '/datosComando').set(datosComando);
    };
    Chats.actualizarChat = function (chatId, contexto, comando) {
        return initDatabase_1.dataBase.ref('chats/' + chatId).set({
            contexto: contexto,
            comando: comando
        });
    };
    Chats.guardarNuevaConfiguracionDeUsuario = function (msg) {
        return initDatabase_1.dataBase.ref('chats/' + msg.chat.id).set({
            contexto: "",
            comando: ""
        });
    };
    Chats.getChat = function (msg) {
        return initDatabase_1.dataBase.ref('chats/' + msg.chat.id).once('value')
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Chats/getChat" + error);
        });
    };
    Chats.getChatByUserId = function (chatId) {
        return initDatabase_1.dataBase.ref('chats/' + chatId).once('value')
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Chats/getChat" + error);
        });
    };
})(Chats = exports.Chats || (exports.Chats = {}));
