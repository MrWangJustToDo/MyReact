const exec = require("child_process").exec;

// 将当前文件移动到指定文件中
function mv(srcResolvePath, targetResolvePath) {
  return new Promise((resolve, reject) => {
    exec(`mv ${srcResolvePath} ${targetResolvePath}`, (error, data) => {
      resolve(data);
      reject(error);
    });
  });
}

exports.mv = mv;
