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
      fetch("/api/file", {
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
      tr.addEventListener("dblclick", () => {
        const requestData = {
          storage_name: storage_name,
          request_path: request_path,
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
  const current_path = "";
  const request_path = "";
  const requestData = {
    storage_name: item.name,
    request_path: request_path,
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
