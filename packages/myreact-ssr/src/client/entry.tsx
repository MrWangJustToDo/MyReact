/* eslint-disable @typescript-eslint/no-var-requires */
import { loadableReady } from "@loadable/component";
import { hydrate, render } from "react-dom";

import { createUniversalStore } from "store";
import { log } from "utils/log";
import { safeData } from "utils/safeData";

import type { StoreState } from "types/store";

const place = document.querySelector("#__content__");

const preLoadEnvElement = document.querySelector("script#__preload_env__");

const preLoadStateElement = document.querySelector("script#__preload_state__");

const store = createUniversalStore({ initialState: JSON.parse(preLoadStateElement?.innerHTML || "{}") as StoreState });

window.__ENV__ = JSON.parse(preLoadEnvElement?.innerHTML || "{}");

window.__PRELOAD_STORE_STATE__ = JSON.parse(preLoadStateElement?.innerHTML || "{}");

safeData(window.__ENV__);

safeData(window as unknown as Record<string, unknown>, "__ENV__");

safeData(window.__PRELOAD_STORE_STATE__);

safeData(window as unknown as Record<string, unknown>, "__PRELOAD_STORE_STATE__");

let Root = ({ store: _store }: { store: ReturnType<typeof createUniversalStore> }) => <></>;

// multiple UI component
if (__UI__ === "antd") {
  const { Root: originalRoot } = require("./antDesignEntry");
  Root = originalRoot;
}
if (__UI__ === "chakra") {
  const { Root: originalRoot } = require("./chakraEntry");
  Root = originalRoot;
}

if (__CSR__) {
  log("pure render by client", "warn");
  const { preLoadLang } = require("utils/preLoad");
  preLoadLang({ store, lang: window.__ENV__.LANG }).then(() => loadableReady(() => render(<Root store={store} />, place)));
} else {
  if (!window.__ENV__.isSSR) {
    loadableReady(() => render(<Root store={store} />, place));
    // console.log((window as any).ReactDOM.renderToString(<Root store={store} />))
  } else {
    if (window.__ENV__.isDEVELOPMENT && window.__ENV__.isMIDDLEWARE) {
      log("not hydrate render on client", "warn");
      loadableReady(() => render(<Root store={store} />, place));
    } else {
      loadableReady(() => hydrate(<Root store={store} />, place));
    }
  }
}
