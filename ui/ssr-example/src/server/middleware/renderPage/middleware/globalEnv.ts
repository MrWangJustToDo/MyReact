import type { Middleware } from "../compose";

type ENV = {
  isSSR: boolean;
  isSTREAM?: boolean;
  isSTATIC: boolean;
  isPURE_CSR: boolean;
  isMIDDLEWARE: boolean;
  isDEVELOPMENT: boolean;
  isANIMATE_ROUTER: boolean;
  PUBLIC_API_HOST: string;
};

export const generateGlobalEnv =
  ({ isSSR, isSTATIC, isSTREAM, isPURE_CSR, isMIDDLEWARE, isDEVELOPMENT, isANIMATE_ROUTER, PUBLIC_API_HOST }: ENV): Middleware =>
  (next) =>
  async (args) => {
    args.env = {
      isSSR: isSSR || args.req.query.isSSR || false,
      isSTREAM,
      isSTATIC,
      isPURE_CSR,
      isDEVELOPMENT,
      isMIDDLEWARE,
      isANIMATE_ROUTER,
      PUBLIC_API_HOST,
      FRAMEWORK: process.env.REACT,
    };

    await next(args);
  };
