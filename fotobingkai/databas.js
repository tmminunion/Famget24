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
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Cek metode login pengguna
    var providerData = user.providerData;

    // Cek apakah pengguna login melalui Google
    var isGoogleProvider = providerData.some(
      (provider) => provider.providerId === "google.com"
    );

    if (isGoogleProvider) {
      // Pengguna login melalui Google, izinkan akses
      console.log("User is logged in using Google:", user);

      // Simpan informasi pengguna ke localStorage
      localStorage.setItem("displayName", user.displayName);
      localStorage.setItem("email", user.email);
      localStorage.setItem("photoURL", user.photoURL);

      // Tampilkan informasi pengguna
      console.log("User Display Name: ", user.displayName);
      console.log("User Email: ", user.email);
      console.log("User Photo URL: ", user.photoURL);
      console.log("User Email Verified: ", user.emailVerified);
      console.log("User UID: ", user.uid);
    } else {
      // Pengguna tidak login dengan Google, lakukan logout
      console.log("User is not logged in using Google. Logging out...");

      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("You must log in using Google. Please sign in again.");
          // Redirect ke halaman login atau trigger Google sign-in popup
          firebase
            .auth()
            .signInWithPopup(googleProvider)
            .then((result) => {
              // User successfully signed in with Google
              var user = result.user;
              console.log("User logged in using Google:", user);

              // Simpan informasi pengguna ke localStorage
              localStorage.setItem("displayName", user.displayName);
              localStorage.setItem("email", user.email);
              localStorage.setItem("photoURL", user.photoURL);

              // Tampilkan informasi pengguna
              console.log("User Display Name: ", user.displayName);
              console.log("User Email: ", user.email);
              console.log("User Photo URL: ", user.photoURL);
              console.log("User Email Verified: ", user.emailVerified);
              console.log("User UID: ", user.uid);
            })
            .catch((error) => {
              console.error("Error during Google sign-in:", error);
            });
        })
        .catch((error) => {
          console.error("Error during sign out:", error);
        });
    }
  } else {
    // No user is signed in, trigger Google sign-in popup
    console.log("No user is logged in. Opening Google sign-in popup...");

    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        // User signed in
        var user = result.user;
        console.log("User logged in using Google:", user);

        // Simpan informasi pengguna ke localStorage
        localStorage.setItem("displayName", user.displayName);
        localStorage.setItem("email", user.email);
        localStorage.setItem("photoURL", user.photoURL);

        // Tampilkan informasi pengguna
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

function kirimdatak(base64Image) {
  // Tulis ke database di path 'images/image_1'
  database
    .ref("images/image_1")
    .set({
      image: base64Image,
    })
    .then(() => {
      console.log("Base64 image saved to Firebase Realtime Database");
    })
    .catch((error) => {
      console.error("Error saving base64 image: ", error);
    });
}
function kirimdata(base64Imagena) {
  const clientId = "082eb55cc144305"; // Ganti dengan Client ID kamu

  // Pisahkan base64 menjadi data biner (tanpa header MIME)
  const base64Image = base64Imagena.split(",")[1];
  const displayName = localStorage.getItem("displayName");
  const email = localStorage.getItem("email");
  const photoURL = localStorage.getItem("photoURL"); // Ambil URL foto profil
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Client-ID " + clientId);

  var formdata = new FormData();
  formdata.append("image", base64Image);
  formdata.append("type", "base64");
  formdata.append("title", "Image upload by " + displayName); // Gunakan displayName sebagai judul
  formdata.append(
    "description",
    `Uploaded by ${displayName} (${email}). Profile Picture: ${photoURL}`
  ); // Gunakan displayName, email, dan photoURL di deskripsi

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  fetch("https://api.imgur.com/3/upload", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        console.log("Image uploaded successfully: ", result.data.link);

        // Simpan URL gambar ke Firestore
        db.collection("imageskoleksi")
          .add({
            imageUrl: result.data.link,
            title: result.data.title,
            description: result.data.description,
            uploadedAt: new Date(),
            uploadedBy: displayName, // Simpan siapa yang upload
            email: email, // Simpan email
            profilePicture: photoURL, // Simpan foto profil
          })
          .then((docRef) => {
            console.log("Document written with ID: " + docRef.id);
          })
          .catch((error) => {
            alert("Error adding document: " + error);
          });
      } else {
        console.error("Image upload failed: ", result);
      }
    })
    .catch((error) => {
      console.log("Error uploading image to Imgur: ", error);
    });
}
