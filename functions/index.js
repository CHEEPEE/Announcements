const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    // ...
    var userId = user.uid;
    var email = user.email;
    console.log("user Id: "+ userId+ " userEmail: "+email);
    return firestore.collection("accounts").doc(userId).set({
        email:email,
        userId:userId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        userType:"subAdmin"
    })
  });

  exports.myFunctionName = functions.firestore
  .document('users/createUser').onWrite((change, context) => {
    // ... Your code here
    console.log(change.after.data());
    let email = change.after.data().email;
    let password = change.after.data().password;
    admin.auth().createUser({
        email: email,
        emailVerified: true,
        password: password,
        disabled: false
    })
  });

  




  
  