import { createReadStream, createWriteStream } from "fs";
import fs from "fs/promises";
import http from "http";
import path from "path";
import { pipeline } from "stream/promises";

import { getAllStateFileContent, manifestDepsFile } from "../util/webpackManifest";

export const getStaticPageOutputPath = (fileName: string) => path.resolve(process.cwd(), "dist", "pages", fileName);

export const getGithubPageOutputPath = (fileName: string) => path.resolve(process.cwd(), "dist", fileName);

export const getPageManifestContent = () =>
  getAllStateFileContent<
    Record<
      string,
      {
        path: string[];
        static: boolean;
      }
    >,
    Record<string, boolean>
  >(manifestDepsFile("client"), (content) =>
    Object.keys(content)
      .map((key) => ({ [key]: content[key].static }))
      .reduce((p, c) => ({ ...p, ...c }), {})
  );

export const getAllStaticRouters = (allRouters: Record<string, boolean>) =>
  Object.keys(allRouters)
    .filter((path) => allRouters[path])
    // TODO static generate need more clear
    .map((p) => ({ url: `http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/MyReact${p.slice(1)}`, p }));

export const generateStaticPage = (pathConfig: {
  url: string;
  p: string;
}): Promise<{ pathConfig: { url: string; p: string }; rawData?: string; error?: Error }> =>
  new Promise((r) => {
    http
      .get(pathConfig.url, (res) => {
        const { statusCode } = res;
        if (statusCode === 200) {
          res.setEncoding("utf-8");
          let rawData = "";
          res.on("data", (chunk) => (rawData += chunk));
          res.on("end", () => r({ rawData, pathConfig }));
          res.on("error", (error) => r({ error, pathConfig }));
        } else {
          r({ pathConfig, error: new Error("500 error") });
        }
      })
      .on("error", (error) => r({ pathConfig, error }));
  });

export const getFileNameFromPath = (pathConfig: { p: string }) => {
  const path = pathConfig.p.slice(1);
  const fileName = path === "/" ? "index.html" : `${path.slice(1)}.html`;
  return { ...pathConfig, fileName };
};

export const copyDir = async (src: string, targetDir: string) => {
  const srcState = await fs.stat(src);
  if (srcState.isDirectory()) {
    const allItem = await fs.readdir(src, { withFileTypes: true });
    for (let i = 0; i < allItem.length; i++) {
      const file = allItem[i];
      if (file.isFile()) {
        await pipCopy(path.resolve(src, file.name), path.resolve(targetDir, file.name));
      }
      if (file.isDirectory()) {
        await copyDir(path.resolve(src, file.name), path.resolve(targetDir, file.name));
      }
    }
  } else {
    await pipCopy(path.resolve(src), path.resolve(targetDir, path.basename(src)));
  }
};

export const prepareOutputPath = (p: string) => fs.mkdir(path.dirname(p), { recursive: true }).catch();

export const writeContentToFilePath = (p: string, content: string) => fs.writeFile(p, content);

export const pipCopy = async (src: string, target: string) => {
  await prepareOutputPath(target);
  await pipeline(createReadStream(src), createWriteStream(target));
};
