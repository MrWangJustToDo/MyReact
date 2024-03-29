import fs from "fs/promises";
import { memoize } from "lodash";
import path from "path";

const outputPath = (env: "server" | "client"): string => path.resolve(process.cwd(), __BUNDLE_SCOPE__, __DEVELOPMENT__ ? "dev" : "dist", __OUTPUT_SCOPE__, env);

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev.json" : "manifest-prod.json");

const manifestDeps = "manifest-deps.json";

const manifestStateFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestFile());

const manifestDepsFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestDeps);

const manifestStaticPageFile = (env: "server" | "client"): string => path.resolve(outputPath(env), "manifest-static.json");

const _getAllStateFileContent = async <T = Record<string, string>, P = T>(path: string, normalize: (content: T) => P | T = (s) => s): Promise<P> => {
  try {
    const content = await fs.readFile(path, { encoding: "utf-8" }).then((c) => JSON.parse(c));
    return normalize(content) as P;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getAllStateFileContent = __DEVELOPMENT__
  ? _getAllStateFileContent
  : memoize(_getAllStateFileContent, (path, normalize) => `${path}/${(normalize || "empty")?.toString()}`);

const baseStylesPath = (content: Record<string, string>, judge: (f: string) => boolean) =>
  Object.keys(content)
    .filter((file) => content[file].endsWith(".css"))
    .filter(judge)
    .map((key) => content[key]);

const baseScriptsPath = (content: Record<string, string>, judge: (f: string) => boolean, sort: (f: string) => number = () => 0) =>
  Object.keys(content)
    .filter((file) => content[file].endsWith(".js"))
    .filter(judge)
    .sort(sort)
    .map((key) => content[key]);

const mainStylesPath = (content: Record<string, string>) => baseStylesPath(content, (file) => file.startsWith("main") || file.startsWith("vendor"));

const mainScriptsPath = (content: Record<string, string>) =>
  baseScriptsPath(
    content,
    (f) => f.startsWith("main") || f.startsWith("vendor"),
    (f) => (f.startsWith("main") ? 0 : -1)
  );

const runtimeScriptsPath = (content: Record<string, string>) => baseScriptsPath(content, (f) => f.startsWith("runtime"));

const refreshScriptsPath = (content: Record<string, string>) =>
  baseScriptsPath(content, (f) => f.startsWith("__refresh__")).map((path) => ({ path, "data-refresh": "@my-react/react-refresh" }));

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
  refreshScriptsPath,
  manifestDepsFile,
  getDynamicPagePath,
  dynamicPageScriptsPath,
  dynamicPageStylesPath,
};
