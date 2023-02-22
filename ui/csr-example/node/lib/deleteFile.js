const fs = require("fs").promises;

/**
 * 删除指定路径文件
 * @param {String} resolvePath 被删除文件绝对路径
 */
function deleteFileByPath(resolvePath) {
  return fs.unlink(resolvePath);
}

exports.deleteFileByPath = deleteFileByPath;
