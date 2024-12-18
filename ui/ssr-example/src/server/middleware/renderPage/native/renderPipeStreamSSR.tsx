import { ChakraProvider, cookieStorageManagerSSR } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { renderToPipeableStream } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { StaticRouter as Router } from "react-router-dom/server";

import { App } from "@client/common/App";
import { generateStyleElements, generatePreloadScriptElements, generateScriptElements } from "@server/util/element";
import { serverLog } from "@server/util/serverLog";
import { createEmotionCache, HTML, theme } from "@shared";

import { targetRender as targetCSRRender } from "./renderCSR";

import type { SafeAction } from "../compose";

export const targetRender: SafeAction = async ({ req, res, store, lang, env, assets = {} }) => {
  const helmetContext = {};

  const emotionCache = createEmotionCache();

  const cookieStore = cookieStorageManagerSSR(req.headers.cookie || "");

  const { stylesPath = [], scriptsPath = [], preloadScriptsPath = [], refreshPath } = assets;

  const shellMethod = env.isSTATIC ? "onAllReady" : "onShellReady";

  let error = false;

  let initial = false;

  /**
   * React 原始的stream render会对组件执行顺序进行排序？
   */
  const stream = renderToPipeableStream(
    <HTML
      lang={lang}
      env={JSON.stringify(env)}
      // cookieStorage={cookieStore}
      helmetContext={helmetContext}
      preloadedState={JSON.stringify(store.getState())}
      link={generateStyleElements(stylesPath)}
      preLoad={generatePreloadScriptElements(preloadScriptsPath)}
      refresh={generateScriptElements(refreshPath)}
    >
      <CacheProvider value={emotionCache}>
        <ChakraProvider resetCSS theme={theme} colorModeManager={cookieStore}>
          <Provider store={store} serverState={store.getState()}>
            <Router location={req.url}>
              <HelmetProvider context={helmetContext}>
                <App />
              </HelmetProvider>
            </Router>
          </Provider>
        </ChakraProvider>
      </CacheProvider>
    </HTML>,
    {
      bootstrapScripts: scriptsPath.map((s) => (typeof s === "string" ? s : s.path ? s.path : null)).filter(Boolean),
      // to support static generate, for SSR use
      [shellMethod]() {
        if (!error) {
          initial = true;
          res.statusCode = 200;
          res.setHeader("Content-type", "text/html");
          stream.pipe(res);
        }
      },
      onShellError(err) {
        error = true;
        if (!initial) {
          initial = true;
          if (!env.isSTATIC) {
            // Something errored before we could complete the shell so we fallback to client render
            targetCSRRender({ req, res, store, lang, env, assets });
          } else {
            res.status(500).send("server render error!");
          }
        }
        serverLog((err as Error).stack, "error");
      },
      onError(err) {
        error = true;
        if (!initial) {
          initial = true;
          if (!env.isSTATIC) {
            // not set header, so we can safe to fallback to client render
            targetCSRRender({ req, res, store, lang, env, assets });
          } else {
            res.status(500).send("server render error!");
          }
        }
        serverLog((err as Error).stack, "error");
      },
    }
  );
};
