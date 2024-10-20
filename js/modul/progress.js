export function updateProgressBar(percentage) {
  // Pastikan nilai persentase ada di antara 0 dan 100
  console.log("data masuk ==> ", percentage);
  percentage = parseInt(percentage);
  // Pastikan nilai persentase ada di antara 0 dan 100
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  // Ambil elemen progress bar
  const progressBar = document.getElementById("progressBar");

  // Perbarui properti width sesuai persentase
  progressBar.style.width = percentage + "%";

  // Perbarui nilai aria-valuenow untuk aksesibilitas
  progressBar.setAttribute("aria-valuenow", percentage);

  // Reset class agar bisa memperbarui warna
  progressBar.classList.remove("bg-danger", "bg-warning", "bg-success");

  // Tentukan warna berdasarkan persentase
  if (percentage < 50) {
    progressBar.classList.add("bg-danger"); // Merah jika kurang dari 50%
  } else if (percentage >= 50 && percentage <= 80) {
    progressBar.classList.add("bg-warning"); // Kuning jika antara 50% dan 80%
  } else {
    progressBar.classList.add("bg-success"); // Hijau jika lebih dari 80%
  }
}
