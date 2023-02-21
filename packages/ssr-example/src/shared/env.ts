import memoize from "lodash/memoize";

export const getIsMiddleware = memoize(() => (__SERVER__ ? JSON.parse(process.env.MIDDLEWARE || "false") : window.__ENV__.isMIDDLEWARE));

export const getIsSSR = memoize(() => (__SERVER__ ? JSON.parse(process.env.SSR || "false") : window.__ENV__.isSSR));

export const getIsAnimateRouter = memoize(() => (__SERVER__ ? JSON.parse(process.env.ANIMATE_ROUTER || "false") : window.__ENV__.isANIMATE_ROUTER));

export const getIsP_CSR = memoize(() => (__SERVER__ ? false : window.__ENV__.isPURE_CSR));

export const getIsStaticGenerate = memoize(() =>
  __SERVER__ ? JSON.parse(process.env.STATIC_GENERATE || "false") && process.env.NODE_ENV === "production" : window.__ENV__.isSTATIC
);

export const getPublicApi = memoize(() =>
  __SERVER__ ? (__DEVELOPMENT__ ? process.env.PUBLIC_DEV_API_HOST : process.env.PUBLIC_PROD_API_HOST) : window.__ENV__.PUBLIC_API_HOST
);
