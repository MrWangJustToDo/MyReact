const fs = require("fs");
const path = require("path");
const express = require("express");

// 文件传入流对象
const MyReadAbleStream = require("./lib/readAbleStream").MyReadable;
// 获取指定文件夹中数据
const { getFolder, getFolderSize } = require("./lib/getFolder");
// 将项目移动到回收站
const moveItemByPath = require("./lib/moveItem").moveItem;
// 删除文件/文件夹
const deleteItemByPath = require("./lib/deleteItem").deleteItem;
// 重命名文件
const renameItemByPath = require("./lib/renameItem").renameItemByPath;
// 新建文件
const createFileByPath = require("./lib/createFile").createFileByPath;
// 复制文件
const copyFileByPath = require("./lib/copyFile").copyFileByPath;
// 新建文件夹
const createFolderByPath = require("./lib/createFolder").createFolderByPath;
// 获取文件一些基本信息
const { getLengthByNumber, getLengthByPath } = require("./lib/tools");
// 存放websocket映射的对象
const wsToMap = {};

let getCurrentFolder = express();
let getRecoverFolder = express();
let getCurrentFileByPost = express();
let getCurrentFileByGet = express();
let getCurrentFileSize = express();
let submitFile = express();
let uploadFile = express();
let deleteItem = express();
let renameItem = express();
let recoverItem = express();
let createFile = express();
let copyFile = express();
let createFolder = express();
let downloadFile = express();

// 使用websocket获取根文件夹大小
async function sendRootFolderSize(ws, req) {
  let re = await getFolderSize(req.rootFolder);
  ws.send(re);
}

