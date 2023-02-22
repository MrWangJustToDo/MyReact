import fs from "fs";
import path from "path";

import { logger } from "./log";

const DYNAMIC_PATH_REG = /^:(.*)$/;

export class DynamicRouter {
  side: "client" | "server" | "universal";
  cache: Record<string, string> = {};
  constructor(side?: "client" | "server" | "universal") {
    this.side = side || "client";
  }

  public getRouterConfig = (prePath: string, dirName: string) => {
    return new Promise<Array<{ path: string; componentPath: string }>>((resolve) => {
      const routes: Array<{ path: string; componentPath: string }> = [];
      let indexPath = 0;
      let dynamicPath = 0;
      let fallbackPath = 0;
      fs.promises
        .readdir(dirName, { withFileTypes: true })
        .then((files) =>
          Promise.all(
            files.map((file) => {
              if (file.isFile() && /.[tj]sx?$/.test(file.name)) {
                const [, fileName] = Array.from(/(.*).[tj]sx?$/.exec(file.name) || []);
                const config = { path: "", componentPath: "" };
                if (DYNAMIC_PATH_REG.test(fileName)) {
                  // 动态路由 文件名为 :key.tsx  -->  对应router配置 path: /:key
                  if (dynamicPath === 0) {
                    // 确保同一级只会有一个
                    dynamicPath++;
                    const [, params] = Array.from(DYNAMIC_PATH_REG.exec(fileName) || []);
                    config.path = `${prePath}:${params}`;
                  } else {
                    throw new Error(`file router dynamicPath duplicate`);
                  }
                } else if (fileName.toLowerCase() === "index") {
                  // 默认路由, 同一级只应该有一个
                  if (indexPath === 0) {
                    indexPath++;
                    config.path = `${prePath}`;
                  } else {
                    throw new Error("file router default path duplicate");
                  }
                } else if (fileName === "404") {
                  if (prePath === "/") {
                    fallbackPath++;
                    config.path = `${prePath}*`;
                  } else {
                    fallbackPath++;
                    config.path = `/*`;
                    // throw new Error(`can not add 404 page on the ${prePath}`);
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
          if (indexPath === 1) {
            routes.sort((_, t) => (t.path.endsWith("/") ? 1 : 0));
          }
          if (fallbackPath === 1) {
            routes.sort((_, b) => (b.path === "/*" ? -1 : 0));
          }
        })
        .then(() => resolve(routes))
        .catch((e) => logger().error(`file router error, ${e.toString()}`));
    });
  };

  getRouterTemplate = (routerResult: string) => {
    const template = `/* eslint-disable prettier/prettier */
/* do not editor this template */
import type { DynamicRouteConfig } from "@client/types/route";

export const dynamicRouteConfig: DynamicRouteConfig[] = ${routerResult};`;
    return template;
  };

  isNoChange = (routerResult: string) => {
    if (this.cache.value === routerResult) {
      logger().info(`[${this.side}] file router do not need update from cache`);
      return true;
    } else {
      logger().info(`[${this.side}] file router need update from cache`);
      this.cache.value = routerResult;
      return false;
    }
  };

  getRouterFile = (filePath: string) => {
    return fs.promises.readFile(filePath, { encoding: "utf-8" });
  };

  writeRouterFile = (filePath: string, content: string) => {
    return fs.promises.writeFile(filePath, content);
  };

  getDynamicRouter = async (basePath = "/") => {
    const pages = path.resolve(process.cwd(), "src", "client", "pages");
    const dynamicRouteFilename = path.resolve(process.cwd(), "src", "client", "router", "dynamicRoutes.ts");
    const routerConfig = await this.getRouterConfig("/", pages);
    const routerConfigWithBasePath =
      basePath !== "/"
        ? routerConfig.map(({ path, componentPath }) => {
            if (path.startsWith("/") && basePath.endsWith("/")) {
              return { path: basePath.slice(0, -1) + path, componentPath };
            } else {
              return { path: basePath + path, componentPath };
            }
          })
        : routerConfig;
    const routerResult = JSON.stringify(routerConfigWithBasePath);
    const cacheCheck = this.isNoChange(routerResult);
    if (!cacheCheck) {
      const currentTemplate = await this.getRouterFile(dynamicRouteFilename);
      const newTemplate = this.getRouterTemplate(routerResult);
      if (currentTemplate === newTemplate) {
        logger().info(`[${this.side}] file router do not need update from template`);
        this.cache.value = routerResult;
      } else {
        await this.writeRouterFile(dynamicRouteFilename, newTemplate);
        logger().info(`[${this.side}] file router updated`);
        this.cache.value = routerResult;
      }
    }
  };
}
