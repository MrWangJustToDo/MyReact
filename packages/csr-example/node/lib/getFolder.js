const fs = require("fs").promises;
const du = require("./du").du;
const { getLengthByNumber, getShortName, getRelativePath } = require("./tools");

// 获取文件夹信息
function getFolder(baseDir, resolvePath) {
  if (resolvePath.startsWith(baseDir)) {
    return du(resolvePath)
      .then((data) => {
        // 获取当前文件夹的信息
        let total = data.pop();
        let re = {
          length: total[0],
          resolvePath: total[1],
          relativePath: getRelativePath(baseDir, total[1]),
          fileType: "dir",
          files: [],
        };
        data.forEach((it, id) => {
          let [length, resolvePath] = it;
          re.files.push({ id, length, resolvePath });
        });
        return re;
      })
      .then((data) => getFiles(baseDir, data));
  } else {
    return Promise.reject("permission denied");
  }
}

// 获取其中每一项
function getFiles(baseDir, data) {
  return Promise.all(
    data.files.map((item) => {
      // 文件大小
      item["readAbleLength"] = getLengthByNumber(item.length);
      // 文件名
      item["shortPath"] = getShortName(item.resolvePath);
      // 文件相对路径
      item["relativePath"] = getRelativePath(baseDir, item.resolvePath);
      // 文件类型
      return fs.stat(item.resolvePath).then((file) => {
        if (file.isFile()) {
          item["fileType"] = "file";
        } else {
          item["fileType"] = "dir";
        }
        // 文件修改日期
        item["modifyTime"] = file.mtime.toLocaleString();
      });
    })
  ).then(() => data);
}

// 获取文件夹大小
function getFolderSize(resolvePath) {
  return du(resolvePath).then((data) => data.pop()[0]);
}

exports.getFolder = getFolder;
exports.getFolderSize = getFolderSize;
