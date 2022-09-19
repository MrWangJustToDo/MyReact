import fs from "fs/promises";
import http from "http";
import path from "path";

import { getAllStateFileContent, manifestDepsFile } from "@server/util/manifest";

export const getStaticPageOutputPath = (fileName: string) => path.resolve(process.cwd(), "dist", "pages", fileName);

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
    .map((p) => ({ url: `http://${process.env.PROD_HOST}:${process.env.PROD_PORT}${p.slice(1)}`, p }));

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

export const prepareOutputPath = (p: string) => fs.mkdir(path.dirname(p), { recursive: true }).catch();

export const writeContentToFilePath = (p: string, content: string) => fs.writeFile(p, content);
