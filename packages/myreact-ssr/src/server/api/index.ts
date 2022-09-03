import fs from "fs";
import path from "path";

import { apiName } from "config/api";
import { fail, success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import { ServerError } from "server/utils/error";

import type { Request, Response, NextFunction } from "express";

const getFileExist = (resolvePath: string) => {
  return new Promise<boolean>((resolve) => {
    fs.promises
      .access(resolvePath, fs.constants.F_OK)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
};

const getI18nFile = wrapperMiddlewareRequest({
  requestHandler: async function getI18nFile({ req, res }) {
    const { lang } = req.query;
    const relativePath = path.resolve(process.cwd(), "lang", `${lang}.json`);
    const isExist = await getFileExist(relativePath);
    if (isExist) {
      const content = await fs.promises.readFile(relativePath, { encoding: "utf-8" });
      success({ res, resDate: { data: { [lang as string]: JSON.parse(content) } } });
    } else {
      throw new ServerError(`${lang} 语言文件不存在`, 404);
    }
  },
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["lang"] },
});

const actionObject: { [props: string]: typeof getI18nFile } = {
  [apiName.lang]: getI18nFile,
};

export const apiHandler = async (req: Request, res: Response, next: NextFunction) => {
  const action = actionObject[req.path.slice(1)];
  if (action) {
    await action(req, res, next);
  } else {
    fail({ res, resDate: { data: "路径不正确" } });
  }
};
