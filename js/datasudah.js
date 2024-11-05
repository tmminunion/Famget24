import { listacara } from "./modul/listacara.js";
import { updateProgressBar } from "./modul/progress.js";
import { getPar, updateSeatsFromArray } from "./modul/allfungction.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { firebaseConfig } from "./modul/FirebaseConfig.js";
import { getDataALLsudah } from "./modul/databustable.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const Acara = getPar("acara") || localStorage.getItem("absensi");
const NamaBus = getPar("bus") || 1; // Ambil parameter bus, default ke 1 jika tidak ada

// Ubah teks sesuai dengan nilai NamaBus
if (NamaBus == 0) {
    document.getElementById("manifest").textContent = "Daftar Peserta yang Belum Absensi";
} else if (NamaBus == 1) {
    document.getElementById("manifest").textContent = "Daftar Peserta yang Sudah Absensi";
} else {
    document.getElementById("manifest").textContent = "Absensi Peserta"; // Default teks jika bus tidak 0 atau 1
}
document.getElementById("preloader").style.display = "block";
if (Acara >= 0 && Acara < listacara.length) {
  document.getElementById("judulna").textContent = listacara[Acara];
  document.getElementById("judulna2").textContent = listacara[Acara];

  const busLinksContainer = document.getElementById("bus-links");
  
  // Update link href secara dinamis
  const sudahLink = document.getElementById('sudahlink');
  const belumLink = document.getElementById('belumlink');

  sudahLink.href = `absensibus_sudah.html?acara=${Acara}&bus=1`; // bus=1 untuk 'sudah'
  belumLink.href = `absensibus_sudah.html?acara=${Acara}&bus=0`; // bus=0 untuk 'belum'


} else {
  document.getElementById("judulna").textContent = "Acara tidak ditemukan.";
}

const starCountRef = ref(db, "Famgetabsensi/" + Acara );

onValue(starCountRef, (snapshot) => {
 
  getDataALLsudah(NamaBus, Acara);
  
fetchAbsensiData(Acara);
});


function generateTable(acaraCount, tableId) {
    const tableRow = document.querySelector(`#${tableId} tr`); // Cari tabel berdasarkan ID
    const bus = getPar("bus") || 1;
    for (let i = 1; i <= acaraCount; i++) {
        const td = document.createElement('td');
        td.id = `acara-${i}`;
        td.className = 'pastel-box';

        const a = document.createElement('a');
        a.href = `absensibus_sudah.html?acara=${i}&bus=${bus}`;
        a.textContent = i;

        td.appendChild(a);
        tableRow.appendChild(td);
    }
}

// Panggil fungsi untuk tabel yang berbeda
generateTable(8, 'tabelAcara1');

function fetchAbsensiData(ke) {
    // URL dinamis sesuai dengan nilai ke
    const url = `https://api.bungtemin.net/FamgetAbsensi/resumeALL/${ke}`;

    // Menggunakan fetch untuk menarik data dari API
    fetch(url)
        .then(response => {
            // Memeriksa apakah respons berhasil
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Mengembalikan data dalam format JSON
        })
        .then(data => {
            // Menampilkan data di console (opsional)
            console.log('Total Sudah Hadir:', data.total_sudah);
            console.log('Total Belum Hadir:', data.total_belum);

            // Menghitung total dan persentase
            var totalSudah = data.total_sudah;
            var totalBelum = data.total_belum;
            var alltot = totalSudah + totalBelum;
            var allpresentasi = (totalSudah / alltot) * 100;

            // Menampilkan hasil di elemen HTML
            document.getElementById("absentotal").textContent = alltot;
            document.getElementById("data_masuk").textContent = totalSudah;
            document.getElementById("data_belum").textContent = totalBelum;
            document.getElementById("data_persen").textContent = allpresentasi.toFixed(0) + "%";
        })
        .catch(error => {
            // Menangani error
            console.error('There was a problem with the fetch operation:', error);
        });
}



