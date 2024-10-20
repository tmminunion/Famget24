// Import the functions you need from the SDKs you need
import { listacara } from "./modul/listacara.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { firebaseConfig } from "./modul/FirebaseConfig.js";
import { getPar } from "./modul/allfungction.js";
import { fetchData } from "./modul/fetchData.js";
import { fetchDataline } from "./modul/grafikLine.js";
import { updateChart, updateDonutChart } from "./modul/grafikbus.js";
import { updateProgressBar } from "./modul/progress.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get a reference to the database path
const Acara = getPar("acara") || 1;
const starCountRef = ref(db, "Famgetabsensi/" + Acara);
if (Acara >= 0 && Acara < listacara.length) {
  document.getElementById("judulna").textContent = listacara[Acara];
  document.getElementById("judulna2").textContent = listacara[Acara];
} else {
  document.getElementById("judulna").textContent = "Acara tidak ditemukan.";
}

// Ambil data dari Firebase dan tampilkan di tabel
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  const dataBody = document.getElementById("dataBody");
  dataBody.innerHTML = ""; // Hapus konten lama sebelum menambah data baru

  // Iterasi data dari Firebase
  let counter = 1; // Variabel untuk nomor urut
  const hadirData = [];
  const tidakHadirData = [];
  let totalSudah = 0;
  let totalBelum = 0;
  // Iterasi data dari Firebase dan pisahkan "hadir" dan "tidak hadir"
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      var ysudah = parseInt(data[key].Sudah);
      var ybelum = parseInt(data[key].Belum);
      var totalnt = ybelum + ysudah;
      var hadir = (ysudah / totalnt) * 100;
      var hadirnya = parseInt(hadir);
      var tidakHadir = 100 - hadirnya;
      hadirData.push(hadirnya);
      tidakHadirData.push(tidakHadir);
      totalSudah += parseInt(data[key].Sudah);
      totalBelum += parseInt(data[key].Belum);
      const item = data[key];
      // Buat baris baru untuk setiap item
      const row = `<tr><td class="text-center">${counter}</td><td class="text-center">${item.Nama}</td><td class="text-center">${item.Sum}</td><td class="text-center">${item.Peserta}</td><td class="text-center">${item.Sudah}</td><td class="text-center">${item.Belum}</td><td class="text-center">${hadirnya}%</td><td class="text-center"><a href="absensibus.html?acara=${Acara}&bus=${counter}" class="btn btn-primary btn-sm">Lihat</a></td></tr>`;
      // Tambahkan baris ke tabel
      dataBody.insertAdjacentHTML("beforeend", row);
      counter++;
    }
  }
  var alltot = totalSudah + totalBelum;
  var allpresentasi = (totalSudah / alltot) * 100;
  var element1 = document.getElementById("absentotal");
  element1.textContent = alltot;
  var element2 = document.getElementById("data_masuk");
  element2.textContent = totalSudah;
  var element3 = document.getElementById("data_belum");
  element3.textContent = totalBelum;
  var element = document.getElementById("data_persen");
  element.textContent = allpresentasi.toFixed(2) + "%";

  updateDonutChart(totalSudah, totalBelum);
  updateChart(hadirData, tidakHadirData);
  fetchData();
  fetchDataline();
  updateProgressBar(allpresentasi.toFixed(0));
});
