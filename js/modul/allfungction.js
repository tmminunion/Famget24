export function getPar(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function createGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color1); // Warna awal
  gradient.addColorStop(1, color2); // Warna akhir
  return gradient;
}

export function updateSeatColor(seatNumber) {
  // Cari kursi berdasarkan atribut data-seat yang sesuai
  const seat = document.querySelector(`[data-seat="${seatNumber}"]`);

  // Jika kursi ditemukan, tambahkan kelas updated-seat untuk mengubah warnanya
  if (seat) {
    seat.classList.add("updated-seat");
  } else {
    console.log("Seat number not found");
  }
}

export function updateSeatsFromArray(seatNumbers) {
  const seatNumbersAr = seatNumbers.split(",").map(Number);
  seatNumbersAr.forEach(function (seatNumber) {
    updateSeatColor(seatNumber);
  });
}

export function updateBadge(nama, seatNumbersString) {
  // Pisahkan string kursi menjadi array menggunakan koma sebagai pemisah
  var seatNumbers = seatNumbersString.split(",");

  // Loop melalui semua seat numbers
  seatNumbers.forEach(function (seat) {
    var badgeId = "badge" + seat.trim(); // Buat id badge yang sesuai dengan kursi (dengan trim untuk menghapus spasi berlebih)
    var badgeElement = document.getElementById(badgeId); // Dapatkan elemen badge

    // Jika elemen badge ditemukan, ubah teksnya dengan nama
    if (badgeElement) {
      badgeElement.innerText = nama;
    }
  });
}
