import { getIsAnimateRouter, getIsMiddleware, getIsSSR, getIsStaticGenerate } from "@shared";

import type { Middleware } from "../compose";

export const globalEnv: Middleware = (next) => async (args) => {
  const { PUBLIC_DEV_API_HOST, PUBLIC_PROD_API_HOST } = process.env;
  args.env = {
    isSSR: getIsSSR() || args.req.query.isSSR || false,
    isSTATIC: getIsStaticGenerate(),
    isPURE_CSR: false,
    isDEVELOPMENT: __DEVELOPMENT__,
    isMIDDLEWARE: getIsMiddleware(),
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? PUBLIC_DEV_API_HOST : PUBLIC_PROD_API_HOST,
  };

  await next(args);
};
