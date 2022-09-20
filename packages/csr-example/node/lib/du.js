const exec = require("child_process").exec;

/**
 * 使用du命令获取当前路径中文件及文件夹的大小
 * @param {String} resolvePath 查找文件夹的绝对路径
 */
function du(resolvePath) {
  return new Promise((resolve, reject) => {
    exec(`du -ab --max-depth=1 ${resolvePath}`, (error, data) => {
      resolve(data);
      reject(error);
    });
  }).then((data) =>
    data
      .split(/\n+/)
      .filter((it) => it.length)
      .map((it) => it.split(/\s+/))
  );
}

exports.du = du;
