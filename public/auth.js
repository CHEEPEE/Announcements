//  var server = "http://localhost:5000";
// server = "https://group5antique.firebaseapp.com";
var email = "";
var userId = "";
var categoryId = "";
firebaseApp.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    var user = firebaseApp.auth().currentUser;
    //  var userId = user.uid;
    var cashierNumber;

    ref.collection("accounts").doc(user.uid).onSnapshot(function(querySnapshot) {
      console.log(querySnapshot.data());
      if(querySnapshot.data().userType == "admin"){
        goToAdmin();
      }
      else if(querySnapshot.data().userType == "subAdmin"){

        goTosubadmin();
        categoryId = querySnapshot.data().categoryId;
      }
     });


    if (user != null) {
      console.log("user identified");
      console.log(user.email);
      // var userId = firebase.auth().currentUser.uid;
      // return firebase.database().ref('/user/' + userId+'/cashier_number').once('value').then(function(snapshot) {
      // localStorage.cashiernumber = snapshot.val();
      // });
       email = user.email;
       userId = user.userId;
       document.getElementById("userAccountEmail").innerHTML = user.email

       

      // if (window.location.href != "http://localhost:5000/index.html" || window.location.href != "http://localhost:5000/index.html" ) {
      //     window.location.href = "index.html";
      // }
    }
  } else {
    console.log("login page");
    // No user is signed in.
    if (window.location.hostname == "localhost") {
      if (window.location.href != "http://"+window.location.hostname+":"+window.location.port+ "/login.html") {
        window.location.href = "/login.html";
        console.log("will be logged out");
      }
    } else {
      if (
        window.location.href !=
        "announcementsystem-19c49.firebaseapp.com"
      ) {
        window.location.href =
        window.location.href = "/login.html";
        console.log("will be logged out");
      }
    }
  }
});

function login() {
  var userEmail = document.getElementById("email").value;
  var userPass = document.getElementById("password").value;

  firebaseApp
    .auth()
    .signInWithEmailAndPassword(userEmail, userPass)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("Error : " + errorMessage);
      // ...
    });
}

function logout() {
  firebaseApp.auth().signOut();
  console.log("logout");
}

function goToAdmin(){
  if (window.location.hostname == "localhost") {
    

    if (
      window.location.href !="http://"+window.location.hostname+":"+window.location.port+ "/admin/"
    )
     {
      window.location.href =
        "/admin/";
    }
  } else {
    if (
      window.location.href !=
      "announcementsystem-19c49.firebaseapp.com"
    ) {
      window.location.href = "/admin/";
    }
  }
}

function goTosubadmin(){
  if (window.location.hostname == "localhost") {
    

    if (
      window.location.href !="http://"+window.location.hostname+":"+window.location.port+ "/subadmin/"
    )
     {
      window.location.href =
        "/subadmin/";
    }
  } else {
    if (
      window.location.href !=
      "announcementsystem-19c49.firebaseapp.com"
    ) {
      window.location.href = "/subadmin/";
    }
  }
}
