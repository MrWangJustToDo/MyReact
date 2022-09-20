const fs = require("fs").promises;
const path = require("path");
const { getFileExist } = require("./tools");

/**
 * 重命名文件
 * @param {String} resolveDir 需要重命名文件所在文件夹的绝对路径
 * @param {String} originName 文件原始名称
 * @param {String} newName 文件重命名后的名称
 */
function renameItemByPath(resolveDir, originName, newName) {
  newName = newName.split(/\s+/).join("");
  let srcResolvePath = path.resolve(resolveDir, originName);
  let targetResolvePath = path.resolve(resolveDir, newName);
  return getFileExist(targetResolvePath).then(() =>
    fs.rename(srcResolvePath, targetResolvePath)
  );
}

exports.renameItemByPath = renameItemByPath;
