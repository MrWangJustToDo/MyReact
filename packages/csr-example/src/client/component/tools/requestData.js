import axios from "axios";

// 网络请求相关

// 使用get请求特定资源
function axiosGet(path) {
  return axios.get(path).then((res) => res.data);
}

// 使用post请求
function axiosPost(path, data) {
  return axios.post(path, data).then((res) => res.data);
}

// 文件提交
function submitFile(relativePath, newContent) {
  return axios
    .post(`/api/submit`, { relativePath, newContent })
    .then((res) => res.data);
}

// 文件删除数组
function deleteFiles(files) {
  return axios.post("/api/delete", { files }).then((res) => res.data);
}

// 文件重命名
function renameFile(relativePath, originName, newName) {
  return axios
    .post(`/api/rename`, { relativePath, originName, newName })
    .then((res) => res.data);
}

// 文件创建
function addFile(relativePath, fileName) {
  return axios
    .post(`/api/createFile`, { relativePath, fileName })
    .then((res) => res.data);
}

// 文件移到回收站
function moveFile(shortName, srcRelativePath) {
  return axios
    .post(`/api/recoverItem`, { shortName, srcRelativePath })
    .then((res) => res.data);
}

// 文件下载
function downloadFile(relativePath, fileName) {
  let a = document.createElement("a");
  a.href = `/api/src/${relativePath}`;
  a.setAttribute("download", fileName);
  a.style.display = "none";
  document.body.append(a);
  a.click();
  a.remove();
  // return axios({
  //   url: "/download",
  //   method: "post",
  //   data: { relativePath, fileName },
  //   responseType: "blob",
  // }).then((res) => {
  //   if (res.status === 200) {
  //     const url = window.URL.createObjectURL(new Blob([res.data]));
  //     const link = document.createElement("a");
  //     link.style.display = "none";
  //     link.href = url;
  //     link.setAttribute("download", fileName);
  //     document.body.append(link);
  //     link.click();
  //     URL.revokeObjectURL(link.href);
  //     link.remove();
  //   }
  // });
}

// 文件上传
function uploadFile(progress, formData) {
  let config = {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: function (e) {
      //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
      //如果lengthComputable为false，就获取不到e.total和e.loaded
      if (e.lengthComputable) {
        var rate = e.loaded / e.total; //已上传的比例
        progress.style.backgroundImage = `linear-gradient(to right, rgba(9, 170, 255, .5) ${(
          rate * 100
        ).toFixed(2)}%, white 0, white 100%)`;
      }
    },
  };
  return axios.post("/api/upload", formData, config).then((res) => res.data);
}

// 文件复制
function copyFile(fileName, srcRelativePath, targetRelativePath) {
  return axios
    .post("/api/copyFile", { fileName, srcRelativePath, targetRelativePath })
    .then((res) => res.data);
}

// 文件夹创建
function addDir(relativePath, folderName) {
  return axios
    .post(`/api/createFolder`, { relativePath, folderName })
    .then((res) => res.data);
}

// 降频
function low(func, time) {
  let flag = true;
  return function (...args) {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, time);
      return func.call(this, ...args);
    } else {
      return Promise.reject();
    }
  };
}

// 防抖
function delay(func, time) {
  let id;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => {
      func.call(this, ...args);
    }, time);
  };
}

// 登录请求
function login(config) {
  return axios.post("/api/login", { ...config }).then((res) => res.data);
}

// 退出登录
function logout() {
  return axios.post("/api/logout").then((res) => res.data);
}

// 判断自动登录
function autoLogin() {
  return axios.get("/api/autoLogin").then((res) => res.data);
}

// 注册请求
function register(config) {
  return axios.post("/api/register", { ...config }).then((res) => res.data);
}

export {
  axiosGet,
  axiosPost,
  submitFile,
  renameFile,
  moveFile,
  addFile,
  deleteFiles,
  downloadFile,
  addDir,
  copyFile,
  uploadFile,
  low,
  delay,
  login,
  logout,
  autoLogin,
  register,
};
