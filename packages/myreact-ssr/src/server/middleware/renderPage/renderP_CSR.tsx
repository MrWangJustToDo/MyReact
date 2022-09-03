import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";

import { ServerError } from "server/utils/error";
import { HTML } from "template/Html";
import { manifestLoadable } from "utils/manifest";

import { composeRender } from "./compose";
import { globalEnv } from "./middleware/globalEnv";
import { initLang } from "./middleware/initLang";

import type { AnyAction } from "./compose";

const targetRender: AnyAction = async ({ res, env, lang }) => {
  if (!env || !lang) {
    throw new ServerError("server 初始化失败", 500);
  }
  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });
  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  const scriptElements = webExtractor.getScriptElements();

  env.isSSR = false;

  res.send(
    "<!doctype html>" +
      renderToString(<HTML env={JSON.stringify(env)} lang={JSON.stringify(lang)} script={scriptElements} link={linkElements.concat(styleElements)} />)
  );
};

export const renderP_CSR = composeRender(globalEnv, initLang)(targetRender);
