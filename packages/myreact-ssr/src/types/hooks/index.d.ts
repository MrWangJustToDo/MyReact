import type { Params, useLocation } from "react-router";
import type { PreLoadRouteConfig } from "types/router";
import type { preLoad } from "utils/preLoad";

interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: typeof preLoad;
}
export interface UsePreLoadType {
  (props: UsePreLoadProps): {
    loaded?: { location: ReturnType<typeof useLocation>; params: Params<string>; query: URLSearchParams };
  };
}

export interface UseHydrate {
  (props: { routes: PreLoadRouteConfig[]; pathName: string }): void;
}
