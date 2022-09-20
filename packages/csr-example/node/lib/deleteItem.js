const path = require("path");
const deleteFileByPath = require("./deleteFile").deleteFileByPath;
const deleteFolderByPath = require("./deleteFolder").deleteFolderByPath;

/**
 * 删除元素
 * @param {String} baseDir 绝对路径前缀
 * @param {Object} item -> type: file/dir, path: 相对路径
 */
function deleteItem(baseDir, item) {
  if (item.type === "file") {
    return deleteFileByPath(path.resolve(baseDir, item.path));
  } else {
    return deleteFolderByPath(path.resolve(baseDir, item.path));
  }
}

exports.deleteItem = deleteItem;
