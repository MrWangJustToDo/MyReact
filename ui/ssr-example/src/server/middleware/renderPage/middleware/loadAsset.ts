import { RenderError } from "@server/util/renderError";
import {
  dynamicPageScriptsPath,
  dynamicPageStylesPath,
  getAllStateFileContent,
  getDynamicPagePath,
  mainScriptsPath,
  mainStylesPath,
  manifestDepsFile,
  manifestStateFile,
  refreshScriptsPath,
  runtimeScriptsPath,
} from "@server/util/webpackManifest";
import { getIsSSR } from "@shared";

import type { Middleware } from "../compose";

export const loadAsset: Middleware = (next) => async (args) => {
  const { req } = args;

  const isSSR = getIsSSR() || req.query.isSSR;

  const assets = {
    stylesPath: [],
    scriptsPath: [],
    refreshPath: [],
    preloadScriptsPath: [],
  };

  const stateFileContent = await getAllStateFileContent(manifestStateFile("client"));

  const mainStyles = mainStylesPath(stateFileContent);

  const refreshScripts = refreshScriptsPath(stateFileContent);

  const runtimeScripts = runtimeScriptsPath(stateFileContent);

  const mainScripts = mainScriptsPath(stateFileContent);

  assets.stylesPath = mainStyles;

  const allScriptsPath = runtimeScripts.concat(mainScripts);

  assets.preloadScriptsPath = allScriptsPath;

  assets.scriptsPath = allScriptsPath;

  assets.refreshPath = refreshScripts;

  if (isSSR) {
    const { page } = args;

    if (!page) throw new RenderError("render page 没有初始化", 500);

    const depsFileContent = await getAllStateFileContent<
      Record<
        string,
        {
          path: string[];
          static: boolean;
        }
      >,
      Record<string, string[]>
    >(manifestDepsFile("client"), (content) =>
      Object.keys(content)
        .map((key) => ({ [key]: content[key].path }))
        .reduce((p, c) => ({ ...p, ...c }), {})
    );

    const dynamicPage = getDynamicPagePath(depsFileContent, page);

    const dynamicStylesPath = dynamicPageStylesPath(stateFileContent, dynamicPage);

    const dynamicScriptsPath = dynamicPageScriptsPath(stateFileContent, dynamicPage);

    assets.stylesPath = assets.stylesPath.concat(dynamicStylesPath);

    assets.scriptsPath = dynamicScriptsPath.concat(assets.scriptsPath);

    assets.preloadScriptsPath = assets.preloadScriptsPath.concat(dynamicScriptsPath);
  }

  args.assets = assets;

  await next(args);
};
