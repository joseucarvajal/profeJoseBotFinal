"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require('firebase');
// Initialize Firebase
var config = {
    apiKey: "AIzaSyD3Vcq64dmZper_SnzWLbn_p-L6dggIGxU",
    authDomain: "kodefest8.firebaseapp.com",
    databaseURL: "https://kodefest8.firebaseio.com",
    projectId: "kodefest8",
    storageBucket: "kodefest8.appspot.com",
    messagingSenderId: "885950983213"
};
firebase.initializeApp(config);
exports.dataBase = firebase.database();
