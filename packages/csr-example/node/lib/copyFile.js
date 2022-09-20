const fs = require("fs");
const path = require("path");

/**
 * 复制文件
 * @param {String} fileName 需要复制的文件名
 * @param {String} srcResolveDir 被复制文件所在文件夹的绝对路径
 * @param {String} targetResolveDir 目标文件夹的绝对路径
 */
function copyFileByPath(fileName, srcResolveDir, targetResolveDir) {
  let srcResolvePath = path.resolve(srcResolveDir, fileName);
  let targetResolvePath = path.resolve(targetResolveDir, fileName);
  return fs.promises.copyFile(
    srcResolvePath,
    targetResolvePath,
    fs.constants.COPYFILE_EXCL
  );
}

exports.copyFileByPath = copyFileByPath;
