import fs from "fs/promises";
import { memoize } from "lodash";
import path from "path";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev.json" : "manifest-prod.json");

const manifestDeps = "manifest-deps.json";

const manifestStateFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestFile());

const manifestDepsFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestDeps);

const manifestStaticPageFile = (env: "server" | "client"): string => path.resolve(outputPath(env), "manifest-static.json");

const _getAllStateFileContent = async <T = Record<string, string>, P = T>(path: string, normalize: (content: T) => P | T = (s) => s): Promise<P> => {
  const content = await fs.readFile(path, { encoding: "utf-8" }).then((c) => JSON.parse(c));
  return normalize(content) as P;
};

const getAllStateFileContent = __DEVELOPMENT__
  ? _getAllStateFileContent
  : memoize(_getAllStateFileContent, (path, normalize) => `${path}/${(normalize || "empty").toString()}`);

const baseStylesPath = (content: Record<string, string>, judge: (f: string) => boolean) =>
  Object.keys(content)
    .filter((file) => content[file].endsWith(".css"))
    .filter(judge)
    .map((key) => content[key]);

const baseScriptsPath = (content: Record<string, string>, judge: (f: string) => boolean) =>
  Object.keys(content)
    .filter((file) => content[file].endsWith(".js"))
    .filter(judge)
    .map((key) => content[key]);

const mainStylesPath = (content: Record<string, string>) => baseStylesPath(content, (file) => file.startsWith("main") || file.startsWith("vendor"));

const mainScriptsPath = (content: Record<string, string>) => baseScriptsPath(content, (f) => f.startsWith("main") || f.startsWith("vendor"));

const runtimeScriptsPath = (content: Record<string, string>) => baseScriptsPath(content, (f) => f.startsWith("runtime"));

const getDynamicPagePath = (content: Record<string, string[]>, page: string[]) =>
  Object.keys(content)
    .filter((key) => page.some((p) => p === key || p === key.slice(1)))
    .map((key) => content[key])
    .reduce<string[]>((p, c) => p.concat(c), []);

const dynamicPageScriptsPath = (content: Record<string, string>, pageName: string[]) => baseScriptsPath(content, (f) => pageName.includes(f));

const dynamicPageStylesPath = (content: Record<string, string>, pageName: string[]) => baseStylesPath(content, (f) => pageName.includes(f));

export {
  manifestStateFile,
  manifestStaticPageFile,
  getAllStateFileContent,
  mainScriptsPath,
  mainStylesPath,
  runtimeScriptsPath,
  manifestDepsFile,
  getDynamicPagePath,
  dynamicPageScriptsPath,
  dynamicPageStylesPath,
};
