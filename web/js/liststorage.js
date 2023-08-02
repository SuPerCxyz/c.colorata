// 由按钮调用的函数，用于加载 localfile.js 并执行 displayFiles 函数
function loadAndDisplayFiles() {
    const dataListElement = document.getElementById('dataList');
    dataListElement.innerHTML = ''; // 清空之前的数据
    fetch("/api/file")
        .then(response => response.json())
        .then(data => {
            displayFiles(data.data);
        })
        .catch(error => {
            console.error("获取数据时出错:", error);
        });
}

// 函数用于从后端API获取数据、处理数据并展示在页面上
async function handleBackendData() {
    try {
      // 从后端API获取数据
      const response = await fetch("/api/storages");
      const data = await response.json();

      // 处理数据并展示在页面上
      const dataListElement = document.getElementById("dataList");
      dataListElement.innerHTML = ""; // 清空现有数据

      data.data.forEach(item => {
        const listItem = document.createElement("tr");

        const typeIcon = document.createElement("td");
        typeIcon.classList.add("localicon");
        listItem.appendChild(typeIcon);

        const storageType = document.createElement("td");
        storageType.textContent = item.storage_type;
        listItem.appendChild(storageType);

        const storageName = document.createElement("td");
        storageName.textContent = item.name;
        listItem.appendChild(storageName);

        const storagePath = document.createElement("td");
        storagePath.textContent = item.path;
        listItem.appendChild(storagePath);

        // 添加点击事件监听器，直接调用callFileListApi函数
        listItem.addEventListener("click", loadAndDisplayFiles);

        dataListElement.appendChild(listItem);
      });
    } catch (error) {
      console.error("处理后端数据时出错：", error);
    }
  }

  // 页面加载时调用handleBackendData函数
document.addEventListener("DOMContentLoaded", handleBackendData);

const returnLink = document.getElementById('returnLink');
returnLink.addEventListener('click', () => {
  window.location.href = previousPageURL; // 导航回前一个页面
});
