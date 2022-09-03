import memoize from "lodash/memoize";

export const getIsMiddleware = memoize(() => (__SERVER__ ? JSON.parse(process.env.MIDDLEWARE || "false") : window.__ENV__.isMIDDLEWARE));

export const getIsSSR = memoize(() => (__SERVER__ ? JSON.parse(process.env.SSR || "false") : window.__ENV__.isSSR));

export const getIsAnimateRouter = memoize(() => (__SERVER__ ? JSON.parse(process.env.ANIMATE_ROUTER || "false") : window.__ENV__.isANIMATE_ROUTER));
