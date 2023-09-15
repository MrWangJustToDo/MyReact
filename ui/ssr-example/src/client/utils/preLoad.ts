import merge from "lodash/merge";
import { matchRoutes } from "react-router";

import type { PreLoadStateProps, GetInitialStateType, PreLoadStateType, AllPreLoadStateType, PreLoadComponentType } from "@client/types/common";
import type { PreLoadRouteConfig } from "@client/types/route";
import type { LoadableComponent } from "@loadable/component";
import type { RootStore } from "@shared";
import type { ComponentClass } from "react";
import type { Params } from "react-router";

export type RedirectType = {
  code?: number;
  location: { pathName: string; query?: URLSearchParams };
};

function preLoad(
  routes: PreLoadRouteConfig[],
  pathname: string,
  query: URLSearchParams,
  store: RootStore
): Promise<{
  // used to preload script by page initial
  page?: string[];
  error?: string;
  props?: Record<string, Record<string, unknown>>;
  redirect?: RedirectType;
}> {
  const branch = matchRoutes(routes, pathname) || [];

  const relativePathname = pathname;

  const promises: Promise<{
    error?: string;
    page?: string[];
    redirect?: RedirectType;
    props?: Record<string, Record<string, unknown>>;
  } | void>[] = [];

  branch.forEach(({ route, params, pathname }) => {
    const match = { params, pathname };
    promises.push(_preLoad({ route: route as PreLoadRouteConfig, store, match, query, relativePathname }));
  });

  return Promise.all(promises).then((val) => {
    if (val.length) {
      const allInitialProps = val.filter(Boolean).reduce<{
        error?: string;
        page?: string[];
        props?: Record<string, Record<string, unknown>>;
        redirect?: RedirectType;
      }>((s, c) => {
        if (!c) {
          return s;
        }
        s.props = merge(s.props, c.props);
        s.page = (s.page || []).concat(c.page || []);
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});
      return allInitialProps;
    }
    return {
      redirect: {
        code: 301,
        location: { pathName: "/404" },
      },
    };
  });
}

const preLoadPropsKey = (pathName: string) => `__preload-[${pathName}]-props__`;

type PreLoadProps = {
  route: PreLoadRouteConfig;
  store: RootStore;
  match: { params: Params<string>; pathname: string };
  relativePathname: string;
  query: URLSearchParams;
};

type PreLoadType = (props: PreLoadProps) => Promise<{
  error?: string;
  page?: string[];
  redirect?: RedirectType;
  props?: Record<string, Record<string, unknown>>;
} | void>;

const resolvePreLoadStateFunction = async ({ route }: Pick<PreLoadProps, "route">): Promise<AllPreLoadStateType | null> => {
  const preLoadStateArray: PreLoadStateType[] = [];
  // for router
  if (route.getInitialState) {
    preLoadStateArray.push(route.getInitialState);
  }

  if (__STREAM__) {
    if (route.preLoad) {
      const component = await route.preLoad();
      if (component["default"]) {
        const typedComponent = component["default"] as PreLoadComponentType;
        if (typedComponent.getInitialState) {
          preLoadStateArray.push(typedComponent.getInitialState);
        }
      }
      if (component["getInitialState"]) {
        const typedComponent = component as PreLoadComponentType;
        preLoadStateArray.push(typedComponent.getInitialState);
      }
    }
  } else {
    if (route.component) {
      const WrapperComponent = route.component;
      if (WrapperComponent["load"] && typeof WrapperComponent["load"] === "function") {
        const loadAbleComponent = WrapperComponent as LoadableComponent<Record<string, unknown>>;
        const preLoadComponent: PreLoadComponentType & { readonly default?: PreLoadComponentType } = await loadAbleComponent.load();
        if (preLoadComponent.getInitialState && typeof preLoadComponent.getInitialState === "function") {
          preLoadStateArray.push(preLoadComponent.getInitialState);
        }
        if (typeof preLoadComponent.default !== "undefined") {
          const c = preLoadComponent.default;
          if (c.getInitialState && typeof c.getInitialState === "function") {
            preLoadStateArray.push(c.getInitialState);
          }
        }
      } else {
        const preLoadComponent = WrapperComponent as PreLoadComponentType;
        if (preLoadComponent.getInitialState && typeof preLoadComponent.getInitialState === "function") {
          preLoadStateArray.push(preLoadComponent.getInitialState);
        }
      }
    }
  }

  if (preLoadStateArray.length) {
    return async ({ store, pathName, params, relativePathname, query }: PreLoadStateProps) => {
      const propsKey = preLoadPropsKey(pathName);
      const res = await Promise.all(
        preLoadStateArray.map((fn) =>
          Promise.resolve()
            .then(() => fn({ store, pathName, params, relativePathname, query }))
            .catch((e) => {
              // catch all error by default
              console.error(`[${__CLIENT__ ? "client" : "server"}] getInitialState error ${e.toString()}`);
              return null;
            })
        )
      );

      const result = res.filter(Boolean).reduce<{
        redirect?: RedirectType;
        error?: string;
        props?: Record<string, unknown>;
      }>((s, c) => {
        if (!c) {
          return s;
        }
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.props = merge(s.props, c.props);
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});

      return {
        ...result,
        props: { [propsKey]: result.props || {} },
      };
    };
  } else {
    return null;
  }
};

const _preLoad: PreLoadType = async ({ route, store, match, query, relativePathname }) => {
  const getInitialState = await resolvePreLoadStateFunction({ route });
  if (getInitialState) {
    const initialState = await getInitialState({
      store,
      pathName: match.pathname,
      params: match.params,
      relativePathname,
      query,
    });
    if (route.path) {
      return { ...initialState, page: [route.path] };
    } else {
      return initialState;
    }
  } else if (route.path) {
    return { page: [route.path] };
  }
};

function initialStateWrapper<T extends Record<string, unknown>>(getInitialState: GetInitialStateType<T>) {
  function Wrapper(Component: ComponentClass<T> & { getInitialState?: GetInitialStateType<T> }): void {
    Component.getInitialState = getInitialState;
  }
  return Wrapper;
}

export { preLoad, initialStateWrapper, preLoadPropsKey };
