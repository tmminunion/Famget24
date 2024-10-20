function populateTable(data) {
  const tbody = document.querySelector("#dataTable tbody");

  // Urutkan data berdasarkan status kehadiran
  const sortedData = data.sort((a, b) => a.hadir - b.hadir);

  sortedData.forEach(function (user, index) {
    // Pilih icon dan warna berdasarkan status kehadiran
    const icon = user.hadir
      ? "<i class='fa fa-check-circle' style='font-size:20px;color:green'></i>"
      : "<i class='fa fa-times-circle' style='font-size:20px;color:red'></i>";

    // Pilih warna tombol berdasarkan status kehadiran
    const btnClass = user.hadir ? "btn-primary" : "btn-danger";

    // Buat baris baru dan tambahkan ke tabel
    const newRow = document.createElement("tr");
    newRow.innerHTML =
      `<td class='text-right'>${index + 1}</td>` +
      `<td class='text-center'>
          <a href="javascript:void(0);" 
             class="btn ${btnClass} btn-sm" 
             onclick="updateStatus(${user.id}, ${!user.hadir})">Check In</a>
       </td>` + // Tombol dengan kelas sesuai status
      `<td>${user.nama}</td>` +
      `<td class='text-center'>${user.jumlah}</td>` +
      `<td>${user.seat}</td>` +
      `<td class='text-center'>${icon}</td>`;

    tbody.appendChild(newRow);
  });

  // Hide preloader
  document.getElementById("preloader").style.display = "none";
}

// Fungsi untuk mengupdate status kehadiran
function updateStatus(userId, newStatus) {
  const apiUrl = `https://api.bungtemin.net/FamgetAbsensi/Absenbus/${userId}`;

  // Siapkan data yang akan dikirim (misalnya user id dan status baru)
  const data = {
    hadir: newStatus, // Status kehadiran yang baru
  };

  // Kirim data menggunakan metode PUT atau POST ke API
  fetch(apiUrl, {
    method: "POST", // Anda juga bisa menggunakan POST jika lebih cocok
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((updatedUser) => {
      // Tampilkan pesan sukses atau refresh data tabel
      console.log("Status updated:", updatedUser);
      // Bisa langsung fetch ulang data dari API atau update secara lokal
      location.reload(); // Muat ulang halaman untuk menampilkan perubahan
    })
    .catch((error) => {
      console.error("Error updating status:", error);
    });
}

// Fungsi untuk mengambil data dari API
function fetchDataFromAPI(sheetName, apiUrlBase) {
  // Mengembalikan Promise dari hasil fetch
  return fetch(`${apiUrlBase}?sheet=${sheetName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error: ", error);
      throw error;
    });
}

export function getData(sheetName) {
  const apiUrlBase = "https://api.bungtemin.net/FamgetAbsensi/Absenbus";

  // Use the modular fetch function to get data from API
  fetchDataFromAPI(sheetName, apiUrlBase)
    .then((data) => {
      // Populate table with the data
      populateTable(data);
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
    });
}

window.updateStatus = updateStatus;
