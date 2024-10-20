document.addEventListener("DOMContentLoaded", () => {
  const userEmail = localStorage.getItem("userEmail");

  if (userEmail) {
    // Pengguna sudah login, bisa melakukan sesuatu seperti mengalihkan ke dashboard
    console.log("User sudah login:", userEmail);
    // Misalnya, bisa redirect ke halaman dashboard
  } else {
    console.log("User belum login");
    window.location.href = "login.html"; // Ganti dengan halaman yang sesuai
  }
});
