"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require('firebase');
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBwrdjFpHaR8hM2LlkJs5ZJJaPqeBedCP0",
    authDomain: "profejosebot-94c5e.firebaseapp.com",
    databaseURL: "https://profejosebot-94c5e.firebaseio.com",
    projectId: "profejosebot-94c5e",
    storageBucket: "profejosebot-94c5e.appspot.com",
    messagingSenderId: "614610891159"
};
firebase.initializeApp(config);
exports.dataBase = firebase.database();
