document.addEventListener("DOMContentLoaded", () => {
  const userEmail = localStorage.getItem("userEmail");

  if (userEmail) {
    // Cek apakah email berakhiran dengan @nufat.id
    if (userEmail.endsWith("@nufat.id")) {
      console.log("User sudah login:", userEmail);
      // Pengguna bisa melanjutkan ke dashboard
      // Misalnya, bisa redirect ke halaman dashboard
    } else {
      console.log("Email tidak valid. Melakukan logout...");
      // Jika tidak, logout pengguna
      window.location.href = "logout.html"; // Ganti dengan halaman login
    }
  } else {
    console.log("User belum login");
    // Redirect ke halaman login jika belum login
    window.location.href = "login.html"; // Ganti dengan halaman yang sesuai
  }
});
