const chalk = require("chalk");
const { exec } = require("child_process");

const freePort = (port) => {
  return new Promise((resolve) => {
    if (process.platform && process.platform !== "win32") {
      const args = process.argv.slice(2);

      const portArg = args && args[0];
      if (portArg && portArg.indexOf("--") > 0) {
        port = portArg.split("--")[1];
      }
      const order = `lsof -i :${port}`;
      try {
        exec(order, (err, stdout, stderr) => {
          if (err) {
            resolve();
            return console.log(chalk.green(`port has already free: ${port}`));
          }
          stdout.split("\n").filter((line) => {
            const p = line.trim().split(/\s+/);
            const address = p[1];
            if (address != undefined && address != "PID") {
              exec("kill -9 " + address, (err, stdout, stderr) => {
                if (err) {
                  return console.log(chalk.red(`free port error: ${err.toString()}`));
                }
                console.log(chalk.green(`port kill: ${port}`));
                resolve();
              });
            }
          });
        });
      } catch (e) {
        console.log(chalk.red(`free port error: ${e.toString()}`));
        resolve();
      }
    } else {
      console.log(chalk.red("不支持的平台"));
      resolve();
    }
  });
};

exports.freePort = freePort;