// 请求指定文件夹
getCurrentFolder.use(async (req, res, next) => {
  try {
    let currentPath = path.join(
      req.rootFolder,
      req.body.requestPath.split("/all")[1] || ""
    );
    let data = await getFolder(req.rootFolder, currentPath);
    res.json({ code: 0, state: data });
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
  try {
    await sendRootFolderSize(wsToMap[req.user.username], req);
  } catch (e) {}
});

// 请求回收站中文件
getRecoverFolder.use(async (req, res, next) => {
  try {
    let data = await getFolder(req.recoverFolder, req.recoverFolder);
    res.json({ code: 0, state: data });
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
});

// 请求文件
getCurrentFileByPost.use(async (req, res, next) => {
  try {
    let currentPath = path.join(req.rootFolder, req.body.requestPath);
    console.log("获取文件: ", currentPath);
    await res.sendFile(currentPath);
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
});

getCurrentFileByGet.use(async (req, res, next) => {
  try {
    let currentPath = path.join(req.rootFolder, req.path);
    console.log("获取文件: ", currentPath);
    await res.sendFile(currentPath);
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
});

// 获取文件更新后的大小
getCurrentFileSize.use(async (req, res, next) => {
  let currentFile = path.resolve(req.rootFolder, req.body.relativePath);
  console.log("获取文件大小: ", currentFile);
  try {
    let length = await getLengthByPath(currentFile);
    res.json({
      code: 0,
      state: {
        length: length,
        readAbleLength: getLengthByNumber(length),
      },
    });
  } catch (e) {
    console.log(e);
    res.json({
      code: -1,
      state: "fail",
    });
  }
});

// 更新文件
submitFile.use(async (req, res, next) => {
  let currentFile = path.resolve(req.rootFolder, req.body.relativePath);
  console.log("提交文件更改: ", currentFile);
  let content = req.body.newContent;
  let index = 0;
  let mStream = new MyReadAbleStream({
    highWaterMark: 512,
    read() {
      if (index < content.length) {
        this.push(
          content.slice(
            index,
            index + 100 < content.length ? index + 100 : content.length
          )
        );
        index += 100;
      } else {
        this.push(null);
      }
    },
  });
  mStream.pipe(fs.createWriteStream(currentFile));
  mStream.on("end", () => {
    console.log("修改成功");
    res.json({
      code: 0,
      state: "success",
    });
  });
  mStream.on("error", (err) => {
    console.log("修改失败", err);
    res.json({
      code: -1,
      state: "fail",
    });
  });
  try {
    await sendRootFolderSize(wsToMap[req.user.username], req);
  } catch (e) {}
});

// 上传文件
uploadFile.use(async (req, res, next) => {
  // 获取上传的文件,将其移动到指定文件夹
  req.body.uploadFolder = path.resolve(req.rootFolder, req.body.uploadFolder);
  let re;
  try {
    // 获取根文件夹大小
    re = await getFolderSize(req.rootFolder);
    if (+re + req.file.size > 1000000000) {
      throw new Error("空间超出限制");
    }
    // 移动文件
    await moveItemByPath(
      req.file.filename,
      req.file.destination,
      req.body.uploadFolder
    );
    // 重命名
    await renameItemByPath(
      req.body.uploadFolder,
      req.file.filename,
      req.file.originalname
    );
    res.json({ code: 0, state: "success" });
  } catch (e) {
    console.log(e);
    // 尝试删除上传的文件
    try {
      await deleteItemByPath(req.recoverDir, {
        type: "file",
        path: req.file.path,
      });
    } catch (e) {}
    try {
      await deleteItemByPath(req.body.uploadFolder, {
        type: "file",
        path: path.resolve(req.body.uploadFolder, req.file.filename),
      });
    } catch (e) {}
    res.json({ code: -1, state: "fail" });
  }
  try {
    wsToMap[req.user.username].send(+re + req.file.size);
  } catch (e) {}
});

// 删除文件/文件夹
deleteItem.use(async (req, res, next) => {
  let currentFiles = req.body.files;
  console.log("删除文件: ", currentFiles);
  try {
    await Promise.all(
      currentFiles.map((it) => deleteItemByPath(req.rootFolder, it))
    );
    res.json({ code: 0, state: "success" });
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
  try {
    await sendRootFolderSize(wsToMap[req.user.username], req);
  } catch (e) {}
});

// 重命名文件/文件夹
renameItem.use(async (req, res, next) => {
  let srcResolvePath = path.resolve(req.rootFolder, req.body.relativePath);
  let originName = req.body.originName;
  let newName = req.body.newName;
  console.log(
    "在",
    srcResolvePath,
    "文件夹中重命名文件: ",
    originName,
    " -> ",
    newName
  );
  try {
    await renameItemByPath(srcResolvePath, originName, newName);
    res.json({ code: 0, state: "success" });
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
});

// 回收文件/文件夹
recoverItem.use(async (req, res, next) => {
  let shortName = req.body.shortName;
  let srcResolveDir = path.resolve(req.rootFolder, req.body.srcRelativePath);
  let targetResolveDir = path.resolve(req.rootFolder, req.recoverFolder);
  console.log(
    "在文件夹",
    req.body.srcRelativePath,
    "中,将: ",
    shortName,
    "移动到回收站中"
  );
  try {
    await moveItemByPath(shortName, srcResolveDir, targetResolveDir);
    res.json({ code: 0, state: "success" });
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
  try {
    await sendRootFolderSize(wsToMap[req.user.username], req);
  } catch (e) {}
});

// 新建文件
createFile.use(async (req, res, next) => {
  let currentPath = path.resolve(
    req.rootFolder,
    req.body.relativePath || "",
    req.body.fileName
  );
  console.log("将要创建文件: ", currentPath);
  try {
    await createFileByPath(currentPath);
    res.json({ code: 0, state: "success" });
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
  try {
    await sendRootFolderSize(wsToMap[req.user.username], req);
  } catch (e) {}
});

// 复制文件
copyFile.use(async (req, res, next) => {
  let fileName = req.body.fileName;
  let srcResolvePath = path.resolve(req.rootFolder, req.body.srcRelativePath);
  let targetResolvePath = path.resolve(
    req.rootFolder,
    req.body.targetRelativePath
  );
  console.log(
    fileName,
    "将要复制,从 ",
    srcResolvePath,
    "到",
    targetResolvePath
  );
  let re;
  try {
    await copyFileByPath(fileName, srcResolvePath, targetResolvePath);
    // 获取根文件夹大小
    re = await getFolderSize(req.rootFolder);
    if (re > 1000000000) {
      throw new Error("超出空间限制");
    }
    res.json({ code: 0, state: "success" });
  } catch (e) {
    console.log(e);
    // 尝试删除复制的文件
    try {
      await deleteItemByPath(targetResolvePath, {
        type: "file",
        path: fileName,
      });
    } catch (e) {}
    res.json({ code: -1, state: "fail" });
  }
  try {
    wsToMap[req.user.username].send(re);
  } catch (e) {}
});

// 创建文件夹
createFolder.use(async (req, res, next) => {
  let currentPath = path.resolve(
    req.rootFolder,
    req.body.relativePath || "",
    req.body.folderName
  );
  console.log("将要创建文件夹: ", currentPath);
  try {
    await createFolderByPath(currentPath);
    res.json({ code: 0, state: "success" });
  } catch (e) {
    console.log(e);
    res.json({ code: -1, state: "fail" });
  }
  try {
    await sendRootFolderSize(wsToMap[req.user.username], req);
  } catch (e) {}
});

// 下载文件
downloadFile.use(async (req, res, next) => {
  let currentFile = path.resolve(req.rootFolder, req.body.relativePath);
  console.log("将要下载文件: ", currentFile, "文件名: ", req.body.fileName);
  try {
    // res.setHeader(
    //   "Content-disposition",
    //   "attachment; fileName=" + encodeURIComponent(req.body.fileName)
    // );
    // res.setHeader("Content-type", mime.lookup(req.body.fileName));
    // res.contentType("application/octet-stream");
    // res.sendFile(currentFile);
    res.download(currentFile);
  } catch (e) {
    console.log(e);
    res.json({
      code: -1,
      state: "fail",
    });
  }
});

exports.getCurrentFolder = getCurrentFolder;
exports.getRecoverFolder = getRecoverFolder;
exports.getCurrentFileByPost = getCurrentFileByPost;
exports.getCurrentFileByGet = getCurrentFileByGet;
exports.getCurrentFileSize = getCurrentFileSize;
exports.submitFile = submitFile;
exports.uploadFile = uploadFile;
exports.deleteItem = deleteItem;
exports.renameItem = renameItem;
exports.recoverItem = recoverItem;
exports.createFile = createFile;
exports.copyFile = copyFile;
exports.createFolder = createFolder;
exports.downloadFile = downloadFile;
exports.wsToMap = wsToMap;
exports.getFolderSize = getFolderSize;
exports.sendRootFolderSize = sendRootFolderSize;
