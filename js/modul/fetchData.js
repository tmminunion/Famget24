export async function fetchData() {
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
