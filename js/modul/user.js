
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { firebaseConfig } from "./FirebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUserUid = null;

// Fungsi untuk mendapatkan UID pengguna saat ini
const getUserUid = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUserUid = user.uid; // Simpan UID pengguna
        resolve(currentUserUid);
      } else {
        reject("No user is currently signed in.");
      }
    });
  });
};


// Ekspor fungsi getUserUid
export { getUserUid };