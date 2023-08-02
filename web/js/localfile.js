// 封装成函数，负责生成文件夹选项并添加到页面中
function displayFiles(data) {
    const dataList = document.getElementById("dataList");
    data.forEach(item => {
        const li = document.createElement("tr");
        li.classList.add("file-entry");

        const contentType = document.createElement("td");
        contentType.textContent = item.content_type;
        contentType.classList.add("file-info");
        li.appendChild(contentType);

        const fileInfoName = document.createElement("td");
        const fileUrl = document.createElement("a");
        fileUrl.textContent = item.name;
        fileUrl.href = decodeURIComponent(item.name);
        fileInfoName.appendChild(fileUrl);
        li.appendChild(fileInfoName);

        const fileInfoSize = document.createElement("td");
        fileInfoSize.textContent = item.content_type === "file" ? item.size ?? "未知" : "-";
        fileInfoSize.classList.add("file-info-size");
        li.appendChild(fileInfoSize);

        const fileInfoTime = document.createElement("td");
        fileInfoTime.textContent = item.modify_time ? new Date(item.modify_time).toLocaleString() : "修改时间：未知";
        fileInfoTime.classList.add("file-info-time");
        li.appendChild(fileInfoTime);

        dataList.appendChild(li);
    });
}
