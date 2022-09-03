const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const dynamicPathReg = /^:(.*)$/;

class DynamicRouter {
  constructor(cache, side) {
    this.side = side || "server";
    this.cache = cache || {};
  }

  getRouterConfig = (prePath, dirName) => {
    return new Promise((resolve) => {
      const routes = [];
      let dynamicPath = 0;
      fs.promises
        .readdir(dirName, { withFileTypes: true })
        .then((files) =>
          Promise.all(
            files.map((file) => {
              if (file.isFile() && /.[tj]sx?$/.test(file.name)) {
                const [, fileName] = Array.from(/(.*).[tj]sx?$/.exec(file.name));
                const config = {};
                if (dynamicPathReg.test(fileName)) {
                  // 动态路由 文件名为 :key.tsx  -->  对应router配置 path: /:key
                  if (dynamicPath === 0) {
                    // 确保同一级只会有一个
                    dynamicPath++;
                    const [, params] = Array.from(dynamicPathReg.exec(fileName));
                    config.path = `${prePath}:${params}`;
                  } else {
                    throw new Error(`file router dynamicPath duplicate`);
                  }
                } else {
                  config.path = `${prePath}${fileName}`;
                }
                config.componentPath = `${prePath.slice(1)}${fileName}`;
                // 文件名字重复
                if (routes.some((route) => route.path === config.path)) {
                  throw new Error(`file router duplicate, ${config.path}`);
                }
                routes.push(config);
              } else if (file.isDirectory()) {
                return this.getRouterConfig(`${prePath}${file.name}/`, `${dirName}/${file.name}`).then((res) => {
                  routes.push(...res);
                });
              }
            })
          )
        )
        .then(() => {
          if (dynamicPath === 1) {
            // 如果存在动态路由  进行排序放在当前层级最后面
            routes.sort((_, t) => (/^\[(.*)\]$/.test(t.path) ? -1 : 0));
          }
        })
        .then(() => resolve(routes))
        .catch((e) => console.log(chalk.red(`file router error, ${e.toString()}`)));
    });
  };

  getRouterTemplate = (routerResult) => {
    const template = `/* eslint-disable prettier/prettier */
/* do not editor this template */
import type { DynamicRouteConfig } from "types/router";

export const dynamicRouteConfig: DynamicRouteConfig[] = ${routerResult};`;
    return template;
  };

  isNoChange = (routerResult) => {
    if (this.cache.value === routerResult) {
      console.log(`[${this.side}]`, chalk.green(`file router do not need update from cache`));
      return true;
    } else {
      console.log(`[${this.side}]`, chalk.blue(`file router need update from cache`));
      this.cache.value = routerResult;
      return false;
    }
  };

  getRouterFile = (filePath) => {
    return fs.promises.readFile(filePath, { encoding: "utf-8" });
  };

  writeRouterFile = (filePath, content) => {
    return fs.promises.writeFile(filePath, content);
  };

  getDynamicRouter = async () => {
    const pages = path.resolve(process.cwd(), "src", "pages");
    const dynamicRouteFilename = path.resolve(process.cwd(), "src", "router", "dynamicRoutes.ts");
    const routerConfig = await this.getRouterConfig("/", pages);
    const routerResult = JSON.stringify(routerConfig);
    const cacheCheck = this.isNoChange(routerResult);
    if (!cacheCheck) {
      const currentTemplate = await this.getRouterFile(dynamicRouteFilename);
      const newTemplate = this.getRouterTemplate(routerResult);
      if (currentTemplate === newTemplate) {
        console.log(`[${this.side}]`, chalk.green(`file router do not need update from template`));
        this.cache.value = routerResult;
      } else {
        await this.writeRouterFile(dynamicRouteFilename, newTemplate);
        console.log(`[${this.side}]`, chalk.blue(`file router updated`));
        this.cache.value = routerResult;
      }
    }
  };
}

class DynamicCache {
  value = "";
}

exports.DynamicRouter = DynamicRouter;
exports.dynamicCache = new DynamicCache();
