import type { Params } from "react-router";
import type { PreLoadRouteConfig } from "types/router";
import type { SagaStore } from "types/store";
import type { RedirectType } from "utils/preLoad";

export interface GetInitialStateProps {
  store: SagaStore;
  pathName: string;
  params: Params<string>;
  query: URLSearchParams;
}

export interface GetInitialStateType {
  (props: GetInitialStateProps):
    | Promise<{
        redirect?: RedirectType;
        error?: string;
        cookies?: { [key: string]: string };
        props?: any; // support auto inject props when data loaded
      } | void>
    | {
        redirect?: RedirectType;
        error?: string;
        cookies?: { [key: string]: string };
        props?: any; // support auto inject props when data loaded
      }
    | void;
}

export interface PreLoadComponentType<T = any> {
  (props: T): JSX.Element;
  getInitialState?: GetInitialStateType;
}

/* WrapperRoute */
interface WrapperRouteProps {
  children: React.ReactElement | React.ReactElement[] | string;
  routes: PreLoadRouteConfig[];
  LoadingBar: LoadingBarWrapperType;
  animationRouter?: boolean;
}
export interface WrapperRouteType {
  (props: WrapperRouteProps): MemoExoticComponent;
}

/* LoadingBar */
export interface LoadingBarWrapperType {
  (props: { loading?: boolean }): JSX.Element | null;
}
