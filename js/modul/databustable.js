function populateTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  data.forEach(function (user, index) {
    // Buat random status (oke atau cross)
    const isPresent = Math.random() > 0.5; // 50% chance between true (oke) and false (cross)

    // Pilih icon dan warna berdasarkan status
    const icon = user.hadir
      ? "<i class='fa fa-check-circle' style='font-size:20px;color:green'></i>"
      : "<i class='fa fa-times-circle' style='font-size:20px;color:red'></i>";

    // Waktu hanya ditampilkan jika status "oke"
    const waktu = user.hadir ? user.waktu : "";

    // Create a new row and append to the table
    const newRow = document.createElement("tr");
    newRow.innerHTML =
      `<td class='text-right'>${index + 1}</td>` + // Menampilkan index (dimulai dari 1)
      `<td>${user.nama}</td>` +
      `<td class='text-center'>${user.jumlah}</td>` +
      `<td>${user.seat}</td>` +
      `<td class='text-center'>${icon}</td>` +
      `<td class='text-center'>${waktu}</td>` +
      `<td class='text-center'>${user.keterangan}</td>`;
    tbody.appendChild(newRow);
  });

  // Hide preloader
  document.getElementById("preloader").style.display = "none";
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
