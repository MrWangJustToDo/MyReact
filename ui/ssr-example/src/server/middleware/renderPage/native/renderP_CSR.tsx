import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";

import { generateScriptElements } from "@server/util/element";
import { manifestLoadableFile } from "@server/util/loadableManifest";
import { RenderError } from "@server/util/renderError";
import { HTML } from "@shared";

import type { AnyAction } from "../compose";

// 纯净的客户端渲染
export const targetRender: AnyAction = async ({ res, env, lang, assets }) => {
  if (!env || !lang) {
    throw new RenderError("server 初始化失败", 500);
  }

  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadableFile("client") });

  const linkElements = webExtractor.getLinkElements();

  const styleElements = webExtractor.getStyleElements();

  const scriptElements = webExtractor.getScriptElements();

  const refreshElements = generateScriptElements(assets.refreshPath);

  res.send(
    "<!doctype html>" +
      renderToString(<HTML env={JSON.stringify(env)} lang={lang} link={linkElements.concat(styleElements)} script={scriptElements} refresh={refreshElements} />)
  );
};
