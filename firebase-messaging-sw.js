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
