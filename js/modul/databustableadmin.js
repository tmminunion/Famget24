import { getUserUid } from "./user.js";
import { updateSeatsFromArray, updateBadge } from "./allfungction.js";
function populateTable(datak) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = ""; // Clear existing content

  var data = datak.data;
  // Urutkan data berdasarkan status kehadiran
  const sortedData = data.sort((a, b) => a.Hadir - b.Hadir);

  sortedData.forEach(function (user, index) {
    // Pilih icon dan warna berdasarkan status kehadiran
    const icon = user.Hadir
      ? "<i class='fa fa-check-circle' style='font-size:20px;color:green'></i>"
      : "<i class='fa fa-times-circle' style='font-size:20px;color:red'></i>";

    // Pilih warna tombol berdasarkan status kehadiran
    const btnClass = user.Hadir ? "btn-primary" : "btn-danger";
    const namabut = user.Hadir ? "Reset" : "Check In";
    updateBadge(user.Nama, user.BusSeat);
    // Buat baris baru dan tambahkan ke tabel
    const newRow = document.createElement("tr");
    newRow.innerHTML =
      `<td class='text-right'>${index + 1}</td>` +
      `<td class='text-center'>
          <a href="javascript:void(0);" 
             class="btn ${btnClass} btn-sm" 
             onclick="updateStatus(${user.id}, ${user.Acara}, ${user.BusNo})">${namabut}</a>
       </td>` + // Tombol dengan kelas sesuai status
      `<td>${user.Nama}</td>` +
      `<td class='text-center'>${user.TotalPeserta}</td>` +
      `<td>${user.BusSeat}</td>` +
      `<td class='text-center'>${icon}</td>`;

    tbody.appendChild(newRow);

    if (user.Hadir == "1") {
      updateSeatsFromArray(user.BusSeat);
    }
    // Hide preloader
  });
  document.getElementById("preloader").style.display = "none";
}

// Fungsi untuk mengupdate status kehadiran
function updateStatus(userId, acara, bus) {
  const apiUrl = `https://api.bungtemin.net/FamgetAbsensi/PostAbsenbus/${bus}/${acara}`;

  getUserUid()
    .then((uid) => {
      const data = {
        userId: userId,
        acara: acara,
        bus: bus,
        UID: uid,
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
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((updatedUser) => {
          // Tampilkan pesan sukses atau refresh data tabel
          console.log("Status updated:", updatedUser);

          // location.reload();
        })
        .catch((error) => {
          console.error("Error updating status:", error);
          console.log("eror -- ", data);
          updateStatusWithIframe(userId, acara, bus);
        });
    })
    .catch((error) => {
      console.error("Error fetching user UID:", error);
      window.alert(error);
    });
}

function updateStatusWithIframe(userId, acara, bus) {
  const apiUrl = `https://api.bungtemin.net/FamgetAbsensi/PostAbsenbus/${bus}/${acara}`;

  getUserUid()
    .then((uid) => {
      // Buat iframe secara dinamis
      const iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Buat form secara dinamis
      const form = document.createElement("form");
      form.method = "POST"; // Atau sesuai metode yang diperlukan
      form.action = apiUrl;
      form.target = "hidden_iframe";

      // Tambahkan data sebagai input ke form
      const inputs = {
        userId: userId,
        acara: acara,
        bus: bus,
        UID: uid,
      };

      for (const key in inputs) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = inputs[key];
        form.appendChild(input);
      }

      // Tambahkan form ke DOM dan submit
      document.body.appendChild(form);
      form.submit();

      // Bersihkan form dan iframe setelah submit
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        console.log("Form submitted via iframe.");
      }, 2000); // Tunggu hingga submit selesai
    })
    .catch((error) => {
      console.error("Error fetching user UID:", error);
      window.alert(error);
    });
}

// Fungsi untuk mengambil data dari API
function fetchDataFromAPI(sheetName, acara) {
  const apiUrlBase = "https://api.bungtemin.net/FamgetAbsensi/adminGetabsen";
  // Mengembalikan Promise dari hasil fetch
  return fetch(`${apiUrlBase}/${sheetName}/${acara}`)
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

function fetchDataFromAPIba(sheetName, acara) {
  const apiUrlBase = "https://nextfire-two-ruby.vercel.app/api/admingetabsen";
  // Mengembalikan Promise dari hasil fetch
  return fetch(`${apiUrlBase}/${sheetName}/${acara}`)
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

export function getData(sheetName, apiUrlBase) {
  // Use the modular fetch function to get data from API
  fetchDataFromAPI(sheetName, apiUrlBase)
    .then((data) => {
      // Populate table with the data
      populateTable(data);
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
      fetchDataFromAPIba(sheetName, apiUrlBase)
        .then((data) => {
          // Populate table with the data
          populateTable(data);
        })
        .catch((error) => {
          console.error("An error occurred: ", error);
        });
    });
}

window.updateStatus = updateStatus;
