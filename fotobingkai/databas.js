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
        // Simpan informasi pengguna ke localStorage
              localStorage.setItem("displayName", user.displayName);
              localStorage.setItem("email", user.email);
              localStorage.setItem("photoURL", user.photoURL);
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
const InBtn = document.getElementById("konlog");
  googleSignInBtn.style.display  ="none";      // Simpan informasi pengguna ke localStorage
      localStorage.setItem("displayName", user.displayName);
      localStorage.setItem("email", user.email);
      localStorage.setItem("photoURL", user.photoURL);
$("#rownama").text(user.displayName);
// document.getElementById('rownama').innerText=user.displayName;  
      // Tampilkan informasi pengguna
      console.log("User Display Name: ", user.displayName);
      console.log("User Email: ", user.email);
      console.log("User Photo URL: ", user.photoURL);
      console.log("User Email Verified: ", user.emailVerified);
      console.log("User UID: ", user.uid);
    } else {
      // Pengguna tidak login dengan Google, lakukan logout
      console.log("User is not logged in using Google. Logging out...");

    
    }
  } else {
    // No user is signed in, trigger Google sign-in popup
  
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

function kirimdatta(base64Image) {
  // Tulis ke database dengan id unik di path 'images/'
  database
    .ref("images/")
    .push({
      image: base64Image,
    })
    .then(() => {
      alert("Base64 image saved with unique ID to Firebase Realtime Database");
    })
    .catch((error) => {
      alert("Error saving base64 image: ", error);
    });
}

function kirimdata6h6h6h(base64Imagena) {
  const clientId = "082eb55cc144305"; // Ganti dengan Client ID kamu

  // Pisahkan base64 menjadi data biner (tanpa header MIME)
  const base64Image = base64Imagena.split(",")[1];
  const displayName = localStorage.getItem("displayName");
  const email = localStorage.getItem("email");
  const photoURL = localStorage.getItem("photoURL"); // Ambil URL foto profil
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Client-ID " + clientId);

  var formdata = new FormData();
  formdata.append("base64data", base64Image);
  formdata.append("type", "base64");
  formdata.append("title", "Image upload by " + displayName); // Gunakan displayName sebagai judul
  formdata.append(
    "description",
    `Uploaded by ${displayName} (${email}). Profile Picture: ${photoURL}`
  ); // Gunakan displayName, email, dan photoURL di deskripsi

//var link  = "https://twibone.bungtemin.net/upload.php";
var link  = "https://api.imgur.com/3/upload";
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  fetch(link, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      alert("resul");
      if (result.success) {
        alert("success");
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
            alert("Document written with ID: " + docRef.id);
          })
          .catch((error) => {
            alert("Error adding document: " + error);
          });
          
          
      } else {
        alert("Image upload failed: ", result);
      }
    })
    .catch((error) => {
      alert("Error uploading image to Imgur: ", error);
    });
}



function kirimdata(base64Imagena) {

  // Pisahkan base64 menjadi data biner (tanpa header MIME)
  const base64Image = base64Imagena.split(",")[1];
  const displayName = localStorage.getItem("displayName");
  const email = localStorage.getItem("email");
  const photoURL = localStorage.getItem("photoURL"); // Ambil URL foto profil
  
// Kirim menggunakan fetch
fetch('https://twibone.bungtemin.net/dodol.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image })
})
.then(response => response.json())
.then(data =>{ 
       console.log(data.file);
    db.collection("imageskoleksi")
          .add({
            imageUrl: data.file,
            uploadedAt: new Date(),
            uploadedBy: displayName, // Simpan siapa yang upload
            email: email, // Simpan email
            profilePicture: photoURL, // Simpan foto profil
          })
          .then((docRef) => {
            console.log("Document written with ID: " + docRef.id);
          })
          .catch((error) => {
            console.log("Error adding document: " + error);
          });
          
})
.catch(error => alert('Error:', error));

}
