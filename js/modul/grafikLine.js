import { createGradient } from "./allfungction.js";

const ctxline1 = document.getElementById("absensiChartline").getContext("2d");

let myChartline; // Menyimpan instance chart
// Menyimpan instance chart

// Fungsi untuk update chart
function updateChartLINE(hadirData, tidakHadirData) {
  // Jika chart sudah ada, hanya perlu memperbarui datanya
  if (myChartline) {
    myChartline.data.datasets[0].data = hadirData; // Update data hadir
    myChartline.data.datasets[1].data = tidakHadirData; // Update data tidak hadir
    myChartline.update(); // Update chart dengan data baru
  } else {
    // Jika chart belum ada, buat chart baru
    myChartline = new Chart(ctxline1, {
      type: "bar",
      data: {
        labels: [
          "SB Sub Assy",
          "SB Conveyor",
          "SB Touch Up",
          "UB Assy",
          "UB Encopa",
          "SQPCHR",
        ],
        datasets: [
          {
            label: "Hadir (%)",
            data: hadirData,
            backgroundColor: createGradient(ctxline1, "#2ed8b6", "#59e0c5"),
            borderWidth: 1,
          },
          {
            label: "Tidak Hadir (%)",
            data: tidakHadirData,
            backgroundColor: createGradient(ctxline1, "#ff5370", "#ff869a"),
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

// Fungsi untuk mengambil data dari API
export function fetchDataline(acara) {
  fetch("https://api.bungtemin.net/FamgetAbsensi/absensiline/" + acara) // Ganti dengan URL API yang sesuai
    .then((response) => response.json()) // Mengubah response menjadi JSON
    .then((data) => {
      // Ambil data hadir dan tidak hadir
      const hadirDataline = data.map((bus) => bus.hadir);
      const tidakHadirDataline = data.map((bus) => bus.tidakHadir);

      // Update chart dengan data yang baru
      updateChartLINE(hadirDataline, tidakHadirDataline);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

export function fetchDatalinebackup(acara) {
  fetch("https://api.bungtemin.net/data/grafik/" + acara) // Ganti dengan URL API yang sesuai
    .then((response) => response.json()) // Mengubah response menjadi JSON
    .then((data) => {
      // Ambil data hadir dan tidak hadir
      const hadirDataline = data.map((bus) => bus.hadir);
      const tidakHadirDataline = data.map((bus) => bus.tidakHadir);

      // Update chart dengan data yang baru
      updateChartLINE(hadirDataline, tidakHadirDataline);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

