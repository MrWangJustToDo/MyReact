/* eslint-disable @typescript-eslint/no-var-requires */
import { loadableReady } from "@loadable/component";
import { render, hydrate } from "react-dom";

import { createUniversalStore, safeData } from "../shared";

import "@client/styles/global.scss";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Root } from "./app";

import type { RootState } from "../shared";

const place = document.querySelector("#__content__") as HTMLDivElement;

const preLoadEnvElement = document.querySelector("script#__preload_env__");

const preLoadStateElement = document.querySelector("script#__preload_state__");

const store = createUniversalStore({
  preloadedState: JSON.parse(preLoadStateElement?.innerHTML || "{}") as RootState,
});

window.__ENV__ = JSON.parse(preLoadEnvElement?.innerHTML || "{}");

window.__PRELOAD_STORE_STATE__ = JSON.parse(preLoadStateElement?.innerHTML || "{}");

safeData(window.__ENV__);

safeData(window as unknown as Record<string, unknown>, "__ENV__");

safeData(window.__PRELOAD_STORE_STATE__);

safeData(window as unknown as Record<string, unknown>, "__PRELOAD_STORE_STATE__");

console.log(`[client] render page by "${window.__ENV__.FORMWORK}" formwork!`);

if (window.__ENV__.isPURE_CSR) {
  const { loadCurrentLang } = require("@shared");
  loadCurrentLang(store.dispatch, window.__ENV__.LANG as "en" | "ar").then(() => loadableReady(() => render(<Root store={store} />, place)));
} else {
  if (!window.__ENV__.isSSR || (window.__ENV__.isDEVELOPMENT && window.__ENV__.isMIDDLEWARE)) {
    loadableReady(() => render(<Root store={store} />, place));
  } else {
    loadableReady(() => hydrate(<Root store={store} />, place));
  }
}
