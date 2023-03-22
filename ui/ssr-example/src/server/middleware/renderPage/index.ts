import { getIsAnimateRouter, getIsMiddleware, getIsStaticGenerate } from "@shared";

import { composeRender } from "./compose";
import { generateGlobalEnv, initLang, initStore, loadLang, loadStore } from "./middleware";
import { webpackRender } from "./render/webpackRender";

export const renderSSR = composeRender(
  generateGlobalEnv({
    isSSR: true,
    isSTATIC: getIsStaticGenerate(),
    isPURE_CSR: false,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang
)(async (args) => {
  const targetRender = webpackRender({ mode: "SSR" });
  await targetRender(args);
});

export const renderCSR = composeRender(
  generateGlobalEnv({
    isSSR: false,
    isSTATIC: false,
    isPURE_CSR: false,
    isDEVELOPMENT: __DEVELOPMENT__,
    isMIDDLEWARE: getIsMiddleware(),
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang
)(async (args) => {
  const targetRender = webpackRender({ mode: "CSR" });
  await targetRender(args);
});

export const renderP_CSR = composeRender(
  generateGlobalEnv({
    isSSR: false,
    isSTATIC: false,
    isPURE_CSR: true,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang
)(async (args) => {
  const targetRender = webpackRender({ mode: "P_CSR" });
  await targetRender(args);
});

export const renderStreamSSR = composeRender(
  generateGlobalEnv({
    isSSR: true,
    isSTREAM: true,
    isSTATIC: getIsStaticGenerate(),
    isPURE_CSR: false,
    isMIDDLEWARE: getIsMiddleware(),
    isDEVELOPMENT: __DEVELOPMENT__,
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST,
  }),
  initLang,
  initStore,
  loadStore,
  loadLang
)(async (args) => {
  const targetRender = webpackRender({ mode: "StreamSSR" });
  await targetRender(args);
});
