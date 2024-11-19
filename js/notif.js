import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { firebaseConfig } from "./modul/FirebaseConfig.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging.js";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const datanya = localStorage.getItem("uid");

getToken(messaging)
  .then((currentToken) => {
    if (currentToken) {
      const topikna = datanya;
      localStorage.setItem("notiftoken", currentToken);
      const storedData = localStorage.getItem("notif" + topikna);
      subcribeAdmin(currentToken);
      if (storedData && storedData === topikna) {
        // Jika topik sudah ada di localStorage, tidak lakukan apa-apa
        console.log("Topik sudah tersimpan di localStorage");
      } else {
        // Jika topik belum ada di localStorage, lakukan pengiriman data
        const url = "https://api.bungtemin.net/notifikasi/savetokenfam"; // Ganti dengan URL endpoint yang sesuai
        const dataToSend = {
          data: datanya,
          token: currentToken,
          topik: topikna,
        };

        postData(url, dataToSend)
          .then((responseData) => {
            console.log(responseData);
            subscribeToTopic(currentToken, topikna);
          })
          .catch((error) => {
            console.error(error);
          });
      }

      // Tambahkan token ke topik menggunakan POST request
    } else {
      console.log("Tidak dapat request token.");
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
  });

// Mendengarkan pesan yang diterima pada klien
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // Menampilkan notifikasi atau melakukan aksi lain sesuai kebutuhan
  if (Notification.permission === "granted") {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon,
    });
  }
});

// Fungsi untuk subscribe token ke topik
function subscribeToTopic(token, topic) {
  const url = "https://nextfire-two-ruby.vercel.app/api"; // Ganti dengan URL yang sesuai
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    token: token,
    topic: topic,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log("Subscribed to topic:", result);
      localStorage.setItem("notif" + topic, topic);
    })
    .catch((error) => console.error("Error subscribing to topic:", error));
}

function postData(url, data) {
  if (!data || typeof data !== "object") {
    return Promise.reject(new Error("Data harus berupa objek"));
  }

  // Pastikan URL telah diberikan
  if (!url || typeof url !== "string") {
    return Promise.reject(new Error("URL tidak valid"));
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data; // Mengembalikan data yang diterima dari respons
    })
    .catch((error) => {
      throw new Error("There was a problem with your fetch operation:", error);
    });
}

function subcribeAdmin(currentToken) {
  const isVerified = localStorage.getItem("verifikasiaku");
  const topikna = "famgetadmin";
  const storedData = localStorage.getItem("notif" + topikna);
  if (storedData && storedData === topikna) {
    // Jika topik sudah ada di localStorage, tidak lakukan apa-apa
    console.log("Topik Admin sudah tersimpan di localStorage");
  } else {
    if (isVerified === "1") {
      subscribeToTopic(currentToken, topikna);
      console.log("adminNotif AKtiv");
    }
  }
}
