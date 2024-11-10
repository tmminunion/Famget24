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

// Fungsi untuk generate string acak
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Fungsi untuk login atau membuat akun baru
function loginOrCreateAccount() {
  // Cek apakah pengguna sudah login
  const currentUser = firebase.auth().currentUser;

  if (currentUser) {
    // Pengguna sudah login
    console.log("Pengguna sudah login:", currentUser);
    $("#rownama").text(localStorage.getItem("puserName")); // Tampilkan nama
    kirimTokenKeDatabase(currentUser);
  } else {
    // Pengguna belum login, cek di localStorage untuk email dan password
    let storedEmail = localStorage.getItem("puserEmail");
    let storedPassword = localStorage.getItem("puserPassword");
    let storedDisplayName = localStorage.getItem("puserName");
    let storedPhotoURL = localStorage.getItem("puserPhoto");

    if (storedEmail && storedPassword) {
      // Jika email dan password ada di localStorage, lakukan login
      firebase
        .auth()
        .signInWithEmailAndPassword(storedEmail, storedPassword)
        .then((userCredential) => {
          // Login berhasil
          console.log("Login berhasil:", userCredential.user);
          $("#rownama").text(storedDisplayName); // Tampilkan nama setelah login
          kirimTokenKeDatabase(userCredential.user);
          // Mendapatkan dan menyimpan token
        })
        .catch((error) => {
          console.error("Error saat login:", error.message);
          alert("Login gagal: " + error.message);
        });
    } else {
      // Jika email dan password belum ada, generate yang baru
      let randomEmail = generateRandomString(10) + "@fm5get.com"; // Email acak
      let randomPassword = generateRandomString(12); // Password acak
      let displayName = window.prompt("Masukkan nama Anda:"); // Prompt untuk nama
      let photoURL =
        "https://leocosta1.github.io/instagram-clone/assets/default-user.png"; // URL foto profil default

      if (!displayName) {
        alert("Nama harus diisi!");
        return;
      }

      // Buat akun baru dengan email dan password acak
      firebase
        .auth()
        .createUserWithEmailAndPassword(randomEmail, randomPassword)
        .then((userCredential) => {
          // Akun berhasil dibuat
          console.log("Akun berhasil dibuat:", userCredential.user);
          alert("Akun baru berhasil dibuat dengan email: " + randomEmail);

          // Simpan email, password, dan nama ke localStorage
          localStorage.setItem("puserEmail", randomEmail);
          localStorage.setItem("puserPassword", randomPassword);
          localStorage.setItem("puserName", displayName);
          localStorage.setItem("puserPhoto", photoURL); // Simpan URL foto default

          // Perbarui profil pengguna di Firebase dengan nama dan foto profil
          userCredential.user
            .updateProfile({
              displayName: displayName,
              photoURL: photoURL,
            })
            .then(() => {
              console.log("Profil pengguna berhasil diperbarui.");
              $("#rownama").text(displayName); // Tampilkan nama setelah membuat akun
              localStorage.setItem("uid", userCredential.user.uid);
              kirimTokenKeDatabase(userCredential.user);
              // Mendapatkan token dan menyimpannya
            })
            .catch((error) => {
              console.error("Error saat memperbarui profil:", error.message);
            });
        })
        .catch((error) => {
          console.error("Error saat membuat akun:", error.message);
        });
    }
  }
}
function setCookie(name, value, minutes) {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Fungsi untuk mendapatkan nilai cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}
// Fungsi untuk menyimpan token ke Firebase Realtime Database
function kirimTokenKeDatabase(user) {
  const lastRun = getCookie("lastTokenSendTime");
  const now = Date.now();
  fetchAndSaveVerificationStatus();
  if (lastRun && now - parseInt(lastRun) < 30 * 60 * 1000) {
    console.log("Fungsi sudah dijalankan dalam 30 menit terakhir.");
    return; // Jika sudah dalam 30 menit, hentikan eksekusi fungsi
  }

  const database = firebase.database();
  // Cek localStorage untuk nama dan foto profil
  let displayName = localStorage.getItem("puserName");
  let photoURL = localStorage.getItem("puserPhoto");
  var token = generateRandomString(10);
  localStorage.setItem("accessToken", token);
  const tokenData = {
    userId: user.uid,
    email: user.email,
    displayName: displayName, // Username dari localStorage
    photoURL: photoURL,
    accessToken: token,
    timestamp: Date.now(),
  };

  // Menyimpan token dengan UID pengguna sebagai key
  database
    .ref(`tokens/${user.uid}`)
    .set(tokenData)
    .then(() => {
      console.log("Akses token disimpan ke Firebase Realtime Database.");
    })
    .catch((error) => {
      console.error("Gagal menyimpan token: " + error.message);
    });
}

// Memicu login atau pembuatan akun ketika halaman di-load atau sesuai kebutuhan
document.addEventListener("DOMContentLoaded", (event) => {
  loginOrCreateAccount(); // Jalankan saat halaman dibuka
});

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
  const displayName = localStorage.getItem("puserName");
  const email = localStorage.getItem("puserEmail");
  const photoURL = localStorage.getItem("puserPhoto"); // Ambil URL foto profil
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

function fetchAndSaveVerificationStatus() {
  // Mengambil UID dari localStorage
  const uid = localStorage.getItem("uid");

  if (uid) {
    // URL API dengan UID yang diambil dari localStorage
    const apiUrl = `https://api.bungtemin.net/FamgetAbsensi/GetVeridata/${uid}`;

    // Mem-fetch data dari API
    fetch(apiUrl)
      .then((response) => response.json()) // Mengkonversi response ke JSON
      .then((data) => {
        if (data.status === "success" && data.data && data.data.is_verified) {
          // Mengambil nilai is_verified
          const isVerified = data.data.is_verified;

          // Menyimpan nilai is_verified di localStorage dengan nama 'verifikasiaku'
          localStorage.setItem("verifikasiaku", isVerified);

          // Menampilkan hasil di console
          console.log("Verifikasi status disimpan:", isVerified);
        } else {
          console.log(
            "Data verifikasi tidak ditemukan atau terjadi kesalahan."
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  } else {
    console.log("UID tidak ditemukan di localStorage.");
  }
}
