import { createGradient } from "./allfungction.js";

const ctx = document.getElementById("absensiChart").getContext("2d");

// Fungsi untuk membuat chart
let myChart;

export function updateChart(hadirData, tidakHadirData) {
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

const ctx1 = document.getElementById("kehadiranDonut").getContext("2d");

// Fungsi untuk membuat atau memperbarui donut chart
let myDonutChart;

export function updateDonutChart(sudahData, belumData) {
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
