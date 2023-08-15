function displayFiles(
  data,
  step,
  storage_name,
  storage_type,
  current_path,
  request_path
) {
  uploadFile();
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = "";
  const listTable = document.createElement("table");
  const listHeader = document.createElement("thead");
  const listBody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  headerRow.classList.add("file-entry");

  const th1 = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");

  if (step > 0) {
    const regex = /\/[^/]+$/;
    th1.classList.add("returnIcon");
    headerRow.addEventListener("click", () => {
      request_path = current_path.replace(regex, "");
      const requestData = {
        storage_name: storage_name,
        request_path: request_path,
      };
      fetch("/file/localfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          step -= 1;
          displayFiles(
            data.data,
            step,
            storage_name,
            storage_type,
            request_path,
            request_path
          );
        })
        .catch((error) => {
          showCustomAlert(error);
        });
    });
    headerRow.appendChild(th1);
  } else {
    th1.classList.add("indexIcon");
    headerRow.addEventListener("click", () => {
      handleBackendData();
    });
    headerRow.appendChild(th1);
  }
  th2.classList.add("file-info");
  th3.classList.add("file-info-size");
  th4.classList.add("file-info-time");

  th2.textContent = request_path;
  th3.textContent = null;
  th4.textContent = null;

  headerRow.appendChild(th1);
  headerRow.appendChild(th2);
  headerRow.appendChild(th3);
  headerRow.appendChild(th4);
  listHeader.appendChild(headerRow);

  data.forEach((item) => {
    const request_path = current_path + "/" + item.name;
    const item_path = item.path;
    const tr = document.createElement("tr");
    tr.classList.add("file-entry");

    const contentType = document.createElement("td");
    if (item.content_type == "dir") {
      contentType.classList.add("folderIcon");
      tr.addEventListener("click", () => {
        const requestData = {
          storage_name: storage_name,
          request_path: request_path,
        };
        fetch("/file/localfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => response.json())
          .then((data) => {
            step += 1;
            displayFiles(
              data.data,
              step,
              storage_name,
              storage_type,
              request_path,
              request_path
            );
          })
          .catch((error) => {
            showCustomAlert(error);
          });
      });
    } else if (item.content_type == "file") {
      contentType.classList.add("fileIcon");
      tr.addEventListener("dblclick", () => {
        const requestData = {
          storage_name: storage_name,
          request_path: request_path,
        };
        fetch("/file/localfile/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => response.blob())
          .then((blob) => {
            const fileName = item_path.substring(
              item_path.lastIndexOf("/") + 1
            );
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
          })
          .catch((error) => {
            showCustomAlert(error);
          });
      });
    } else {
      contentType.classList.add("linkIcon");
    }
    tr.appendChild(contentType);

    const fileInfoName = document.createElement("td");
    fileInfoName.textContent = item.name;
    fileInfoName.classList.add("file-info");
    tr.appendChild(fileInfoName);

    const fileInfoSize = document.createElement("td");
    fileInfoSize.textContent =
      item.content_type === "file" ? item.size ?? "未知" : "-";
    fileInfoSize.classList.add("file-info-size");
    tr.appendChild(fileInfoSize);

    const fileInfoTime = document.createElement("td");
    fileInfoTime.textContent = item.modify_time
      ? new Date(item.modify_time).toLocaleString()
      : "修改时间：未知";
    fileInfoTime.classList.add("file-info-time");
    tr.appendChild(fileInfoTime);

    listBody.appendChild(tr);
  });
  listTable.appendChild(listHeader);
  listTable.appendChild(listBody);
  dataList.appendChild(listTable);
}

function loadAndDisplayFiles(item) {
  const step = 0;
  const current_path = "";
  const request_path = "";
  const requestData = {
    storage_name: item.name,
    request_path: request_path,
  };

  fetch("/file/localfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      displayFiles(
        data.data,
        step,
        item.name,
        item.storage_type,
        current_path,
        request_path
      );
    })
    .catch((error) => {
      showCustomAlert(error);
    });
}

function uploadFile() {
  const appDiv = document.getElementById("uploadfile");
  appDiv.innerHTML = null;

  // 创建上传文件按钮
  const openUploadModalBtn = document.createElement("button");
  openUploadModalBtn.textContent = "上传文件";

  // 创建弹窗容器
  const modalContainer = document.createElement("div");
  modalContainer.id = "uploadModalContainer";

  // 创建弹窗内容
  const modalContent = document.createElement("div");
  modalContent.id = "uploadModalContent";
  modalContent.style.display = "none"; // 初始状态隐藏

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "fileInput";

  const uploadButton = document.createElement("button");
  uploadButton.textContent = "上传";
  uploadButton.id = "modalUploadButton";

  const messageDiv = document.createElement("div");
  messageDiv.id = "modalMessage";

  // 将元素添加到弹窗内容中
  modalContent.appendChild(fileInput);
  modalContent.appendChild(uploadButton);
  modalContent.appendChild(messageDiv);

  // 添加上传文件按钮点击事件处理
  openUploadModalBtn.addEventListener("click", function () {
    modalContent.style.display = "block"; // 显示弹窗内容
  });

  // 上传按钮点击事件处理
  uploadButton.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      messageDiv.textContent = "请选择要上传的文件";
      return;
    }
    const tableHeader = document.querySelector("thead th:nth-child(2)");
    const targetPath = tableHeader.textContent;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("request_path", targetPath);

    try {
      const response = await fetch("/file/localfile/upload", {
        method: "POST",
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          messageDiv.textContent = `上传中：${progress}%`;
        },
      });

      const responseData = await response.json();
      messageDiv.textContent = responseData.message;
    } catch (error) {
      messageDiv.textContent = "上传文件时发生错误";
      console.error(error);
    }
  });

  // // 设置弹窗容器样式
  // modalContainer.style.display = "none"; // 初始状态隐藏
  // // ...省略弹窗容器样式设置代码...

  // // 监听页面点击事件
  // document.addEventListener("click", function (event) {
  //   const isClickInsideModal = modalContent.contains(event.target);
  //   if (!isClickInsideModal) {
  //     modalContent.style.display = "none"; // 点击弹窗外部，关闭弹窗
  //   }
  // });

  // 将上传文件按钮和弹窗容器添加到页面
  appDiv.appendChild(openUploadModalBtn);
  appDiv.appendChild(modalContainer);
  modalContainer.appendChild(modalContent);
}
