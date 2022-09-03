import { createElement, isValidElement, memo } from "react";
import { matchRoutes } from "react-router";

import { actionName } from "config/action";
import { apiName } from "config/api";
import { useGetInitialProps } from "hooks/useGetInitialProps";
import { setDataSuccess_client } from "store/reducer/client/share/action";
import { getDataAction_Server } from "store/reducer/server/share/action";

import { log } from "./log";

import type { LoadableComponent } from "@loadable/component";
import type { ComponentClass } from "react";
import type { Params } from "react-router";
import type { GetInitialStateProps, GetInitialStateType, PreLoadComponentType } from "types/components";
import type { PreLoadRouteConfig } from "types/router";
import type { SagaStore } from "types/store";

export type RedirectType = { code?: number; location: { pathName: string; query: URLSearchParams } };

function preLoad(
  routes: PreLoadRouteConfig[],
  pathname: string,
  query: URLSearchParams,
  store: SagaStore
): Promise<void | {
  redirect?: RedirectType;
  error?: string;
  cookies?: { [props: string]: string };
}> {
  const branch = matchRoutes(routes, pathname) || [];

  const promises: Promise<{
    redirect?: RedirectType;
    error?: string;
    cookies?: { [key: string]: string };
  } | void>[] = [];

  branch.forEach(({ route, params, pathname }) => {
    const match = { params, pathname };
    promises.push(_preLoad({ route: route as PreLoadRouteConfig, store, match, query }));
  });

  return Promise.all(promises).then((val) => {
    if (val.length) {
      const allInitialProps = val.filter(Boolean).reduce<{
        redirect?: RedirectType;
        error?: string;
        cookies?: { [key: string]: string };
      }>((s, c) => {
        if (!c) {
          return s;
        }
        s.cookies = { ...s.cookies, ...c.cookies };
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});
      return allInitialProps;
    }
    return { redirect: { code: 301, location: { pathName: "/404", query: new URLSearchParams() } } };
  });
}

const generateInitialPropsKey = (pathName: string, query: URLSearchParams) => `__preload-${pathName}-${query.toString()}-props__`;

type PreLoadProps = {
  route: PreLoadRouteConfig;
  store: SagaStore;
  match: { params: Params<string>; pathname: string };
  query: URLSearchParams;
};

type PreLoadType = (props: PreLoadProps) => Promise<{
  redirect?: RedirectType;
  error?: string;
  cookie?: { [key: string]: string };
} | void>;

const resolveGetInitialStateFunction = async ({ route }: Pick<PreLoadProps, "route">): Promise<GetInitialStateType | null> => {
  const getInitialStateArray: GetInitialStateType[] = [];
  // for Router
  if (route.getInitialState) {
    getInitialStateArray.push(route.getInitialState);
  }
  // for Component
  if (route.Component) {
    const WrapperComponent = route.Component;
    if (typeof WrapperComponent.load === "function") {
      const loadAbleComponent: PreLoadComponentType & { readonly default?: PreLoadComponentType } = await WrapperComponent.load();
      if (loadAbleComponent.getInitialState && typeof loadAbleComponent.getInitialState === "function") {
        getInitialStateArray.push(loadAbleComponent.getInitialState);
      }
      if (typeof loadAbleComponent.default !== "undefined") {
        const c = loadAbleComponent.default;
        if (c.getInitialState && typeof c.getInitialState === "function") {
          getInitialStateArray.push(c.getInitialState);
        }
      }
    } else {
      const preLoadComponent = WrapperComponent as PreLoadComponentType;
      if (preLoadComponent.getInitialState && typeof preLoadComponent.getInitialState === "function") {
        getInitialStateArray.push(preLoadComponent.getInitialState);
      }
    }
  }

  if (getInitialStateArray.length) {
    return async ({ store, pathName, params, query }: GetInitialStateProps) => {
      const res = await Promise.all(
        getInitialStateArray.map((fn) =>
          Promise.resolve()
            .then(() => fn({ store, pathName, params, query }))
            .catch((e) => {
              // catch all error by default
              log(`getInitialState error ${e}`, "error");
              return null;
            })
        )
      );
      return res.filter(Boolean).reduce<{
        redirect?: RedirectType;
        error?: string;
        cookies?: { [key: string]: string };
        props?: any;
      }>((s, c) => {
        if (!c) {
          return s;
        }
        s.cookies = { ...s.cookies, ...c.cookies };
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.props = { ...s.props, ...c.props };
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});
    };
  } else {
    return null;
  }
};

const _preLoad: PreLoadType = async ({ route, store, match, query }) => {
  const getInitialState = await resolveGetInitialStateFunction({ route });
  if (getInitialState) {
    const initialState = await getInitialState({ store, pathName: match.pathname, params: match.params, query });
    if (initialState) {
      const { props, ...resProps } = initialState;
      if (route.element && isValidElement(route.element)) {
        // current can not support fast refresh, so use another way
        // support autoInject props for component
        // route.element = cloneElement(route.element, props);

        // current props is invalid
        if (resProps.error || resProps.redirect) return resProps;
        // normally this is only happen on the router page
        // support fast refresh
        const serverSideProps = {
          [generateInitialPropsKey(match.pathname, query)]: props,
        };
        store.dispatch(setDataSuccess_client({ name: actionName.globalInitialProps, data: serverSideProps }));
        return resProps;
      }
      return resProps;
    }
  }
};

const preLoadLang = ({ store, lang }: Pick<PreLoadProps, "store"> & { lang: string }): Promise<void> => {
  return new Promise((resolve) => {
    if (store.getState().server.lang.data[lang]) {
      resolve();
    } else {
      store
        .dispatch(getDataAction_Server({ name: apiName.lang, lang }))
        .then(() => resolve())
        .catch(() => resolve());
    }
  });
};

function preLoadWrapper(preLoad: GetInitialStateType): (props: ComponentClass & { getInitialState?: GetInitialStateType }) => void {
  function Wrapper(Component: ComponentClass & { getInitialState?: GetInitialStateType }): void {
    Component.getInitialState = preLoad;
  }
  return Wrapper;
}

function AutoInjectInitialProps(Component: LoadableComponent<any>) {
  const memoComponent = memo(Component);
  const RouterComponentWithProps = () => {
    const props = useGetInitialProps();

    return createElement(memoComponent, props);
  };
  return RouterComponentWithProps;
}

export { preLoad, preLoadLang, preLoadWrapper, generateInitialPropsKey, AutoInjectInitialProps };
