const fs = require("fs").promises;
const { getFileExist } = require("./tools");

/**
 * 根据路径创建文件
 * @param {String} resolvePath 通过绝对路径创建文件
 */
function createFileByPath(resolvePath) {
  return getFileExist(resolvePath).then(() => fs.appendFile(resolvePath, ""));
}

exports.createFileByPath = createFileByPath;
