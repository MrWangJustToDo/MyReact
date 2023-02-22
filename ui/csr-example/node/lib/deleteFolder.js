const fs = require("fs").promises;

/**
 * 递归删除指定文件夹
 * @param {String} resolvePath 被删除文件夹的绝对路径
 */
function deleteFolderByPath(resolvePath) {
  return fs.rmdir(resolvePath, { recursive: true });
}

exports.deleteFolderByPath = deleteFolderByPath;
