async function fetchAndDisplayPosts() {
  try {
    // Ambil id dari parameter URL (contoh: singlepost.html?id=133)
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id"); // Ambil id dari query parameter 'id'
    console.log(postId);
    if (!postId) {
      console.error("ID parameter tidak ditemukan di URL");
      window.location.href = "sarasehan.html"; // Redirect jika tidak ada ID
      return;
    }

    // Ambil uid dari localStorage atau gunakan default
    var endpoint =
      localStorage.getItem("uid") || "LxLqzVMNawW1ASF60gqPwcvdbQR2";

    // Fetch data berdasarkan id post
    const response = await fetch(
      `https://api.bungtemin.net/FamgetAbsensi/lastsingle/${endpoint}?id=${postId}`
    );

    const postsFrom = await response.json();

    // Cek jika data tidak ditemukan atau kosong
    if (!postsFrom || !postsFrom.data) {
      console.error("Post tidak ditemukan");
      window.location.href = "sarasehan.html"; // Redirect jika postingan tidak ditemukan
      return;
    }

    const postsFromServer = postsFrom.data;
    console.log(postsFromServer);

    // Tampilkan postingan baru dari server
    appendPostToHTML(postsFromServer);
  } catch (error) {
    console.error("Error fetching posts:", error);
    window.location.href = "sarasehan.html"; // Redirect jika terjadi error
  }
}

function appendPostToHTML(post, position = "afterbegin") {
  const postlist = document.getElementById("postlist");
  moment.locale("id");
  const postId = `post-${post.id}`;
  var myuid = localStorage.getItem("uid");
  var verifiedAccount = localStorage.getItem("verifikasiaku"); // Tambahkan pengecekan akun verifikasi

  if (!document.getElementById(postId)) {
    const formattedTimeAgo = moment(post.CreatedAt).fromNow();

    // Tambahkan alert jika postingan belum diapprove
    const approvalAlert =
      post.aproved == 0
        ? `<div class="alert alert-danger" role="alert">
           Postingan ini belum terlihat publik, masih menunggu persetujuan admin.
         </div>`
        : "";

    // Menyembunyikan img jika imgid kosong
    const imageHTML = post.imgid
      ? `<img src="${post.imgid}" class="img-fluid" />`
      : ""; // Tidak menampilkan img jika imgid kosong

    const postHTML = `
      <div class="card" id="${postId}">
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
        ${approvalAlert} <!-- Tambahkan alert di sini -->
        ${imageHTML} <!-- Tambahkan img di sini -->
        <div class="p-2">
          <p class="text-justify">${post.content}</p>
          <hr />
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-row icons d-flex align-items-center px-4">
              <i class="fa fa-heart like-button" style="font-size: x-large; color: red; cursor: pointer;"></i>
              <span class="px-2 love-count">${post.Like_Count || 0}</span>
            </div>
            <div class="d-flex flex-row icons d-flex align-items-center px-4">
                 ${
                   post.noreg == myuid || verifiedAccount == "1" // Tambahkan pengecekan akun verifikasi
                     ? `
            <button class="btn btn-danger btn-sm delete-post" data-post-id="${post.id}">Delete</button>
          `
                     : ""
                 }
            </div>
            <div class="d-flex flex-row muted-color comment-section" style="cursor: pointer;">
              <span style="font-size: small">${
                post.Comment_Count || 0
              } Komentar</span>
            </div>
          </div>
        </div>
        <!-- Card Footer - Tempat untuk menampilkan komentar -->
        <div class="card-footer">
          <div class="comments-section">
          <div class="comments-list mt-3" id="comments-list">
              <!-- Komentar-komentar yang sudah ada akan tampil di sini -->
            </div>
            <div class="comment-input">
              <textarea id="newdodol" class="form-control" placeholder="Tulis komentar..."></textarea>
              <button class="btn btn-primary mt-2 comment-submit">Kirim</button>
            </div>
            
          </div>
        </div>
      </div>
    `;

    // Sisipkan post ke dalam container
    postlist.insertAdjacentHTML(position, postHTML);
    getComments(postId);
    // Tambahkan event listener untuk like, komentar, dan delete
    addEventListeners(postId, post);
    observePostView(postId, post);

    // Menambahkan event listener untuk tombol delete
    const deleteButton = document.querySelector(`#${postId} .delete-post`);
    if (deleteButton) {
      deleteButton.addEventListener("click", function () {
        deletePost(post.id);
      });
    }

    // Menambahkan event listener untuk tombol kirim komentar
    const commentSubmitButton = document.querySelector(
      `#${postId} .comment-submit`
    );
    if (commentSubmitButton) {
      commentSubmitButton.addEventListener("click", function () {
        const commentText = document.querySelector(
          `#${postId} .comment-input textarea`
        ).value;
        if (commentText.trim() !== "") {
          addNewComment(post.id, commentText);
        }
      });
    }
  }
}

