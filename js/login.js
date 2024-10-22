import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import { firebaseConfig } from "./modul/FirebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Pengguna sudah login
    const uid = user.uid;
    // Sembunyikan form login
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("loginForm2").style.display = "block";
    localStorage.setItem("userEmail", user.email); // Menyimpan email pengguna
  
  } else {
    // Pengguna belum login
    console.log("User not logged in");
    // Tampilkan form login jika perlu
          localStorage.removeItem("userEmail");
      localStorage.removeItem("userUID");
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("loginForm2").style.display = "none";
  }
});

function login() {
  console.log("login");
  const emailna = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const email = emailna + "@nufat.id";


  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("login masuk");
      const user = userCredential.user;
      // Simpan data pengguna di localStorage
      localStorage.setItem("userEmail", user.email); // Menyimpan email pengguna
      // Redirect ke halaman utama
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("login tak masuk");
      document.getElementById("errorMessage").innerText =
        "Email atau Password Salah";
      $("#errorModal").modal("show"); // Menampilkan modal
    });
}

function logout() {
  signOut(auth)
    .then(() => {
      console.log("User logged out");
      // Hapus data pengguna dari localStorage
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userUID");

      // Redirect ke halaman login atau melakukan tindakan lain
      window.location.href = "login.html"; // Ganti dengan halaman login
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
}
window.login = login;

window.logout = logout;
