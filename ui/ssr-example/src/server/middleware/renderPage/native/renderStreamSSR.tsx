import { ChakraProvider, cookieStorageManager } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { ChunkExtractor } from "@loadable/server";
import { renderToNodeStream, renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { StaticRouter as Router } from "react-router-dom/server";

import { App } from "@client/common/App";
import { manifestLoadableFile } from "@server/util/loadableManifest";
import { createEmotionCache, HTML, theme } from "@shared";

import type { SafeAction } from "../compose";

export const targetRender: SafeAction = async ({ req, res, store, lang, env }) => {
  const helmetContext = {};

  const emotionCache = createEmotionCache();

  const cookieStore = cookieStorageManager(req.headers.cookie || "");

  const content = (
    <CacheProvider value={emotionCache}>
      <ChakraProvider theme={theme} colorModeManager={cookieStore}>
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

  const body = renderToString(jsx);

  const linkElements = webExtractor.getLinkElements();

  const styleElements = webExtractor.getStyleElements();

  const scriptElements = webExtractor.getScriptElements();

  const element = (
    <HTML
      lang={lang}
      env={JSON.stringify(env)}
      script={scriptElements}
      helmetContext={helmetContext}
      // emotionChunks={emotionChunks}
      link={linkElements.concat(styleElements)}
      preloadedState={JSON.stringify(store.getState())}
    >
      {body}
    </HTML>
  );

  // const stream = renderToNodeStream(element as any);

  // stream.push("<!doctype html>");

  // stream.pipe(res);

  const stream = renderToNodeStream(element);

  stream.pipe(res);
};
