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

  exports.createUser = functions.firestore
  .document('users/createUser').onWrite((change, context) => {
    // ... Your code here
    console.log(change.after.data());
    let email = change.after.data().email;
    let password = change.after.data().password;
    return admin.auth().createUser({
        email: email,
        emailVerified: true,
        password: password,
        disabled: false
    })
  });

  exports.deleteUser = functions.firestore
  .document('users/deleteUser').onWrite((change, context) => {
    // ... Your code here
    console.log(change.after.data());
    let userId = change.after.data().userId;
    admin.auth().deleteUser(userId)
    .then(() => {
        console.log('User Authentication record deleted');
        return true;
    })
    .catch(() => console.error('Error while trying to delete the user', err));
  });

  exports.deletUserFromDatabase = functions.auth.user().onDelete((user) => {
    // ...
    return firestore.collection("accounts").doc(user.uid).delete();
  });

  




  
  