const fs = require("fs");
const prettyBytes = require("pretty-bytes");

// 获取文件的大小
function getLengthByNumber(length) {
  return prettyBytes(Number(length));
}

// 通过路径获取文件大小
function getLengthByPath(resolvePath) {
  return getFileExist(resolvePath)
    .then(() => fs.promises.stat(resolvePath))
    .then((file) => {
      if (file.isFile()) {
        return file.size;
      } else {
        throw new Error("路径不是文件");
      }
    });
}

// 获取文件的文件名
function getShortName(resolvePath) {
  return resolvePath.slice(resolvePath.lastIndexOf("/") + 1);
}

// 获取文件相对路径
function getRelativePath(baseDir, resolvePath) {
  let path = resolvePath.split(baseDir)[1] || "/";
  return path.slice(1);
}

// 判断一个文件是否存在
function getFileExist(resolvePath) {
  return new Promise((resolve, reject) => {
    fs.promises
      .access(resolvePath, fs.constants.F_OK)
      .then(() => reject("文件已经存在"))
      .catch(() => {
        resolve();
      });
  });
}

exports.getLengthByNumber = getLengthByNumber;
exports.getLengthByPath = getLengthByPath;
exports.getShortName = getShortName;
exports.getRelativePath = getRelativePath;
exports.getFileExist = getFileExist;
