// Daftar gambar yang tersedia
var images = [];
for (var i = 1; i <= 19; i++) {
  images.push("./images/FAMGET2024/" + i + ".png");
}

// Fungsi untuk mendapatkan parameter dari URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Mendapatkan parameter 'file' dari URL
var fileParam = getQueryParam("file");

// Jika ada parameter file, gunakan gambar tersebut, jika tidak, pilih gambar acak
var randomImage;
if (fileParam) {
  // Memastikan fileParam adalah salah satu gambar dalam array
  if (images.includes("./images/FAMGET2024/" + fileParam)) {
    randomImage = "./images/FAMGET2024/" + fileParam;
  } else {
    randomImage = images[Math.floor(Math.random() * images.length)];
  }
} else {
  // Pilih gambar acak jika tidak ada parameter file
  randomImage = images[Math.floor(Math.random() * images.length)];
}

// Atur gambar acak sebagai src elemen img
document.getElementById("imgfarmer").src = randomImage;

const imgElement = document.getElementById("uploaded-image");
let scale = 1;
let lastScale = 1;

const hammer = new Hammer(imgElement);

hammer.get("pinch").set({ enable: true });

hammer.on("pinch", function (ev) {
  scale = lastScale * ev.scale;
  imgElement.style.transform = `scale(${scale})`;
});

hammer.on("pinchend", function () {
  lastScale = scale;
});

// batas

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;

function disableScroll() {
  window.addEventListener("touchmove", preventDefault, wheelOpt);
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

function enableScroll() {
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

const position = { x: 0, y: 0 };

interact("#uploaded-image").draggable({
  listeners: {
    move(event) {
      position.x += event.dx;
      position.y += event.dy;

      // Terapkan posisi ke gambar
      event.target.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;
      disableScroll();
    },
    end(event) {
      enableScroll();
    },
  },
});

$(document).ready(function () {
  var namafilenyaq =
    localStorage.getItem("deviceIDi") + "_" + generateString(15);
  $("#namaupload").val(namafilenyaq);
  $("#hidden_datanama").val(namafilenyaq);
  $("#hidden_datauser").val(localStorage.getItem("deviceIDi"));

  $("input[name='FileOne']").on("change", function (event1) {
    var file = event1.target.files[0];
    var img = new Image();
    $("#modfinis").hide();
    img.onload = function () {
      var originalWidth = img.width;
      var originalHeight = img.height;

      // Hitung rasio aspek
      var frameWidth = $("#html-content-holder").width();
      var frameHeight = $("#html-content-holder").height();
      var frameAspectRatio = frameWidth / frameHeight;
      var imageAspectRatio = originalWidth / originalHeight;

      // Sesuaikan ukuran gambar berdasarkan rasio aspek
      if (imageAspectRatio > frameAspectRatio) {
        // Gambar lebih lebar daripada bingkai
        var newWidth = frameWidth;
        var newHeight = (newWidth / originalWidth) * originalHeight;
      } else {
        // Gambar lebih tinggi daripada bingkai
        var newHeight = frameHeight;
        var newWidth = (newHeight / originalHeight) * originalWidth;
      }

      // Set ukuran gambar
      $("#uploaded-image").attr("src", URL.createObjectURL(file));
      $("#uploaded-image").css({
        width: newWidth + "px",
        height: newHeight + "px",
        transform: `translate(0px, 0px) scale(1)`,
      });

      position.x = 0; // Reset posisi
      position.y = 0; // Reset posisi
      scale = 1; // Reset skala
      $("#btn_convert").show();
      $("#customRange3").show();
    };
    img.src = URL.createObjectURL(file);
  });

  $("#customRange3").on("input", function () {
    scale = 1 + $(this).val() / 100; // Skala gambar berdasarkan nilai slider
    $("#uploaded-image").css(
      "transform",
      `translate(${position.x}px, ${position.y}px) scale(${scale})`
    );
  });
  $(".pilihanimag").click(function () {
    var gambarnew = $(this).attr("src");
    var namafilenyag =
      localStorage.getItem("deviceIDi") + "_" + generateString(15);
    $("#namaupload").val(namafilenyag);
    $("#hidden_datanama").val(namafilenyag);
    $("#imgfarmer").attr("src", gambarnew);

    var typenya = $(this).attr("data-id");
    $("#hidden_datatype").val(typenya);
  });

  document
    .getElementById("btn_convert")
    .addEventListener("click", function (e) {
      e.preventDefault();
      $("#btn_convert").hide();
      $("#barload").show();
      $("#customRange3").hide();

      html2canvas(document.getElementById("html-content-holder"), {
        scale: 5, // Mengatur skala lebih tinggi untuk kualitas
        allowTaint: true,
        useCORS: true,
      }).then(function (canvas) {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        kirimdata(imgData);
        var anchorTag = document.createElement("a");
        //  var namafile = $("#namaupload").val() + ".jpg";
        var namafile = "famget_" + generateString(5) + ".jpg";
        document.body.appendChild(anchorTag);
        anchorTag.download = namafile;
        anchorTag.href = imgData;
        anchorTag.click();

        $("#modte").html(
          "File telah di-download, silahkan cek di folder Download browser"
        );
      });
    });
});
