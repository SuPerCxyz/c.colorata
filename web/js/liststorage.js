// 由按钮调用的函数，用于加载 localfile.js 并执行 displayFiles 函数
function loadAndDisplayFiles() {
    const iconElement = document.querySelector('#myButton .icon');
    // 切换图标的显示和隐藏状态
    iconElement.classList.toggle('icon-hidden');

    fetch("/file/list")
        .then(response => response.json())
        .then(data => {
            displayFiles(data.data);
        })
        .catch(error => {
            console.error("获取数据时出错:", error);
        });
}
