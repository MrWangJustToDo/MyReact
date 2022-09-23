import { getIsAnimateRouter, getIsMiddleware, getIsSSR } from "@shared";

import type { Middleware } from "../compose";

export const globalEnv: Middleware = (next) => async (args) => {
  const { PUBLIC_DEV_API_HOST, PUBLIC_PROD_API_HOST, REACT } = process.env;
  args.env = {
    isSSR: getIsSSR() || args.req.query.isSSR || false,
    isPURE_CSR: false,
    FORMWORK: REACT,
    isDEVELOPMENT: __DEVELOPMENT__,
    isMIDDLEWARE: getIsMiddleware(),
    isANIMATE_ROUTER: getIsAnimateRouter(),
    PUBLIC_API_HOST: __DEVELOPMENT__ ? PUBLIC_DEV_API_HOST : PUBLIC_PROD_API_HOST,
  };

  await next(args);
};
