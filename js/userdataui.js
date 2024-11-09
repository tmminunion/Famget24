document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("name");
  const storedName = localStorage.getItem("puserName");
  const storedPhoto =
    localStorage.getItem("puserPhoto") ||
    "https://leocosta1.github.io/instagram-clone/assets/default-user.png";
  const isVerified = localStorage.getItem("verifikasiaku");

  // Update name and profile picture
  if (storedName) {
    $("#namauser").text(storedName);
    nameInput.value = storedName;
    $("#ppcard").attr("src", storedPhoto);
    $("#foto").attr("src", storedPhoto);
    var datuid = "Uid = " + localStorage.getItem("uid");
    $("#emailuser").text(datuid);
  }

  // Check if user is verified
  if (isVerified === "1") {
    // Display verified badge if user is verified
    document.getElementById("verified-badge").style.display = "block";
  }
});

function copyToClipboard() {
  // Get the UID text
  const uidText = document
    .getElementById("emailuser")
    .innerText.replace("Uid = ", "");

  // Create a temporary textarea to copy text
  const textarea = document.createElement("textarea");
  textarea.value = uidText;
  document.body.appendChild(textarea);

  // Select and copy the text
  textarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea element
  document.body.removeChild(textarea);

  // Optionally, alert the user that the UID has been copied
  alert("UID copied to clipboard!");
}
