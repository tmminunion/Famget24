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
    alert("lo5gin_");
    console.log("Pengguna sudah login:", currentUser);
    // Tampilkan nama
    currentUser.getIdToken().then((token) => {
      // Simpan token ke localStorage
      localStorage.setItem("accessToken", token);
      // Simpan token ke Firebase Realtime Database
      kirimTokenKeDatabase(currentUser, token);
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
          console.log("Login berhasil:", userCredential.user);
          $("#rownama").text(storedDisplayName); // Tampilkan nama setelah login
          $("#namauser").text(localStorage.getItem("puserName"));
          // Mendapatkan dan menyimpan token
          userCredential.user.getIdToken().then((token) => {
            localStorage.setItem("accessToken", token);
            kirimTokenKeDatabase(userCredential.user, token);
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

              // Mendapatkan token dan menyimpannya
              userCredential.user.getIdToken().then((token) => {
                localStorage.setItem("accessToken", token);
                localStorage.setItem("uid", userCredential.user.uid);
                kirimTokenKeDatabase(userCredential.user, token);
              });

              kirimOnline(userCredential.user); // Kirim data ke database
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

// Fungsi untuk menyimpan token ke Firebase Realtime Database
function kirimTokenKeDatabase(user, token) {
  const database = firebase.database();
  // Cek localStorage untuk nama dan foto profil
  let displayName = localStorage.getItem("puserName");
  let photoURL = localStorage.getItem("puserPhoto");
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

document.getElementById("uploadButton").addEventListener("click", function () {
  const imageInput = document.getElementById("imageInput").files[0];

  if (imageInput) {
    // Buat FormData untuk mengirim gambar ke Imgur
    const formData = new FormData();
    formData.append("image", imageInput);

    // Mengirim permintaan POST ke Imgur API
    fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLENT_ID}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const imageUrl = data.data.link;

          // Perbarui gambar di localStorage
          localStorage.setItem("puserPhoto", imageUrl);

          // Perbarui gambar di Firebase Authentication
          const user = firebase.auth().currentUser;
          user
            .updateProfile({
              photoURL: imageUrl,
            })
            .then(() => {
              console.log("Foto profil berhasil diperbarui di Firebase.");

              // Perbarui gambar di halaman
              document.getElementById("ppcard").src = imageUrl;

              // Tutup modal
              var modalElement = document.getElementById("uploadModal");
              var modal = new ootstrap.Modal.getInstance(modalElement);
              modal.hide();

              alert("Foto profil berhasil diunggah dan diperbarui!");
            })
            .catch((error) => {
              console.error(
                "Gagal memperbarui foto profil di Firebase:",
                error
              );
            });
        } else {
          console.error("Gagal mengunggah ke Imgur:", data);
          alert("Gagal mengunggah gambar. Coba lagi.");
        }
      })
      .catch((error) => {
        console.error("Error saat mengunggah gambar:", error);
      });
  } else {
    alert("Pilih gambar terlebih dahulu!");
  }
});

// Inisialisasi modal secara manual jika perlu (Bootstrap 5)
var uploadModal = new bootstrap.Modal(document.getElementById("uploadModal"), {
  keyboard: false,
});

// Menambahkan event listener untuk membuka modal saat gambar diklik (backup)
document.getElementById("ppcard").addEventListener("click", function () {
  uploadModal.show();
});


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
var IMGUNT_ID="f22aac7a4a746bc";
    // Create FormData to send to Imgur
    const formData = new FormData();
    formData.append("image", file);

    // Upload to Imgur using Fetch API
    fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUNT_ID}`,
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

        // Update Firebase user profile with the new photo URL
        const user = firebase.auth().currentUser;
        if (user) {
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
        } else {
          alert("No user is signed in.");
        }
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
