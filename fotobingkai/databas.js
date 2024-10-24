const firebaseConfig = {
  apiKey: "AIzaSyA7kHlC_5RxBy7g5JbFuYWjGOZ393S0-hk",
  authDomain: "nufat-eltijany.firebaseapp.com",
  databaseURL:
    "https://nufat-eltijany-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nufat-eltijany",
  storageBucket: "nufat-eltijany.appspot.com",
  messagingSenderId: "816575333917",
  appId: "1:816575333917:web:58d7f5f399c27b503b28f4",
  measurementId: "G-BNJ6JMT2JE",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const googleSignInBtn = document.getElementById("googleSignInBtn");

googleProvider.setCustomParameters({
  login_hint: "user@example.com",
});
googleSignInBtn.addEventListener("click", () => {
  firebase
    .auth()
    .signInWithPopup(googleProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // IdP data available in result.additionalUserInfo.profile.
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
});
// Check if the user is already signed in and log user info
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log("User is already logged in:", user);

    // Display user information
    console.log("User Display Name: ", user.displayName);
    console.log("User Email: ", user.email);
    console.log("User Photo URL: ", user.photoURL);
    console.log("User Email Verified: ", user.emailVerified);
    console.log("User UID: ", user.uid);
  } else {
    // No user is signed in, trigger the Google sign-in popup
    console.log("No user is logged in. Opening Google sign-in popup...");

    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        // User signed in
        var user = result.user;
        console.log("User logged in:", user);

        // Display user information
        console.log("User Display Name: ", user.displayName);
        console.log("User Email: ", user.email);
        console.log("User Photo URL: ", user.photoURL);
        console.log("User Email Verified: ", user.emailVerified);
        console.log("User UID: ", user.uid);
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
      });
  }
});
