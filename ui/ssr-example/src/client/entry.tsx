/* eslint-disable react/no-deprecated */
/* eslint-disable @typescript-eslint/no-var-requires */
import { startTransition } from "react";
import { hydrate } from "react-dom";
import { hydrateRoot, createRoot } from "react-dom/client";

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

const loadableReady = async (cb: () => void) => {
  if (__STREAM__) {
    cb?.();
  } else {
    await import("@loadable/component").then(({ loadableReady }) => loadableReady(cb));
  }
};

if (window.__ENV__.isPURE_CSR) {
  const { loadCurrentLang } = require("@shared");
  loadCurrentLang(store.dispatch, window.__ENV__.LANG as "en" | "ar").then(() => loadableReady(() => createRoot(place).render(<Root store={store} />)));
} else {
  if (!window.__ENV__.isSSR || (window.__ENV__.isDEVELOPMENT && window.__ENV__.isMIDDLEWARE)) {
    loadableReady(() => createRoot(place).render(<Root store={store} />));
  } else {
    startTransition(() => {
      loadableReady(() => (__STREAM__ ? hydrateRoot(place, <Root store={store} />) : hydrate(<Root store={store} />, place)));
    });
  }
}
