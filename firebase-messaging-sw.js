importScripts(
  "https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js"
);

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Menangani pesan background
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Ambil data notifikasi
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://i.imgur.com/wrFJWMj.jpeg",
    image: payload.notification.image,
    data: {
      click_action: payload.data.click_action, // Mengambil click_action dari data
    },
  };

  // Tampilkan notifikasi
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Menangani klik pada notifikasi
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Ambil URL dari data notifikasi (click_action)
  const urlToOpen =
    event.notification.data.click_action || "https://famget.nufat.id"; // Gunakan URL default jika tidak ada click_action

  // Buka URL di tab baru atau fokus ke tab yang sudah terbuka
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Caching bagian
const CACHE_NAME = "my-site-cache-v1";
const urlsToCache = ["/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Service Worker
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-data") {
    event.waitUntil(fetchAndUpdateData());
  }
});

async function fetchAndUpdateData() {
  const url =
    "https://script.google.com/macros/s/AKfycbyVFQ3Ojb-5wPHB5T4GE8RAoGMt9SZJBXuugzxv3oQK9X5HMBoIHt9qkWwO9ItuXXgv/exec";

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Simpan ke IndexedDB
    await saveToIndexedDB(data);

    console.log("Data berhasil diperbarui dan disimpan.");
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
  }
}

// Fungsi untuk menyimpan data ke IndexedDB
async function saveToIndexedDB(data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("my-database", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("data-store")) {
        db.createObjectStore("data-store", { keyPath: "nama" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("data-store", "readwrite");
      const store = transaction.objectStore("data-store");

      data.forEach((item) => {
        store.put(item); // Menyimpan setiap item
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };

    request.onerror = () => reject(request.error);
  });
}

// Daftarkan Background Sync dari halaman utama
if ("serviceWorker" in navigator && "SyncManager" in window) {
  navigator.serviceWorker.ready
    .then(function (swRegistration) {
      return swRegistration.sync.register("sync-data");
    })
    .then(function () {
      console.log("Background Sync berhasil didaftarkan.");
    })
    .catch(function (err) {
      console.error("Background Sync gagal:", err);
    });
}
