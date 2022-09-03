import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";

import { ServerError } from "server/utils/error";
import { HTML } from "template/Html";
import { manifestLoadable } from "utils/manifest";

import { composeRender } from "./compose";
import { globalEnv, initLang, initStore, loadCookie, loadLang, loadStore } from "./middleware";

import type { AnyAction } from "./compose";

// 客户端渲染
const targetRender: AnyAction = async ({ res, store, lang, env }) => {
  if (!store || !lang || !env) {
    throw new ServerError("server 初始化失败", 500);
  }
  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });
  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  const scriptElements = webExtractor.getScriptElements();

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify(env)}
          lang={JSON.stringify(lang)}
          script={scriptElements}
          link={linkElements.concat(styleElements)}
          reduxInitialState={JSON.stringify(store.getState())}
        />
      )
  );
};

export const renderCSR = composeRender(globalEnv, initLang, initStore, loadStore, loadLang, loadCookie)(targetRender);
