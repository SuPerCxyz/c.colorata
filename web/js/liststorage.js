async function handleBackendData() {
  // 处理数据并展示在页面上
  const dataListElement = document.getElementById("dataList");
  dataListElement.innerHTML = null;
  const listTable = document.createElement("table");
  listTable.classList.add("storage-entry");
  const listBody = document.createElement("tbody");
  listBody.classList.add("storage-entry");
  try {
    const token = localStorage.getItem("token");
    // 从后端API获取数据
    fetch("/file/storages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.data.forEach((item) => {
          const listItem = document.createElement("tr");
          listItem.classList.add("storage-entry");

          const typeIcon = document.createElement("td");
          typeIcon.classList.add("localicon");
          listItem.appendChild(typeIcon);

          const storageName = document.createElement("td");
          storageName.textContent = item.name;
          storageName.classList.add("storage-name");
          listItem.appendChild(storageName);

          const storageType = document.createElement("td");
          storageType.textContent = item.storage_type;
          storageType.classList.add("storage-type");
          listItem.appendChild(storageType);

          const storagePath = document.createElement("td");
          storagePath.textContent = item.path;
          storagePath.classList.add("storage-path");
          listItem.appendChild(storagePath);

          listItem.addEventListener("dblclick", () => {
            loadAndDisplayFiles(item);
          });
          listBody.appendChild(listItem);
        });
      });
    listTable.appendChild(listBody);
    dataListElement.appendChild(listTable);
  } catch (error) {
    console.error("处理后端数据时出错：", error);
  }
}

function displayButtonAndModal() {
  const dataListElement = document.getElementById("buttonAndModalContainer");
  dataListElement.innerHTML = null;
  // 创建按钮
  const openModalBtn = document.createElement("button");
  openModalBtn.textContent = "注册存储后端";

  // 创建弹窗容器
  const modalContainer = document.createElement("div");
  modalContainer.id = "modalContainer";

  // 创建弹窗内容
  const modalContent = document.createElement("div");
  modalContent.id = "myModal";

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "填写信息";

  const modalForm = document.createElement("form");
  modalForm.id = "myForm";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = "name";
  nameInput.placeholder = "存储后端名称";

  const stypeInput = document.createElement("input");
  stypeInput.type = "text";
  stypeInput.name = "stype";
  stypeInput.placeholder = "存储后端类型";

  const pathInput = document.createElement("input");
  pathInput.type = "text";
  pathInput.name = "path";
  pathInput.placeholder = "存储后端路径";

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.name = "username";
  usernameInput.placeholder = "存储认证名称";

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.name = "password";
  passwordInput.placeholder = "存储认证密码";

  const submitBtn = document.createElement("input");
  submitBtn.type = "submit";
  submitBtn.value = "提交";

  const closeModalBtn = document.createElement("button");
  closeModalBtn.textContent = "关闭";
  closeModalBtn.addEventListener("click", function () {
    modalContainer.style.display = "none"; // 关闭弹窗
  });

  // 将元素添加到弹窗内容中
  modalForm.appendChild(nameInput);
  modalForm.appendChild(stypeInput);
  modalForm.appendChild(pathInput);
  modalForm.appendChild(usernameInput);
  modalForm.appendChild(passwordInput);
  modalForm.appendChild(submitBtn);

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalForm);
  modalContent.appendChild(closeModalBtn);

  // 添加按钮点击事件处理
  openModalBtn.addEventListener("click", function () {
    modalContainer.style.display = "block"; // 显示弹窗容器
    modalContent.style.display = "block"; // 显示弹窗内容
  });

  // 表单提交事件处理
  modalForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var formDataArray = $("#myForm").serializeArray();
    var formData = {};
    formDataArray.forEach(function (item) {
      formData[item.name] = item.value;
    });
    console.log(formData);

    const token = localStorage.getItem("token");
    fetch("/file/storages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("请求成功");
          handleBackendData(); // 调用处理后端数据的函数
        } else {
          console.error("请求失败");
        }
      })
      .catch((error) => {
        console.error("请求出错", error);
      });
    modalContent.style.display = "none"; // 隐藏弹窗
  });

  // // 设置弹窗容器样式
  // modalContainer.style.display = "none";
  // // ...省略弹窗容器样式设置代码...

  // 监听页面点击事件
  // document.addEventListener("click", function (event) {
  //   const isClickInsideModal = modalContent.contains(event.target);
  //   if (!isClickInsideModal) {
  //     modalContainer.style.display = "none"; // 点击弹窗外部，关闭弹窗
  //   }
  // });

  // 将按钮添加到页面
  modalContainer.style.display = "none";
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "50%";
  modalContainer.style.left = "50%";
  modalContainer.style.transform = "translate(-50%, -50%)";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modalContainer.style.width = "300px";
  modalContainer.style.padding = "20px";
  modalContainer.style.borderRadius = "10px";
  modalContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  modalContainer.style.zIndex = "9999"; // 确保弹窗在最前面

  // 将按钮和弹窗容器添加到页面
  dataListElement.appendChild(openModalBtn);
  dataListElement.appendChild(modalContainer);
  modalContainer.appendChild(modalContent);
}
