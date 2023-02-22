import fs from "fs/promises";
import { memoize } from "lodash";
import path from "path";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev-vite.json" : "manifest-prod-vite.json");

const manifestStateFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestFile());

const _getAllStateFileContent = async <T = Record<string, string>, P = T>(path: string, normalize: (content: T) => P | T = (s) => s): Promise<P> => {
  const content = await fs.readFile(path, { encoding: "utf-8" }).then((c) => JSON.parse(c));
  return normalize(content) as P;
};

const getAllStateFileContent = __DEVELOPMENT__
  ? _getAllStateFileContent
  : memoize(_getAllStateFileContent, (path, normalize) => `${path}/${(normalize || "empty").toString()}`);

const mainStylesPath = (content: Record<string, any>): string[] => {
  const keys = Object.keys(content).filter((key) => content[key].isEntry);
  return keys
    .map((key) => content[key]?.["css"] as string[])
    .reduce((p, c) => {
      if (c) {
        return [...p, ...c];
      } else {
        return p;
      }
    }, []);
};

const mainScriptsPath = (content: Record<string, any>): { path: string }[] => {
  const keys = Object.keys(content).filter((key) => content[key].isEntry);
  const paths: Array<{ path: string; [p: string]: any }> = [];
  const legacyPaths: string[] = [];
  const modulePaths: string[] = [];
  keys.forEach((key) => {
    if (content[key]) {
      // legacy entry
      if (key.includes("legacy")) {
        legacyPaths.push(key);
      } else {
        modulePaths.push(key);
      }
    }
  });
  // import polyfills first
  legacyPaths.sort((key) => (key.includes("vite/legacy-polyfills") ? -1 : 0));
  modulePaths.forEach((key) => {
    paths.push(...content[key]["imports"].map((key) => ({ path: content[key]["file"], type: "module", async: true })));
    paths.push({ path: content[key]["file"], type: "module", async: true });
  });
  legacyPaths.forEach((key) => {
    paths.push(
      ...(content[key]?.["imports"] || []).map((key) => ({
        path: content[key]["file"],
        noModule: true,
        async: true,
      }))
    );
    paths.push({ path: content[key]["file"], noModule: true, async: true });
  });
  return paths;
};

export { manifestStateFile, getAllStateFileContent, mainStylesPath, mainScriptsPath };
