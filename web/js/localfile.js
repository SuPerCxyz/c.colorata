function displayFiles(data, step, storage_type, source_path, return_path) {
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
    th1.classList.add("returnIcon");
    headerRow.addEventListener("click", () => {
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
          step -= 1;
          displayFiles(
            data.data,
            step,
            storage_type,
            return_path,
            next_return_path
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

  th2.textContent = source_path;
  th3.textContent = null;
  th4.textContent = null;

  headerRow.appendChild(th1);
  headerRow.appendChild(th2);
  headerRow.appendChild(th3);
  headerRow.appendChild(th4);
  listHeader.appendChild(headerRow);

  data.forEach((item) => {
    const item_path = item.path;
    const tr = document.createElement("tr");
    tr.classList.add("file-entry");

    const contentType = document.createElement("td");
    if (item.content_type == "dir") {
      contentType.classList.add("folderIcon");
      tr.addEventListener("dblclick", () => {
        const requestData = {
          storageType: storage_type,
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
            step += 1;
            displayFiles(data.data, step, storage_type, item_path, source_path);
          })
          .catch((error) => {
            showCustomAlert(error);
          });
      });
    } else if (item.content_type == "file") {
      contentType.classList.add("fileIcon");
      tr.addEventListener("dblclick", () => {
        const requestData = {
          storageType: storage_type,
          path: item_path,
        };
        fetch("/api/file/download", {
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
      displayFiles(
        data.data,
        step,
        item.storage_type,
        source_path,
        return_path
      );
    })
    .catch((error) => {
      showCustomAlert(error);
    });
}
