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
  const currentUser = auth.currentUser;

  if (currentUser) {
    // Pengguna sudah login

    console.log("Pengguna sudah login:", currentUser);
    // Tampilkan nama
    currentUser.getIdToken().then((token) => {
      // Simpan token ke localStorage
      localStorage.setItem("ptoken", token);
      // Simpan token ke Firebase Realtime Database
      kirimTokenKeDatabase(currentUser);
    });
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
          // console.log("Login berhasil:", userCredential.user);
          $("#rownama").text(storedDisplayName); // Tampilkan nama setelah login
          $("#namauser").text(localStorage.getItem("puserName"));
          $("#ppcard").attr("src", storedPhotoURL);
          // Mendapatkan dan menyimpan token
          userCredential.user.getIdToken().then((token) => {
            kirimTokenKeDatabase(userCredential.user);
            localStorage.setItem("ptoken", token);
          });
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

              // Mendapatkan token dan menyimpannya
              userCredential.user.getIdToken().then((token) => {
                localStorage.setItem("uid", userCredential.user.uid);
                kirimTokenKeDatabase(userCredential.user);
                localStorage.setItem("ptoken", token);
              });
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
// Fungsi untuk menyimpan cookie
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

// Fungsi untuk menyimpan token ke Firebase Realtime Database (dengan pembatasan 30 menit)
function kirimTokenKeDatabase(user) {
  fetchAndSaveVerificationStatus();
  // Cek apakah token sudah disimpan dalam 30 menit terakhir
  const lastRun = getCookie("lastTokenSendTime");
  const now = Date.now();

  if (lastRun && now - parseInt(lastRun) < 30 * 60 * 1000) {
    console.log("Fungsi sudah dijalankan dalam 30 menit terakhir.");
    return; // Jika sudah dalam 30 menit, hentikan eksekusi fungsi
  }

  const database = firebase.database();
  let displayName = localStorage.getItem("puserName");
  let photoURL = localStorage.getItem("puserPhoto");
  const token = generateRandomString(10);

  localStorage.setItem("accessToken", token);
  const tokenData = {
    userId: user.uid,
    email: user.email,
    displayName: displayName,
    photoURL: photoURL,
    accessToken: token,
    timestamp: now,
  };

  // Menyimpan token dengan UID pengguna sebagai key
  database
    .ref(`tokens/${user.uid}`)
    .set(tokenData)
    .then(() => {
      console.log("Akses token disimpan ke Firebase Realtime Database.");
      // Simpan waktu saat fungsi berhasil dijalankan ke cookie
      setCookie("lastTokenSendTime", now, 30); // Cookie disimpan untuk 30 menit
    })
    .catch((error) => {
      console.error("Gagal menyimpan token: " + error.message);
    });
}

// Memicu login atau pembuatan akun ketika halaman di-load atau sesuai kebutuhan
document.addEventListener("DOMContentLoaded", (event) => {
  loginOrCreateAccount(); // Jalankan saat halaman dibuka
});

const apikeyanaq = [
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
const randomIndx = Math.floor(Math.random() * apikeyanaq.length);

// Client ID Imgur (ganti dengan Client ID-mu)
const IMGUR_CLENT_ID = apikeyanaq[randomIndx];

function uploadImage() {
  const file = document.getElementById("profile-image-upload").files[0];
  const preview = document.getElementById("foto");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const reader = new FileReader();

  if (file) {
    // Show the loading spinner
    loadingSpinner.style.display = "block";
    preview.style.opacity = "0.5"; // Dim the image while loading

    // Read the image file as DataURL for local preview
    reader.onloadend = function () {
      preview.src = reader.result; // Show local preview while uploading
    };
    reader.readAsDataURL(file); // Read the file
    var IMGUNT_ID = "f22aac7a4a746bc";
    // Create FormData to send to Imgur
    const formData = new FormData();
    formData.append("image", file);

    // Upload to Imgur using Fetch API
    fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLENT_ID}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const uploadedImageUrl = data.data.link;
        // Hide the spinner after upload
        loadingSpinner.style.display = "none";
        preview.style.opacity = "1"; // Restore image opacity

        // Update image preview with the uploaded image URL
        preview.src = uploadedImageUrl;

        // Save image URL to localStorage (optional)
        localStorage.setItem("puserPhoto", uploadedImageUrl);
        console.log(uploadedImageUrl);
        // Update Firebase user profile with the new photo URL
      })
      .catch((error) => {
        // Hide spinner and restore image if there's an error
        loadingSpinner.style.display = "none";
        preview.style.opacity = "1";
        alert("Error uploading image: " + error.message);
      });
  } else {
    alert("Please select an image to upload.");
  }
}

function uploadImageToImgur(canvas) {
  // Tampilkan spinner
  document.getElementById("loadingSpinner").style.display = "block";

  // Konversi canvas ke Blob untuk upload
  canvas.toBlob(function (blob) {
    const formData = new FormData();
    formData.append("image", blob);

    fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLENT_ID}`, // Ganti dengan Client ID Anda
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const uploadedImageUrl = data.data.link;

        // Update gambar di UI dan simpan ke localStorage
        document.getElementById("foto").src = uploadedImageUrl;
        document.getElementById("ppcard").src = uploadedImageUrl;
        localStorage.setItem("puserPhoto", uploadedImageUrl);

        const user = firebase.auth().currentUser;

        user
          .updateProfile({
            photoURL: uploadedImageUrl,
          })
          .then(() => {
            console.log("User profile updated successfully.");
            alert("Profile photo updated!");
          })
          .catch((error) => {
            console.error("Error updating profile:", error);
          });
        // Sembunyikan spinner
        document.getElementById("loadingSpinner").style.display = "none";
        alert("Foto profil berhasil diperbarui!");
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        alert("Error uploading image: " + error.message);
        document.getElementById("loadingSpinner").style.display = "none";
      });
  }, "image/jpeg");
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
