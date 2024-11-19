function sendNotif(topic, title, body) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const idToken = localStorage.getItem("ptoken");
  const raw = JSON.stringify({
    idToken: idToken,
    topic: topic,
    title: title,
    body: body,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://nextfire-two-ruby.vercel.app/api/send-message", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
