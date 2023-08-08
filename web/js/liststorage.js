async function handleBackendData() {
  try {
    // 从后端API获取数据
    const response = await fetch("/api/storages");
    const data = await response.json();

    // 处理数据并展示在页面上
    const dataListElement = document.getElementById("dataList");
    dataListElement.innerHTML = null;
    const listTable = document.createElement("table");
    const listBody = document.createElement("tbody");

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
    listTable.appendChild(listBody);
    dataListElement.appendChild(listTable);
  } catch (error) {
    console.error("处理后端数据时出错：", error);
  }
}

$(document).ready(function () {
  // 点击按钮打开弹窗
  $("#openModalBtn").click(function () {
    $("#myModal").show();
  });

  // 表单提交事件
  $("#myForm").submit(function (e) {
    e.preventDefault(); // 阻止表单默认提交行为

    // 获取表单数据
    var formDataArray = $("#myForm").serializeArray();
    var formData = {};
    formDataArray.forEach(function (item) {
      formData[item.name] = item.value;
    });

    // 发送POST请求
    $.ajax({
      url: "/api/storages", // 替换成你的服务器URL
      method: "POST",
      data: JSON.stringify(formData),
      success: function (response) {
        // 请求成功处理逻辑
        console.log("请求成功", response);
        handleBackendData();
      },
      error: function (err) {
        // 请求失败处理逻辑
        console.error("请求失败", err);
      },
    });

    // 关闭弹窗
    $("#myModal").hide();
  });
});
