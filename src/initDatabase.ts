const firebase = require('firebase');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCyqfZZVUgeSwwbHUxITIzcJ6kSI3xgdjU",
    authDomain: "profejosebot-94c5e.firebaseapp.com",
    databaseURL: "https://profejosebot-94c5e.firebaseio.com",
    projectId: "profejosebot-94c5e",
    storageBucket: "profejosebot-94c5e.appspot.com",
    messagingSenderId: "614610891159"
};
firebase.initializeApp(config);

export const dataBase = firebase.database();