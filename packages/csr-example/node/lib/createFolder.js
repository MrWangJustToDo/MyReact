const fs = require("fs").promises;
const { getFileExist } = require("./tools");

/**
 * 根据路径创建文件夹
 * @param {String} resolvePath 通过绝对路径创建文件夹
 */
function createFolderByPath(resolvePath) {
  return getFileExist(resolvePath).then(() => fs.mkdir(resolvePath));
}

exports.createFolderByPath = createFolderByPath;
