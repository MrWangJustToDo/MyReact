import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";

import { manifestLoadableFile } from "@server/util/loadableManifest";
import { RenderError } from "@server/util/renderError";
import { HTML } from "@shared";

import type { AnyAction } from "../compose";

// 客户端渲染
export const targetRender: AnyAction = async ({ res, store, lang, env }) => {
  if (!store || !lang || !env) {
    throw new RenderError("server 初始化失败", 500);
  }

  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadableFile("client") });

  const linkElements = webExtractor.getLinkElements();

  const styleElements = webExtractor.getStyleElements();

  const scriptElements = webExtractor.getScriptElements();

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          lang={lang}
          env={JSON.stringify(env)}
          link={linkElements.concat(styleElements)}
          preloadedState={JSON.stringify(store.getState())}
          script={scriptElements}
        />
      )
  );
};
