import type { PreLoadRouteConfig } from "./route";
import type { preLoad } from "@client/utils";
import type { useLocation } from "react-router";

interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: typeof preLoad;
}
export interface UsePreLoadType {
  (props: UsePreLoadProps): {
    loaded?: {
      location: ReturnType<typeof useLocation>;
      query: URLSearchParams;
    };
  };
}
