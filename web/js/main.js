document.addEventListener("DOMContentLoaded", () => {
  checkLoggedIn();
  displayButtonAndModal();
  handleBackendData();
});

function showCustomAlert(error) {
  var customAlert = document.getElementById("customAlert");
  customAlert.innerText = error.message;
  customAlert.style.display = "block";

  // 设置一段时间后自动隐藏弹窗
  setTimeout(function () {
    customAlert.style.display = "none";
  }, 5000); // 5秒后自动隐藏
}


function checkLoggedIn() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  fetch("/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        // Load the main content of the page
        // Example: loadPageContent();
      } else {
        window.location.href = "/login";
      }
    })
    .catch((error) => {
      console.error(error);
      window.location.href = "/login";
    });
}