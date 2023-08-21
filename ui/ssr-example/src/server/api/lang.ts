import fs from "fs";
import { readFile } from "fs/promises";
import path from "path";

import { wrapperMiddlewareRequest } from "../middleware/apiHandler";
import { RenderError } from "../util/renderError";

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
    if (!lang) throw new Error("invalid request");
    const relativePath = path.resolve(process.cwd(), "lang", `${lang}.json`);
    const isExist = await getFileExist(relativePath);
    if (isExist) {
      const data = await readFile(relativePath, { encoding: "utf-8" });
      res.status(200).json({ data: JSON.parse(data) });
    } else {
      throw new RenderError(`unsupported lang`, 404);
    }
  },
});

const actionObject: { [props: string]: typeof getI18nFile } = {
  [`lang`]: getI18nFile,
};

export const apiHandler = async (req: Request, res: Response, next: NextFunction) => {
  const action = actionObject[req.path.slice(1)];
  if (action) {
    await action(req, res, next);
  } else {
    res.status(404).json({ data: "not found" });
  }
};
