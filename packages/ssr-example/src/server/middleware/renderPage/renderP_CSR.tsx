import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";

import { manifestLoadableFile } from "@server/util/manifest";
import { RenderError } from "@server/util/renderError";
import { HTML } from "@shared";

import { composeRender } from "./compose";
import { globalEnv } from "./middleware/globalEnv";
import { initLang } from "./middleware/initLang";

import type { AnyAction } from "./compose";

// 纯净的客户端渲染
const targetRender: AnyAction = async ({ res, env, lang }) => {
  if (!env || !lang) {
    throw new RenderError("server 初始化失败", 500);
  }

  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadableFile("client") });

  const linkElements = webExtractor.getLinkElements();

  const styleElements = webExtractor.getStyleElements();

  const scriptElements = webExtractor.getScriptElements();

  env.isSSR = false;

  env.isPURE_CSR = true;

  res.send(
    "<!doctype html>" +
      renderToString(<HTML env={JSON.stringify(env)} lang={JSON.stringify(lang)} link={linkElements.concat(styleElements)} script={scriptElements} />)
  );
};

export const renderP_CSR = composeRender(globalEnv, initLang)(targetRender);
