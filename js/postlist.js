let dblokal; // Variabel untuk menyimpan referensi ke IndexedDB

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("API_DB", 2);

    request.onupgradeneeded = function (event) {
      dblokal = event.target.result;

      // Membuat object store untuk menyimpan postingan
      if (!dblokal.objectStoreNames.contains("posts")) {
        const postStore = dblokal.createObjectStore("posts", { keyPath: "id" });
      }

      // Membuat object store untuk menyimpan postingan yang sudah dilihat
      if (!dblokal.objectStoreNames.contains("viewedPosts")) {
        const viewedPostStore = dblokal.createObjectStore("viewedPosts", {
          keyPath: "id",
        });
      }

      console.log("Object stores created/verified.");
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
      // console.log(`Post ${post.id} saved to DB.`);
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

function deletePostFromDB(postId) {
  const transaction = dblokal.transaction(["posts"], "readwrite");
  const objectStore = transaction.objectStore("posts");
  const request = objectStore.delete(postId);

  request.onsuccess = function () {
    console.log(`Post ${postId} deleted from DB.`);
  };
  request.onerror = function () {
    console.error(`Error deleting post ${postId}: `, request.error);
  };
}

async function lokaldata() {
  try {
    await initDB(); // Tunggu hingga database siap
    const postsFromDB = await getPostsFromDB();
    postsFromDB.forEach((post) => {
      appendPostToHTML(post);
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

async function fetchAndDisplayPosts() {
  try {
    await initDB(); // Tunggu hingga database siap
    const postsFromDB = await getPostsFromDB();
    const postlist = document.getElementById("postlist");
    // Ambil data dari API
    var endpoit = localStorage.getItem("uid") || "LxLqzVMNawW1ASF60gqPwcvdbQR2";
    const response = await fetch(
      "https://api.bungtemin.net/FamgetAbsensi/laststory/" + endpoit
    );
    const postsFrom = await response.json();
    const postsFromServer = postsFrom.data;

    // Tampilkan postingan dari DB terlebih dahulu
    lokaldata();
    // Hapus postingan yang tidak ada di server
    const serverPostIds = new Set(postsFromServer.map((post) => post.id));

    postsFromDB.forEach((post) => {
      if (!serverPostIds.has(post.id)) {
        deletePostFromDB(post.id); // Hapus dari DB
        const postElement = document.getElementById(`post-${post.id}`);
        if (postElement) {
          postElement.remove(); // Hapus dari tampilan
        }
      }
    });

    // Simpan postingan baru ke IndexedDB
    savePostsToDB(postsFromServer); // Simpan ke IndexedDB

    // Tampilkan postingan baru dari server
    postsFromServer.forEach((post) => {
      postlist.innerHTML = "";
      appendPostToHTML(post);
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function appendPostToHTML(post, position = "afterbegin") {
  const postlist = document.getElementById("postlist");
  moment.locale("id");
  const postId = `post-${post.id}`;

  if (!document.getElementById(postId)) {
    const formattedTimeAgo = moment(post.CreatedAt).fromNow();
    const postHTML = `
      <div class="card mt-1" id="${postId}">
        <div class="d-flex justify-content-between p-2 px-3">
          <div class="d-flex flex-row align-items-center">
              <div class="profile-wrapper">
    <img src="${post.fotoprofil}" width="50" class="rounded-circle" />
    ${
      post.isVerified == 1
        ? `<img src="images/veri.png" class="verified-icon" alt="Verified" />`
        : ""
    }
  </div>
            <div class="d-flex flex-column ml-2">
              <span class="font-weight-bold">${post.nama}</span>
              <small class="text-primary">${formattedTimeAgo}</small>
            </div>
          </div>
          <div class="d-flex flex-row mt-1 ellipsis">
            <small class="mr-2 view-count"></small>
          </div>
        </div>
         <img src="${post.imgid}" class="img-fluid" />
        <div class="p-2">
          <p class="text-justify">${post.content}</p>
          <hr />
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-row icons d-flex align-items-center mb-2 px-4">
              <i class="fa fa-heart like-button" style="font-size: x-large; color: red; cursor: pointer;"></i>
              <span class="px-2 love-count">${post.Like_Count || 0}</span>
            </div>
            <div class="d-flex flex-row muted-color mb-1 comment-section" style="cursor: pointer;">
              <span style="font-size: small">${
                post.Comment_Count || 0
              } Komentar</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Sisipkan post ke dalam container
    postlist.insertAdjacentHTML(position, postHTML);

    // Tambahkan event listener untuk like dan komentar
    addEventListeners(postId, post);

    // Mulai observasi view
    observePostView(postId, post);
  }
}

// Fungsi untuk menambahkan event listener like dan komentar
function addEventListeners(postId, post) {
  const likeButton = document.querySelector(`#${postId} .like-button`);
  const loveCountSpan = document.querySelector(`#${postId} .love-count`);
  const commentSection = document.querySelector(`#${postId} .comment-section`);
  var endpoitlik =
    localStorage.getItem("uid") || "LxLqzVMNawW1ASF60gqPwcvdbQR2";

  likeButton.addEventListener("click", async function () {
    try {
      const response = await fetch(
        `https://api.bungtemin.net/FamgetAbsensi/likePost/${endpoitlik}/${post.id}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      if (response.ok) {
        loveCountSpan.textContent = parseInt(loveCountSpan.textContent) + 1;
      } else {
        console.error(`Failed to like post ${post.id}`);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  });

  commentSection.addEventListener("click", function () {
    window.location.href = `singlepost.html?id=${post.id}`;
  });
}

// Fungsi untuk observasi view
function observePostView(postId, post) {
  const viewCountSpan = document.querySelector(`#${postId} .view-count`);

  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      incrementView(postId);

      observer.disconnect();
    }
  });
  observer.observe(document.getElementById(postId));
}

// Panggil fungsi fetchAndDisplayPosts saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchAndDisplayPosts);

const apikeyana = [
  "025ba3ace62a66d",
  "082eb55cc144305",
  "70519e36199385e",
  "8d04e5606260801",
  "a692f82b1aced47",
  "b4b4301cdb7c9c8",
  "7c0326461ff3839",
  "f22aac7a4a746bc",
  "de75765ef3b4199",
];
const randomIndex = Math.floor(Math.random() * apikeyana.length);

// Client ID Imgur (ganti dengan Client ID-mu)
const IMGUR_CLIENT_ID = apikeyana[randomIndex];
// Fungsi untuk mengirim data ke API bungtemin.net
function sendDataToApi(content, imageUrl = null) {
  var endpoit = localStorage.getItem("uid");
  var ennama = localStorage.getItem("puserName");
  var eprofil = localStorage.getItem("puserPhoto");

  const data = {
    type: "profil",
    noreg: endpoit, // Ganti dengan nomor registrasi yang sesuai
    nama: ennama, // Ganti dengan nama yang sesuai
    forum: "FAMGET", // Forum yang sesuai
    content: content,
    imgid: imageUrl ? imageUrl : "", // Jika ada image, gunakan URL-nya, jika tidak kosong
    fotoprofil: eprofil, // URL foto profil
    aproved: "1", // Status approved
  };

  fetch("https://api.bungtemin.net/FamgetAbsensi/PostForumFeed/" + endpoit, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

      // Reset form setelah submit
      document.getElementById("postForm").reset();
      const submitButton = document.getElementById("submitPost");
      submitButton.disabled = false;
      submitButton.classList.remove("disabled");
      document.getElementById("previewImage").style.display = "none";
      document.getElementById("loader").style.display = "none";
      fetchAndDisplayPosts();
      // Tutup modal
      $("#postModal").modal("hide");
      scrollToToplist();
    })
    .catch((error) => {
      console.error("Error submitting post:", error);
      alert("Error submitting post");
    });
}

// Menampilkan pratinjau gambar yang diunggah
document
  .getElementById("postImage")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById("previewImage");
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
      previewImage.src = "#";
    }
  });

// Mencegah submit form default dan menambahkan logika untuk posting
document
  .getElementById("submitPost")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const content = document.getElementById("postContent").value;
    const fileInput = document.getElementById("postImage");
    const file = fileInput.files[0];
    const submitButton = document.getElementById("submitPost");

    if (content === "" && !file) {
      alert("silahkan Tuliskan Konten");
    } else if (file) {
      submitButton.disabled = true;
      submitButton.classList.add("disabled");
      document.getElementById("loader").style.display = "block";
      // Logika untuk mengunggah gambar ke Imgur
      const formData = new FormData();
      formData.append("image", file);

      fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const imageUrl = data.data.link;
            // Kirim data ke API bungtemin.net setelah upload gambar
            sendDataToApi(content, imageUrl);
          } else {
            alert("Failed to upload image to Imgur");
          }
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          alert("Error uploading image");
        });
    } else {
      // Jika tidak ada gambar, langsung kirim data ke API bungtemin.net
      sendDataToApi(content);
    }
  });

async function incrementView(postId) {
  const viewCountSpan = document.querySelector(`#${postId} .view-count`);
  try {
    const postIdNumber = postId.match(/\d+/)[0];
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyimpTGFiuamFlEb4BIlG2vsaVqXH_p1oLEFUkTsro2--pHMQNVm5cUWXDO2KT2t_w/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          postId: postIdNumber,
        }),
      }
    );

    const data = await response.json();
    viewCountSpan.textContent = `${data.viewCount} Views`;
    // console.log(data);
  } catch (error) {
    console.error("Error updating view:", error);
  }
}
function scrollToToplist() {
  const toplist = document.getElementById("toplist");
  const toplistPosition =
    toplist.getBoundingClientRect().top + window.pageYOffset;

  const startPosition = window.pageYOffset;
  const distance = toplistPosition - startPosition;
  const duration = 1000; // Durasi scroll dalam milidetik (1 detik)
  let start = null;

  // Fungsi untuk membuat animasi scroll manual
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const scrollAmount = easeInOutQuad(
      progress,
      startPosition,
      distance,
      duration
    );

    window.scrollTo(0, scrollAmount);

    if (progress < duration) {
      requestAnimationFrame(step);
    }
  }

  // Fungsi easing untuk animasi smooth (menghindari gerakan linier)
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(step);
}
