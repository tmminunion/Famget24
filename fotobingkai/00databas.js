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

// Set persistence to LOCAL so the session will survive browser closure
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    // Setelah persistence diatur, login anonim bisa dilakukan
    loginAnonymously();
  })
  .catch((error) => {
    // Handle error if setting persistence fails
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error("Error " + errorCode + ": " + errorMessage);
  });

// Fungsi login anonim (tetap sama seperti sebelumnya)
function loginAnonymously() {
  firebase.auth().signInAnonymously()
    .then((userCredential) => {
      var user = userCredential.user;
      console.log("User ID (Anonymous):", user.uid);
      alert("Login berhasil sebagai pengguna anonim!");

      // Meminta pengguna mengisi nama dengan prompt
      const username = window.prompt("Masukkan nama atau username Anda:");

      if (username && username.trim() !== "") {
        saveUsernameToFirestore(user.uid, username.trim());
      } else {
        alert("Anda harus memasukkan nama yang valid!");
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Error " + errorCode + ": " + errorMessage);
    });
}

// Fungsi menyimpan username ke Firestore (sama seperti sebelumnya)
function saveUsernameToFirestore(uid, username) {
  const db = firebase.firestore();

  db.collection("users").doc(uid).set({
    username: username
  })
  .then(() => {
    console.log("Username berhasil disimpan di Firestore.");
    alert("Username berhasil disimpan.");
  })
  .catch((error) => {
    console.error("Error menyimpan username: ", error);
  });
}
// Fungsi untuk sign in dengan Google
function signInWithGoogle() {
  auth
    .signInWithPopup(googleProvider)
    .then((result) => {
      var user = result.user;
      console.log(user);

      // Simpan informasi pengguna ke localStorage
      localStorage.setItem("displayName", user.displayName);
      localStorage.setItem("email", user.email);
      localStorage.setItem("photoURL", user.photoURL);
      localStorage.setItem("uid", user.uid); // Simpan UID pengguna

      // Tampilkan informasi pengguna
      updateUIAfterLogin(user);
    })
    .catch((error) => {
      console.error("Error during sign in:", error);
    });
}

// Fungsi untuk memperbarui UI setelah login
function updateUIAfterLogin(user) {
  if (user) {
    googleSignInBtn.style.display = "none"; // Sembunyikan tombol login
    $("#rownama").text(user.displayName); // Tampilkan nama pengguna di UI

    // Simpan informasi pengguna ke localStorage
    localStorage.setItem("displayName", user.displayName);
    localStorage.setItem("email", user.email);
    localStorage.setItem("photoURL", user.photoURL);
    localStorage.setItem("uid", user.uid); // Simpan UID pengguna

    console.log("User Display Name: ", user.displayName);
    console.log("User Email: ", user.email);
    console.log("User Photo URL: ", user.photoURL);
    console.log("User UID: ", user.uid); // Tambahkan log UID pengguna
  }
}

// Cek status login pengguna
auth.onAuthStateChanged((user) => {
  if (user) {
    // Pengguna sudah login
    console.log("User is logged in:", user);
    kirimOnline(user);
    // Periksa apakah login melalui Google
    var isGoogleProvider = user.providerData.some(
      (provider) => provider.providerId === "google.com"
    );

    if (isGoogleProvider) {
      // Pengguna login melalui Google
      updateUIAfterLogin(user);
    } else {
      // Jika bukan login dari Google, bisa tambahkan logika lain atau logout
      console.log("User is not logged in using Google. Logging out...");
      auth.signOut(); // Logout otomatis jika diperlukan
    }
  } else {
    // Pengguna belum login, trigger popup login Google secara otomatis
    console.log("No user is signed in. Triggering Google sign-in...");
    googleSignInBtn.style.display = "block"; // Sembunyikan tombol login
    // Langsung jalankan fungsi sign-in seolah-olah tombol diklik
  //  signInWithGoogle();
  }
});

// Initialize Realtime Database
const database = firebase.database();

function kirimOnline(user) {
  // Mempersiapkan data pengguna yang ingin disimpan
  const userData = {
    user: user.uid,
    email: user.email,
    displayName: user.displayName, // Username
    photoURL: user.photoURL, // Foto profil, jika diperlukan
  };

  // Set data pengguna ke database dengan UID sebagai key
  database
    .ref(`FAMGETuser/${user.uid}`) // Menggunakan UID sebagai key
    .set(userData) // Simpan userData ke database
    .then(() => {
      console.log(
        "User data saved to Firebase Realtime Database with UID as key"
      );
    })
    .catch((error) => {
      console.log("Error saving user data: " + error.message);
    });
}

function kirimdata(base64Imagena) {
  const apikeyana = [
    "025ba3ace62a66d",
    "082eb55cc144305",
    "70519e36199385e",
    "8d04e5606260801",
    "a692f82b1aced47",
    "b4b4301cdb7c9c8",
    "7c0326461ff3839",
    "f22aac7a4a746bc",
    "de75765ef3b4199",
  ];
  const randomIndex = Math.floor(Math.random() * apikeyana.length);
  const clientId = apikeyana[randomIndex]; // Ganti dengan Client ID kamu

  // Pisahkan base64 menjadi data biner (tanpa header MIME)
  const base64Image = base64Imagena.split(",")[1];
  const displayName = localStorage.getItem("displayName");
  const email = localStorage.getItem("email");
  const photoURL = localStorage.getItem("photoURL"); // Ambil URL foto profil
  const Userid = localStorage.getItem("uid"); // Ambil URL foto profil
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Client-ID " + clientId);

  var formdata = new FormData();
  formdata.append("image", base64Image);
  formdata.append("type", "base64");
  formdata.append("title", "Image upload by " + displayName); // Gunakan displayName sebagai judul
  formdata.append("description", `Uploaded by ${displayName}`); // Gunakan displayName, email, dan photoURL di deskripsi

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  fetch("https://api.imgur.com/3/upload", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        console.log("Image uploaded successfully: ", result.data.link);

        // Simpan URL gambar ke Firestore
        db.collection("imageskoleksi")
          .add({
            id: result.data.id,
            imageUrl: result.data.link,
            title: result.data.title,
            height: result.data.height,
            width: result.data.width,
            deletehash: result.data.deletehash,
            datetime: result.data.datetime,
            description: result.data.description,
            uploadedAt: new Date(),
            Userid: Userid,
            love: 0,
            uploadedBy: displayName, // Simpan siapa yang upload
            email: email, // Simpan email
            profilePicture: photoURL, // Simpan foto profil
          })
          .then((docRef) => {
            $("#barload").hide();
            $("#modfinis").html(
              "Upload ke server selesai...!!<br>silahkan upload foto lainnya"
            );

            $("#modfinis").show();
          })
          .catch((error) => {
            console.log("Error adding document: " + error);
          });
      } else {
        alert("Image upload failed: ", result);
      }
    })
    .catch((error) => {
      alert("Error uploading image to Imgur: ", error);
    });
}

function kirimdataa(base64Imagena) {
  // Pisahkan base64 menjadi data biner (tanpa header MIME)
  const base64Image = base64Imagena.split(",")[1];
  const displayName = localStorage.getItem("displayName");
  const email = localStorage.getItem("email");
  const photoURL = localStorage.getItem("photoURL"); // Ambil URL foto profil

  // Kirim menggunakan fetch
  fetch("https://twibone.bungtemin.net/dodol.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image }),
  })
    .then((response) => response.json())
    .then((data) => {
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
          $("#barload").hide();
          $("#modfinis").html(
            "Upload ke server selesai...!!<br>silahkan upload foto lainnya"
          );

          $("#modfinis").show();
        })
        .catch((error) => {
          console.log("Error adding document: " + error);
        });
    })
    .catch((error) => alert("Error:", error));
}

// Panggil fungsi ini untuk mengambil halaman pertama
document.getElementById("googleSignInBtn").onclick = function () {
  // Fungsi yang akan dijalankan saat tombol diklik
  console.log("Google Sign-In button clicked!");

  // Contoh implementasi login Google, bisa disesuaikan
  signInWithGoogle();
};
