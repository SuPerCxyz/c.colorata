async function handleBackendData() {
  try {
    // 从后端API获取数据
    const response = await fetch("/api/storages");
    const data = await response.json();

    // 处理数据并展示在页面上
    const dataListElement = document.getElementById("dataList");
    dataListElement.innerHTML = null;
    const listBody = document.createElement("tbody");

    data.data.forEach((item) => {
      const listItem = document.createElement("tr");

      const typeIcon = document.createElement("td");
      typeIcon.classList.add("localicon");
      listItem.appendChild(typeIcon);

      const storageType = document.createElement("td");
      storageType.textContent = item.storage_type;
      storageType.classList.add("storage-type");
      listItem.appendChild(storageType);

      const storageName = document.createElement("td");
      storageName.textContent = item.name;
      storageName.classList.add("storage-name");
      listItem.appendChild(storageName);

      const storagePath = document.createElement("td");
      storagePath.textContent = item.path;
      storagePath.classList.add("storage-path");
      listItem.appendChild(storagePath);

      listItem.addEventListener("dblclick", () => {
        loadAndDisplayFiles(item);
      });

      listBody.appendChild(listItem);
    });
    dataListElement.appendChild(listBody);
  } catch (error) {
    console.error("处理后端数据时出错：", error);
  }
}
