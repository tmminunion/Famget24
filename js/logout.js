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

logout();
