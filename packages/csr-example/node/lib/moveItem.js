const path = require("path");
const mv = require("./mv").mv;

// 将指定文件/文件夹移动
function moveItem(originName, srcResolveDir, targetResolveDir) {
  let srcResolvePath = path.resolve(srcResolveDir, originName);
  let targetResolvePath = path.resolve(targetResolveDir, originName);
  return mv(srcResolvePath, targetResolvePath);
}

exports.moveItem = moveItem;
