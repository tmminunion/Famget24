// service-worker.js

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

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://i.imgur.com/wrFJWMj.jpeg",
    image: payload.notification.image,
    click_action: payload.notification.click_action,
    data: payload.notification, // Mengirim data notifikasi ke dalam event notificationclick
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close();
  // Contoh: membuka URL
  const urlToOpen = new URL("https://famget.nufat.id");
  const promiseChain = clients.openWindow(urlToOpen);
  event.waitUntil(promiseChain);
});

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
