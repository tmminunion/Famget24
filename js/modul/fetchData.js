export async function fetchData() {
  try {
    const response = await fetch(
      "https://api.bungtemin.net/FamgetAbsensi/lastabsen"
    ); // API endpoint Anda
    const data = await response.json();

    // Populate the table body with the fetched data
    const tbody = document.getElementById("dataTablex").querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing content

    data.forEach((item, index) => {
      // Asumsikan item.Waktu dalam format ISO 8601 (misalnya '2024-10-21T21:42:42')
      const date = new Date(item.Waktu);
      
      // Mengambil jam dan menit saja (format: HH:MM)
      const formattedTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

      // Memotong nama hingga 15 karakter dan menambahkan "..." jika lebih panjang
      let truncatedName = item.Nama;
      if (truncatedName.length > 15) {
        truncatedName = truncatedName.slice(0, 15) + "...";
      }

      const row = document.createElement("tr");
      row.innerHTML = `
                <td class="text-center"><a href="#" class="btn btn-warning btn-sm">${
                  index + 1
                }</a></td>
                <td class="text-center">${formattedTime}</td>
                <td class="text-left">${truncatedName}</td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}