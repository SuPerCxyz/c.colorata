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
      Authorization: `Bearer ${localStorage.getItem("token")}`,
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

// 打开文件上传弹窗
function openFileUploadDialog() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.addEventListener("change", handleFileUpload);

  const modal = document.createElement("div");
  modal.id = "fileUploadModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.background = "white";
  modal.style.border = "1px solid #ccc";
  modal.style.padding = "20px";

  modal.appendChild(fileInput);
  document.body.appendChild(modal);

  // // 阻止弹窗内点击事件冒泡
  // modal.addEventListener("click", (event) => {
  //   event.stopPropagation();
  // });

  // // 在 document 上监听点击事件
  // document.addEventListener("click", (event) => {
  //   if (!modal.contains(event.target)) {
  //     modal.remove();
  //   }
  // });
}

// 处理文件上传
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    const tableHeader = document.querySelector("thead th:nth-child(2)");
    const targetPath = tableHeader.textContent;
    formData.append("file", file);
    formData.append("request_path", targetPath);

    const messageDiv = document.createElement("div");
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "50%";
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translate(-50%, -50%)";
    messageDiv.style.background = "white";
    messageDiv.style.border = "1px solid #ccc";
    messageDiv.style.padding = "20px";
    document.body.appendChild(messageDiv);
    const fileUploadModal = document.getElementById("fileUploadModal");

    fetch("/file/localfile/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        messageDiv.textContent = `上传中：${progress}%`;
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        messageDiv.textContent = responseData.message;
      })
      .catch((error) => {
        messageDiv.textContent = "上传文件时发生错误";
        console.error(error);
      });
    fileUploadModal.style.display = "none";
    setTimeout(() => {
      messageDiv.remove();
    }, 1000);
  }
}

function displayFiles(
  data,
  step,
  storage_name,
  storage_type,
  current_path,
  request_path
) {
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = "";
  const listTable = document.createElement("table");
  listTable.classList.add("file-entry");
  const listHeader = document.createElement("thead");
  listHeader.classList.add("file-entry");
  const listBody = document.createElement("tbody");
  listBody.classList.add("file-entry");

  const headerRow = document.createElement("tr");
  headerRow.classList.add("file-entry");

  const th1 = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");

  if (step > 0) {
    const regex = /\/[^/]+$/;
    th1.classList.add("returnIcon");
    headerRow.addEventListener("dblclick", () => {
      request_path = current_path.replace(regex, "");
      const requestData = {
        storage_name: storage_name,
        request_path: request_path,
      };
      fetch("/file/localfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    headerRow.addEventListener("dblclick", () => {
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
      tr.addEventListener("dblclick", () => {
        const requestData = {
          storage_name: storage_name,
          request_path: request_path,
        };
        fetch("/file/localfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const contextMenu = document.createElement("div");
  contextMenu.id = "contextMenu";
  contextMenu.style.display = "none";
  contextMenu.style.position = "absolute";
  contextMenu.style.background = "white";
  contextMenu.style.border = "1px solid #ccc";
  dataList.appendChild(contextMenu);

  // const ul = document.createElement("ul");
  // const menuItems = ["上传文件demo"];
  // menuItems.forEach((itemText, index) => {
  //   const li = document.createElement("li");
  //   li.textContent = itemText;
  //   if (index === 0) {
  //     li.addEventListener("click", () => {
  //       contextMenu.style.display = "none";
  //       openFileUploadDialog();
  //     });
  //   } else {
  //     li.addEventListener("click", () => {
  //       contextMenu.style.display = "none";
  //       // 在这里可以处理选项2和选项3的操作
  //     });
  //   }
  //   ul.appendChild(li);
  // });
  // contextMenu.appendChild(ul);

  // // 右键点击事件
  // listTable.addEventListener("contextmenu", (e) => {
  //   e.preventDefault();
  //   const x = e.clientX;
  //   const y = e.clientY;

  //   contextMenu.style.left = `${x}px`;
  //   contextMenu.style.top = `${y}px`;
  //   contextMenu.style.display = "block";
  // });

  // document.addEventListener("click", (e) => {
  //   if (!contextMenu.contains(e.target)) {
  //     contextMenu.style.display = "none";
  //   }
  // });

  const ul = document.createElement('ul');
  const menuItems = ['上传文件demo'];
  menuItems.forEach((itemText, index) => {
    const li = document.createElement('li');
    li.textContent = itemText;
    if (index === 0) {
      li.addEventListener('click', () => {
        contextMenu.style.display = 'none';
        openFileUploadDialog();
      });
    } else {
      li.addEventListener('click', () => {
        contextMenu.style.display = 'none';
        // 在这里可以处理选项2和选项3的操作
      });
    }
    ul.appendChild(li);
  });
  contextMenu.appendChild(ul);

  // 右键点击事件
  listTable.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;

    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = 'block';
  });

  document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
      contextMenu.style.display = 'none';
    }
  });
}
