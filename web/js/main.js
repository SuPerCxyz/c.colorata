document.addEventListener("DOMContentLoaded", () => {
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
  }, 3000); // 3秒后自动隐藏
}
