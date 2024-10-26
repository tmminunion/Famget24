const menuItems = [
  { href: "index.html", text: "Beranda", id: "" },
  { href: "#", text: "Bingkai", id: "" },
  { href: "galeri.html", text: "Foto Galery", id: "linkalbum" },
  { href: "#", text: "Albumku", id: "linkalbum" },
  { href: "../index.html", text: "Ke FAMGET2024", id: "linkalbum" },
];

// Dapatkan elemen <ul> berdasarkan ID
const menuAll = document.getElementById("menuall");

// Loop melalui setiap item menu dan buat elemen <li> dan <a>
menuItems.forEach((item) => {
  // Buat elemen <li>
  const li = document.createElement("li");

  // Buat elemen <a>
  const a = document.createElement("a");
  a.href = item.href; // Setel href
  a.textContent = item.text; // Setel teks tautan
  a.className = "text-white"; // Tambahkan kelas
  if (item.id) {
    a.id = item.id; // Setel ID jika ada
  }

  // Tambahkan <a> ke dalam <li>
  li.appendChild(a);

  // Tambahkan <li> ke dalam <ul>
  menuAll.appendChild(li);
});
