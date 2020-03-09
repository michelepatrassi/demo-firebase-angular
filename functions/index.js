const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.authOnCreate = functions.auth.user().onCreate(user => {
    return admin
        .firestore()
        .doc(`users/${user.uid}`)
        .set({
            items: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
});
