import { listacara } from "./modul/listacara.js";
import { updateProgressBar } from "./modul/progress.js";
import { getPar } from "./modul/allfungction.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { firebaseConfig } from "./modul/FirebaseConfig.js";
import { getData } from "./modul/databustableadmin.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const userEmail = localStorage.getItem("userEmail");

// Gunakan regex untuk mendapatkan angka setelah "bus"
const busNumber = userEmail.match(/bus(\d+)/);

const Acara = getPar("acara") || localStorage.getItem("absensi");
const NamaBus = getPar("bus") || busNumber[1];
document.getElementById("manifest").textContent = "Absensi BUS " + NamaBus;
document.getElementById("preloader").style.display = "block";
if (Acara >= 0 && Acara < listacara.length) {
  document.getElementById("judulna").textContent = listacara[Acara];
  document.getElementById("judulna2").textContent = listacara[Acara];

  const busLinksContainer = document.getElementById("bus-links");
  const busLinksC = document.getElementById("acara-links");
  for (let i = 0; i <= 8; i++) {
    // Bus dari 1 sampai 7
    const td = document.createElement("td");
    if (i == Acara) {
      td.className = "activer";
    } else {
      td.className = "pastel-box";
    }
    const a = document.createElement("a");
    a.href = `admin.html?acara=${i}&bus=${NamaBus}`; // URL dinamis
    a.innerText = `${i}`; // Teks yang ditampilkan
    td.appendChild(a);
    busLinksC.appendChild(td);
  }
  // Buat link dinamis untuk setiap bus
  for (let i = 1; i <= 7; i++) {
    // Bus dari 1 sampai 7
    const td = document.createElement("td");
    if (i == NamaBus) {
      td.className = "activer";
    } else {
      td.className = "pastel-box";
    }
    const a = document.createElement("a");
    a.href = `admin.html?acara=${Acara}&bus=${i}`; // URL dinamis
    a.innerText = `BUS ${i}`; // Teks yang ditampilkan
    td.appendChild(a);
    busLinksContainer.appendChild(td);
  }
} else {
  document.getElementById("judulna").textContent = "Acara tidak ditemukan.";
}

const starCountRef = ref(db, "Famgetabsensi/" + Acara + "/bus" + NamaBus);

onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();

  var totalSudah = data.Sudah;
  var totalBelum = data.Belum;
  var alltot = data.Sudah + data.Belum;
  var allpresentasi = (totalSudah / alltot) * 100;
  var element1 = document.getElementById("absentotal");
  element1.textContent = alltot;
  var element2 = document.getElementById("data_masuk");
  element2.textContent = totalSudah;
  var element3 = document.getElementById("data_belum");
  element3.textContent = totalBelum;
  var element = document.getElementById("data_persen");
  element.textContent = allpresentasi.toFixed(0) + "%";
  updateProgressBar(allpresentasi.toFixed(0));
  getData(NamaBus, Acara);
});
