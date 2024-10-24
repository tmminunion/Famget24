import {updateSeatsFromArray} from "./allfungction.js";

function populateTable(datak) {
  const tbody = document.querySelector("#dataTable tbody");
  const data = datak.data;
  
  tbody.innerHTML='';
  data.forEach(function (user, index) {
    // Buat random status (oke atau cross)
    const isPresent = Math.random() > 0.5; // 50% chance between true (oke) and false (cross)

    // Pilih icon dan warna berdasarkan status
    const icon = user.Hadir
      ? "<i class='fa fa-check-circle' style='font-size:20px;color:green'></i>"
      : "<i class='fa fa-times-circle' style='font-size:20px;color:red'></i>";

    // Waktu hanya ditampilkan jika status "oke"
    const waktu = user.Hadir ? user.DateAbsensi : "";
const keterangan = user.Hadir?"Oke":"Not";
    // Create a new row and append to the table
    const newRow = document.createElement("tr");
    newRow.innerHTML =
      `<td class='text-right'>${index + 1}</td>` + // Menampilkan index (dimulai dari 1)
      `<td>${user.Nama}</td>` +
      `<td class='text-center'>${user.TotalPeserta}</td>` +
      `<td>${user.BusSeat}</td>` +
      `<td class='text-center'>${icon}</td>` +
      `<td class='text-center'>${waktu}</td>` +
      `<td class='text-center'>${keterangan}</td>`;
    tbody.appendChild(newRow);
    
    
if (user.Hadir == "1"){

updateSeatsFromArray(user.BusSeat);
}
  });
  
  // Hide preloader
  document.getElementById("preloader").style.display = "none";
}

// Fungsi untuk mengambil data dari API
function fetchDataFromAPI(sheetName, Acara ) {
  // Mengembalikan Promise dari hasil fetch
const apiUrlBase = "https://api.bungtemin.net/FamgetAbsensi/Getabsen";
  return fetch(`${apiUrlBase}/${sheetName}/${Acara}`)
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

export function getData(sheetName, acara) {
  

  // Use the modular fetch function to get data from API
  fetchDataFromAPI(sheetName, acara)
    .then((data) => {
      // Populate table with the data
      populateTable(data);
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
    });
}
