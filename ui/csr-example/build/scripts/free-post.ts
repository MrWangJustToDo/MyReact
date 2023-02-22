import { exec } from "child_process";

import { logger } from "./log";

export const freePort = (port: number | string) => {
  return new Promise<void>((resolve) => {
    if (process.platform && process.platform !== "win32") {
      const args = process.argv.slice(2);

      const portArg = args && args[0];
      if (portArg && portArg.indexOf("--") > 0) {
        port = portArg.split("--")[1];
      }
      const order = `lsof -i :${port}`;
      try {
        exec(order, (err, stdout) => {
          if (err) {
            resolve();
            logger().info(`port has already free: ${port}`);
          } else {
            stdout.split("\n").filter((line) => {
              const p = line.trim().split(/\s+/);
              const address = p[1];
              if (address != undefined && address != "PID") {
                exec("kill -9 " + address, (err) => {
                  if (err) {
                    resolve();
                    return logger().error(`free port error: ${err.toString()}`);
                  } else {
                    resolve();
                    return logger().info(`port kill: ${port}`);
                  }
                });
              }
            });
          }
        });
      } catch (e) {
        logger().error(`free port error: ${(e as Error).toString()}`);
        resolve();
      }
    } else {
      logger().error("unSupport platform");
      resolve();
    }
  });
};
