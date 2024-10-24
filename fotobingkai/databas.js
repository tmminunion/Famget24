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

// Initialize Firestore
const db = firebase.firestore();

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


// Initialize Realtime Database
const database = firebase.database();
function kirimdata(imgData){
const base64Image = imgData.split(',')[1];
// Example of how to call the function with user data
const userData = {
  name: "John Doe",
  email: "johndoe@example.com",
  photoURL: base64Image,
  uid: "user123",
};

  // Reference to the Firestore collection 'users'
  db.collection("users")
    .add(userData) // Add the data to Firestore, auto-generating a unique document ID
    .then((docRef) => {
      alert("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      alert("Error adding document: ", error);
    });
}
// Contoh s

// Fungsi untuk menyimpan base64 di Realtime Database
function saveBase64ToFirebase(base64Image) {
  // Tulis ke database di path 'images/image_1'
  database.ref('images/image_1').set({
    image: base64Image
  }).then(() => {
    console.log("Base64 image saved to Firebase Realtime Database");
  }).catch((error) => {
    console.error("Error saving base64 image: ", error);
  });
}

function kirimdata(base64Image) {
  // Tulis ke database di path 'images/image_1'
  database.ref('images/image_1').set({
    image: base64Image
  }).then(() => {
    console.log("Base64 image saved to Firebase Realtime Database");
  }).catch((error) => {
    console.error("Error saving base64 image: ", error);
  });
}

// Panggil fungsi untuk menyimpan gambar base64
function kirimdatrtra(base64Imagena) {
  const clientId = '56fe2778064aadb';
  //alert(base64Imagena);
  // Memisahkan MIME dari base64 image
  const base64Image = base64Imagena.split(',')[1]; // Hanya mengambil bagian base64 setelah MIME

  fetch('https://api.imgur.com/3/upload', {
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${clientId}`,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
      type: 'base64'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Image uploaded successfully: ", data.data.link);
      window.open(data.data.link, '_blank');
    } else {
      alert("Image upload failed: ", data);
    }
  })
  .catch(error => {
    alert("Error uploading image to Imgur: ", error);
  });
}