import cookie from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";

import { log } from "utils/log";
import { generateInitialPropsKey } from "utils/preLoad";

import { useChangeLoadingWithoutRedux } from "./useLoadingBar";

import type { Params } from "react-router";
import type { UsePreLoadType } from "types/hooks";
import type { StoreState } from "types/store";

/* WrapperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad }) => {
  const isRedirect = useRef<string | undefined>();
  const store = useStore<StoreState>();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [query] = useSearchParams();
  const { start, end } = useChangeLoadingWithoutRedux();
  // for pure client render, need preload data
  const firstLoad = useRef(__CSR__ ? false : true);
  const loadedPath = useRef<string | undefined>("");
  const loadingPath = useRef<string | null>("");
  const timer1 = useRef<NodeJS.Timeout | null>(null);
  const timer2 = useRef<NodeJS.Timeout | null>(null);
  const storeRef = useRef(store);
  // for pure client render, there are not exist loaded location
  const [loadedLocation, setLoadedLocation] = useState(__CSR__ ? undefined : { location, params, query });

  loadingPath.current = generateInitialPropsKey(location.pathname, query);

  loadedPath.current = loadedLocation ? generateInitialPropsKey(loadedLocation.location.pathname, loadedLocation.query) : "";

  storeRef.current = store;

  useEffect(() => {
    // skip first load if need
    if (!firstLoad.current) {
      const isRedirectCurrentPath = isRedirect.current && isRedirect.current === generateInitialPropsKey(location.pathname, query);
      if (!isRedirectCurrentPath) {
        end();
      }
      if (loadedPath.current !== generateInitialPropsKey(location.pathname, query)) {
        if (!isRedirectCurrentPath) {
          timer1.current && clearTimeout(timer1.current);
          timer1.current = null;
          timer2.current && clearTimeout(timer2.current);
          timer2.current = null;
          timer1.current = setTimeout(() => {
            start();
          }, 200);
        }

        // 分离每次load逻辑  避免跳转错乱
        const currentLoad = (location: ReturnType<typeof useLocation>, params: Params<string>, query: URLSearchParams): void => {
          preLoad(routes, location.pathname, query, storeRef.current).then((config) => {
            const currentLoadKey = generateInitialPropsKey(location.pathname, query);
            if (currentLoadKey === loadingPath.current) {
              const { redirect, error, cookies } = config || {};
              if (redirect) {
                isRedirect.current = generateInitialPropsKey(redirect.location.pathName, redirect.location.query);
              } else {
                isRedirect.current = "";
              }
              if (cookies) {
                Object.keys(cookies).forEach((key) => cookie.set(key, cookies[key]));
              }
              if (error) {
                log(`error ${error.toString()}`, "error");
                end();
              } else if (redirect) {
                navigate(isRedirect.current);
              } else {
                timer2.current = setTimeout(() => {
                  timer1.current && clearTimeout(timer1.current);
                  timer1.current = null;
                  if (loadingPath.current === currentLoadKey) {
                    end();
                    setLoadedLocation({ location, params, query });
                  }
                }, 50);
              }
            }
          });
        };

        currentLoad(location, params, query);
      }
    } else {
      firstLoad.current = false;
    }
  }, [location, preLoad, routes, navigate, end, start, params, query]);

  return { loaded: loadedLocation };
};

export { usePreLoad };
