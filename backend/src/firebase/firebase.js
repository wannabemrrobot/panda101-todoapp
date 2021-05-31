const firebase = require("firebase-admin");
const credentials = require('./serviceAccount/panda101SAK.json');

// Initialize firebase
firebase.initializeApp({
    credential: firebase.credential.cert(credentials),
});

module.exports = firebase;