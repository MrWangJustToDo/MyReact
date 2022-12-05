import { ChakraProvider, cookieStorageManager } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "@my-react/react-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { StaticRouter as Router } from "react-router-dom/server";

import { App } from "@client/common/App";
import { manifestLoadableFile } from "@server/util/manifest";
import { createEmotionCache, HTML } from "@shared";

import type { SafeAction } from "../compose";
import type { MyReactElement } from "@my-react/react";

export const targetRender: SafeAction = async ({ req, res, store, lang, env }) => {
  const helmetContext = {};

  const emotionCache = createEmotionCache();

  const { extractCriticalToChunks } = createEmotionServer(emotionCache);

  const cookieStore = cookieStorageManager(req.headers.cookie || "");

  const content = (
    <CacheProvider value={emotionCache}>
      <ChakraProvider colorModeManager={cookieStore}>
        <Provider store={store}>
          <Router location={req.url}>
            <HelmetProvider context={helmetContext}>
              <App />
            </HelmetProvider>
          </Router>
        </Provider>
      </ChakraProvider>
    </CacheProvider>
  );

  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadableFile("client") });

  const jsx = webExtractor.collectChunks(content);

  const body = await renderToString(jsx as MyReactElement, true);

  const emotionChunks = extractCriticalToChunks(body);

  const linkElements = webExtractor.getLinkElements();

  const styleElements = webExtractor.getStyleElements();

  const scriptElements = webExtractor.getScriptElements();

  res.status(200).send(
    "<!doctype html>" +
      renderToString(
        (
          <HTML
            env={JSON.stringify(env)}
            lang={JSON.stringify(lang)}
            script={scriptElements}
            helmetContext={helmetContext}
            emotionChunks={emotionChunks}
            link={linkElements.concat(styleElements)}
            preloadedState={JSON.stringify(store.getState())}
          >
            {body}
          </HTML>
        ) as MyReactElement
      )
  );
};
