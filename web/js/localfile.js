function displayFiles(data, storage_type, source_path, return_path) {
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = "";
  const listBody = document.createElement("tbody");

  if (return_path) {
    const tr = document.createElement("tr");
    tr.classList.add("file-entry");
    tr.addEventListener("dblclick", () => {
      const requestData = {
        storageType: storage_type,
        path: return_path,
      };
      fetch("/api/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          let next_return_path = return_path.replace(/\/[^/]*$/, "");
          displayFiles(data.data, storage_type, return_path, next_return_path);
        })
        .catch((error) => {
          console.error("获取数据时出错:", error);
        });
    });

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td1.classList.add("returnIcon");
    tr.appendChild(td1);
    td2.textContent = source_path;
    td2.classList.add("file-info");
    tr.appendChild(td2);
    td3.classList.add("file-info-size");
    tr.appendChild(td3);
    td4.classList.add("file-info-time");
    tr.appendChild(td4);
    listBody.appendChild(tr);
  }

  data.forEach((item) => {
    const item_path = item.path;
    const tr = document.createElement("tr");
    tr.classList.add("file-entry");

    const contentType = document.createElement("td");
    if (item.content_type == "dir") {
      contentType.classList.add("folderIcon");
      tr.addEventListener("dblclick", () => {
        const requestData = {
          storageType: item.storage_type,
          path: item_path,
        };
        fetch("/api/file", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => response.json())
          .then((data) => {
            displayFiles(data.data, item.storage_type, item_path, source_path);
          })
          .catch((error) => {
            console.error("获取数据时出错:", error);
          });
      });
    } else if (item.content_type == "file") {
      contentType.classList.add("fileIcon");
    } else {
      contentType.classList.add("linkIcon");
    }
    tr.appendChild(contentType);

    const fileInfoName = document.createElement("td");
    fileInfoName.textContent = item_path;
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
  dataList.appendChild(listBody);
}

function loadAndDisplayFiles(item) {
  const return_path = null;
  const source_path = item.path;
  const requestData = {
    storageType: item.storage_type,
    path: source_path,
  };

  fetch("/api/file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      displayFiles(data.data, item.storage_type, source_path, return_path);
    })
    .catch((error) => {
      console.error("获取数据时出错:", error);
    });
}
