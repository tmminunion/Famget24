// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

async function fetchData() {
  try {
    const response = await fetch(
      "https://api.bungtemin.net/FamgetAbsensi/palsuk"
    ); // Replace with your API endpoint
    const data = await response.json();

    // Populate the table body with the fetched data
    const tbody = document.getElementById("dataTablex").querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing content

    data.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td class="text-center"><a href="#" class="btn btn-warning btn-sm">${
                  index + 1
                }</a></td>
                  <td class="text-center">${item.waktu}</td>
                <td class="text-left">${item.nama}</td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function getPar(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get a reference to the database path
const Acara = getPar("acara") || 1;
const starCountRef = ref(db, "Famgetabsensi/" + Acara);

function createGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color1); // Warna awal
  gradient.addColorStop(1, color2); // Warna akhir
  return gradient;
}
const ctx1 = document.getElementById("kehadiranDonut").getContext("2d");

// Fungsi untuk membuat atau memperbarui donut chart
let myDonutChart;

function updateDonutChart(sudahData, belumData) {
  if (myDonutChart) {
    myDonutChart.data.datasets[0].data = [sudahData, belumData];
    myDonutChart.update();
  } else {
    myDonutChart = new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: ["Sudah Hadir", "Belum Hadir"],
        datasets: [
          {
            data: [sudahData, belumData],
            backgroundColor: [
              createGradient(ctx1, "#2ed8b6", "#59e0c5"),
              createGradient(ctx1, "#ff5370", "#ff869a"),
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce(
                  (sum, val) => sum + val,
                  0
                );
                const value = context.raw;
                const percentage = ((value / total) * 100).toFixed(2);
                return `${context.label}: ${value} (${percentage}%)`;
              },
            },
          },
          datalabels: {
            formatter: function (value, context) {
              const total = context.chart.data.datasets[0].data.reduce(
                (sum, val) => sum + val,
                0
              );
              const percentage = ((value / total) * 100).toFixed(2);
              return `${value} (${percentage}%)`;
            },
            color: "#fff00",
            font: {
              weight: "bold",
              size: 16,
            },
          },
          centerText: {
            // Plugin untuk menambahkan teks di tengah donat
            afterDatasetsDraw: function (chart) {
              const ctx = chart.ctx;
              const width = chart.chartArea.width;
              const height = chart.chartArea.height;
              const total = chart.data.datasets[0].data.reduce(
                (sum, val) => sum + val,
                0
              );
              ctx.save();
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.font = "bold 18px Arial";
              ctx.fillStyle = "#33300";
              ctx.fillText(`Total: ${total}`, width / 2, height / 2);
              ctx.restore();
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}

const ctx = document.getElementById("absensiChart").getContext("2d");

// Fungsi untuk membuat chart
let myChart;

function updateChart(hadirData, tidakHadirData) {
  if (myChart) {
    myChart.data.datasets[0].data = hadirData;
    myChart.data.datasets[1].data = tidakHadirData;
    myChart.update(); // Update chart dengan data baru
  } else {
    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Bus 1", "Bus 2", "Bus 3", "Bus 4", "Bus 5", "Bus 6", "Bus 7"], // Label untuk tiap bus
        datasets: [
          {
            label: "Hadir (%)",
            data: hadirData,
            backgroundColor: createGradient(ctx, "#2ed8b6", "#59e0c5"),
            borderWidth: 1,
          },
          {
            label: "Tidak Hadir (%)",
            data: tidakHadirData,
            backgroundColor: createGradient(ctx, "#ff5370", "#ff869a"),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
            title: {
              display: true,
              text: "Persentase Absensi (%)",
            },
          },
          x: {
            stacked: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw}%`;
              },
            },
          },
          datalabels: {
            anchor: "center",
            align: "center",
            formatter: function (value) {
              return value + "%";
            },
            color: "white",
            font: {
              weight: "bold",
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
      plugins: [ChartDataLabels],
    });
  }
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
      const row = `
          <tr>
            <td class="text-center">${counter}</td>
            <td class="text-center">${item.Nama}</td>
            <td class="text-center">${item.Sum}</td>
            <td class="text-center">${item.Peserta}</td>
            <td class="text-center">${item.Sudah}</td>
            <td class="text-center">${item.Belum}</td>
            <td class="text-center">${hadirnya}%</td>
            <td class="text-center">
              <a href="absensi.html?acara=${Acara}&data=${key}" class="btn btn-primary btn-sm">Lihat</a>
            </td>
          </tr>
        `;

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
  // Update chart dengan data baru
  updateChart(hadirData, tidakHadirData);
  fetchData();
});