// Fungsi untuk mengambil komentar dari API dan menampilkan
async function getComments(postId) {
  try {
    // Ekstraksi angka dari postId (misal: "post-132" menjadi "132")
    const numericPostId = postId.replace(/\D/g, ""); // Hanya mengambil angka

    // Ambil data komentar dari API
    var endpoitlik =
      localStorage.getItem("uid") || "LxLqzVMNawW1ASF60gqPwcvdbQR2";
    const response = await fetch(
      `https://api.bungtemin.net/FamgetAbsensi/getComments/${endpoitlik}/${numericPostId}`
    );
    const data = await response.json();
    console.log(data);

    if (data && data.comments) {
      const commentsList = document.getElementById(`comments-list`);
      commentsList.innerHTML = ""; // Kosongkan dulu komentar yang ada
      var myuid = localStorage.getItem("uid");
      var verifiedAccount = localStorage.getItem("verifikasiaku"); // Tambahkan pengecekan akun verifikasi
      // Urutkan komentar berdasarkan id dari 1 ke 10 (ascending order)
      data.comments.sort((a, b) => a.id - b.id);

      // Menampilkan komentar yang ada dari API
      data.comments.forEach((comment) => {
        const formattedTimeAgo = moment(comment.CreatedAt).fromNow(); // Format waktu menggunakan Moment.js

        const commentHTML = `
  <div class="card p-2 shadow-sm rounded-lg" id="comment-${comment.id}">
    <div class="d-flex justify-content-between align-items-center">
      <div class="user d-flex flex-row align-items-center">
        <img src="${
          comment.fotoprofil || "https://i.imgur.com/hczKIze.jpg"
        }" width="30" class="user-img rounded-circle mx-2">
        <span class="mx-1">
          <small class="font-weight-bold text-primary">${
            comment.nama
          }</small><br>
          <small class="font-weight-bold">${comment.content}</small>
        </span>
      </div>
    </div>

    <div class="action d-flex justify-content-between mt-3 align-items-center">
      <div class="reply d-flex align-items-center">
        <small class="mr-3 text-muted">${formattedTimeAgo}</small>
      </div>

      <div class="icons align-items-center">
        ${
          // Tampilkan tombol "Hapus" jika pengguna adalah pemilik komentar atau akunnya sudah diverifikasi
          comment.noreg == myuid || verifiedAccount == "1"
            ? `<small class="text-muted" onclick="deleteComment(${comment.id})">Hapus</small>`
            : ""
        }
      </div>
    </div>
  </div>
`;

        commentsList.insertAdjacentHTML("beforeend", commentHTML);
      });
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
// Fungsi untuk menghapus komentar
async function deleteComment(commentId) {
  try {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus komentar ini?"
    );
    if (!confirmDelete) return;

    const endpoitlik =
      localStorage.getItem("uid") || "LxLqzVMNawW1ASF60gqPwcvdbQR2";
    const accessToken = localStorage.getItem("accessToken");

    // Pastikan ada token akses sebelum melakukan permintaan
    if (!accessToken) {
      console.error("Access token tidak ditemukan");
      return;
    }

    // Kirim permintaan delete ke API (dengan POST dan Authorization header)
    const response = await fetch(
      `https://api.bungtemin.net/FamgetAbsensi/deleteComment/${endpoitlik}/${commentId}`,
      {
        method: "POST", // Menggunakan POST untuk penghapusan
        headers: {
          "Content-Type": "application/json", // Tipe konten JSON
          Authorization: `Bearer ${accessToken}`, // Menambahkan token akses di header
        },
        body: JSON.stringify({ commentId: commentId }), // Mengirim ID komentar yang akan dihapus
      }
    );

    console.log(response);

    if (response.ok) {
      // Hapus elemen komentar dari DOM
      const commentElement = document.getElementById(`comment-${commentId}`);
      if (commentElement) {
        commentElement.remove();
      }
      console.log(`Comment with ID ${commentId} deleted`);
    } else {
      console.error(`Failed to delete comment with ID ${commentId}`);
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}

async function addNewComment(postId, commentText) {
  const accessToken = localStorage.getItem("accessToken");
  var endpoitlik =
    localStorage.getItem("uid") || "LxLqzVMNawW1ASF60gqPwcvdbQR2";
  var ennama = localStorage.getItem("puserName");
  var eprofil = localStorage.getItem("puserPhoto");
  try {
    // Kirim komentar baru ke API
    const response = await fetch(
      `https://api.bungtemin.net/FamgetAbsensi/addComment/${endpoitlik}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Menambahkan token ke header
        },
        body: JSON.stringify({
          postId: postId,
          commentText: commentText,
          noreg: localStorage.getItem("uid"),
          nama: ennama, // Ganti dengan nama yang sesuai
          fotoprofil: eprofil, // Menyertakan UID user (jika ada)
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    if ((data.status = "success")) {
      // Jika berhasil, muat ulang komentar
      getComments(postId);
      document.querySelector(`#newdodol`).value = "";
    } else {
      alert("Gagal menambahkan komentar");
    }
  } catch (error) {
    console.error("Error posting comment:", error);
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
  const accessToken = localStorage.getItem("accessToken");
  const data = {
    type: "profil",
    noreg: endpoit, // Ganti dengan nomor registrasi yang sesuai
    nama: ennama, // Ganti dengan nama yang sesuai
    forum: "FAMGET", // Forum yang sesuai
    content: content,
    imgid: imageUrl ? imageUrl : "", // Jika ada image, gunakan URL-nya, jika tidak kosong
    fotoprofil: eprofil, // URL foto profil
  };

  fetch("https://api.bungtemin.net/FamgetAbsensi/PostForumFeed/" + endpoit, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Menambahkan token ke header
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
      // Tutup modal
      $("#postModal").modal("hide");
      scrollToToplist();

      if (result.display == 1) {
        fetchAndDisplayPosts();
      } else {
        appendPostToHTML(result.data);
        alert(
          "Karena akun anda tidak centang biru maka Postingan Menunggu Persetujuan Admin"
        );
      }
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

async function deletePost(postId) {
  // Tampilkan konfirmasi kepada pengguna
  const isConfirmed = confirm(
    "Apakah Anda yakin ingin menghapus postingan ini?"
  );

  // Jika pengguna menekan "Cancel", batalkan penghapusan
  if (!isConfirmed) {
    return;
  }

  try {
    // Ambil accessToken dari localStorage
    const accessToken = localStorage.getItem("accessToken");
    //const accessToken = "fjkvkjfhvjfhdjkvhdfjkhvjkdf";
    const uidna = localStorage.getItem("uid");
    if (!accessToken) {
      console.error("Access token is missing.");
      return;
    }

    // Kirim request untuk menghapus post ke backend PHP
    const response = await fetch(
      "https://api.bungtemin.net/FamgetAbsensi/dELETEposT/" + uidna,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Menambahkan token ke header
        },
        body: JSON.stringify({ id: postId }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.status === "success") {
      //alert("Post deleted successfully");
      // Hapus elemen post dari halaman
      const postElement = document.getElementById(`post-${postId}`);
      if (postElement) {
        postElement.remove();
      }
    } else {
      alert("Failed to delete post: " + data.message);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
