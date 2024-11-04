let dblokal; // Variabel untuk menyimpan referensi ke IndexedDB

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("API_DB", 1);

    request.onupgradeneeded = function (event) {
      dblokal = event.target.result;
      const objectStore = dblokal.createObjectStore("posts", { keyPath: "id" });
    };

    request.onsuccess = function (event) {
      dblokal = event.target.result;
      console.log("Database initialized.");
      resolve(); // Menyelesaikan Promise setelah database siap
    };

    request.onerror = function (event) {
      console.error("Database error: ", event.target.errorCode);
      reject(event.target.errorCode); // Menyelesaikan Promise dengan error
    };
  });
}

function savePostsToDB(posts) {
  const transaction = dblokal.transaction(["posts"], "readwrite");
  const objectStore = transaction.objectStore("posts");

  posts.forEach((post) => {
    const request = objectStore.put(post);
    request.onsuccess = function () {
      console.log(`Post ${post.id} saved to DB.`);
    };
    request.onerror = function () {
      console.error(`Error saving post ${post.id}: `, request.error);
    };
  });
}

function getPostsFromDB() {
  return new Promise((resolve, reject) => {
    const transaction = dblokal.transaction(["posts"], "readonly");
    const objectStore = transaction.objectStore("posts");
    const request = objectStore.getAll();

    request.onsuccess = function () {
      resolve(request.result);
    };
    request.onerror = function () {
      reject(request.error);
    };
  });
}

async function fetchAndDisplayPosts() {
  try {
    await initDB(); // Tunggu hingga database siap
    const postsFromDB = await getPostsFromDB();
    const postlist = document.getElementById("postlist");

    // Jika ada data di IndexedDB, tampilkan
    if (postsFromDB.length > 0) {
      postsFromDB.forEach((post) => {
        appendPostToHTML(postlist, post);
      });
    }

    // Ambil data dari API dan simpan ke IndexedDB
    const response = await fetch(
      "https://api.bungtemin.net/FamgetAbsensi/laststory"
    );
    const posts = await response.json();
    savePostsToDB(posts); // Simpan ke IndexedDB
    console.log(posts);
    // Tampilkan postingan dari API
    posts.forEach((post) => {
      appendPostToHTML(postlist, post);
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
function appendPostToHTML(postlist, post) {
  // Buat ID untuk card berdasarkan post.id
  const postId = `post-${post.id}`;

  // Periksa apakah card dengan ID tersebut sudah ada
  if (!document.getElementById(postId)) {
    const postHTML = `
      <div class="card mt-3" id="${postId}">
        <div class="d-flex justify-content-between p-2 px-3">
          <div class="d-flex flex-row align-items-center">
            <img src="${post.fotoprofil}" width="50" class="rounded-circle" />
            <div class="d-flex flex-column ml-2">
              <span class="font-weight-bold">${post.nama}</span>
              <small class="text-primary">${post.CreatedAt}</small>
            </div>
          </div>
          <div class="d-flex flex-row mt-1 ellipsis">
            <small class="mr-2">Just now</small>
          </div>
        </div>
         <img src="https://i.imgur.com/xhzhaGA.jpg" class="img-fluid" />
        <div class="p-2">
          <p class="text-justify">${post.content}</p>
          <hr />
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-row icons d-flex align-items-center mb-2 px-4">
              <i class="fa fa-heart" style="font-size: x-large; color: red"></i>
              <span class="px-2">100</span>
            </div>
            <div class="d-flex flex-row muted-color mb-2">
              <span>2 comments</span>
            </div>
          </div>
        </div>
      </div>
    `;
    postlist.insertAdjacentHTML("beforeend", postHTML);
  } else {
    console.log(`Post with ID ${post.id} already exists, skipping...`);
  }
}

// Panggil fungsi fetchAndDisplayPosts saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchAndDisplayPosts);
