import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { firebaseConfig } from "./modul/FirebaseConfig.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging.js";

const app = initializeApp(firebaseConfig);
console.log("NORIT");
const messaging = getMessaging(app);
getToken(messaging)
  .then((currentToken) => {
    // console.log(currentToken);
    if (currentToken) {
      const topikna = "famget";

      const storedData = localStorage.getItem("notif" + topikna);

      if (storedData && storedData === topikna) {
        // Jika topik sudah ada di localStorage, tidak lakukan apa-apa
        console.log("Topik sudah tersimpan di localStorage");
      } else {
        // Jika topik belum ada di localStorage, lakukan pengiriman data
        const datanya = localStorage.getItem("uid");
        const url = "https://api.bungtemin.net/notifikasi/savetokenfam"; // Ganti dengan URL endpoint yang sesuai
        const dataToSend = {
          data: datanya,
          token: currentToken,
          topik: topikna,
        };

        postData(url, dataToSend)
          .then((responseData) => {
            localStorage.setItem("notif" + topikna, topikna);
            console.log(responseData);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      console.log("Tidak dapat request");
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
  });

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
});

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
