import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

import { useLoadingState } from "@client/common/WrapperLoading";
import { getIsCSR } from "@shared";
import { clientActionName } from "@shared/store/action";
import { setDataSuccess_client } from "@shared/store/reducer";

import type { UsePreLoadType } from "@client/types/hooks";
import type { RootState } from "@shared";

/* WrapperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad }) => {
  const isRedirect = useRef<string | undefined>();
  const store = useStore<RootState>();
  const location = useLocation();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { setLoading } = useLoadingState();
  // for pure client render, need preload data
  const firstLoad = useRef(getIsCSR() ? true : false);
  const loadedPath = useRef<string | undefined>("");
  const loadingPath = useRef<string | null>("");
  const timer1 = useRef<NodeJS.Timeout | null>(null);
  const timer2 = useRef<NodeJS.Timeout | null>(null);
  const storeRef = useRef(store);

  // for pure client render, there are not exist loaded location
  const [loadedLocation, setLoadedLocation] = useState(getIsCSR() ? undefined : { location, query });

  loadingPath.current = `${location.pathname}?${query.toString()}`;

  loadedPath.current = loadedLocation ? `${loadedLocation.location.pathname}?${loadedLocation.query.toString()}` : "";

  storeRef.current = store;

  useEffect(() => {
    // skip first load if need
    if (!firstLoad.current) {
      const isRedirectCurrentPath = isRedirect.current && isRedirect.current === `${location.pathname}?${query.toString()}`;
      if (!isRedirectCurrentPath) {
        setLoading(false);
      }
      if (loadedPath.current !== `${location.pathname}?${query.toString()}`) {
        if (!isRedirectCurrentPath) {
          timer1.current && clearTimeout(timer1.current);
          timer1.current = null;
          timer2.current && clearTimeout(timer2.current);
          timer2.current = null;
          timer1.current = setTimeout(() => {
            setLoading(true);
          }, 200);
        }

        // 分离每次load逻辑  避免跳转错乱
        const currentLoad = (location: ReturnType<typeof useLocation>, query: URLSearchParams): void => {
          preLoad(routes, location.pathname, query, storeRef.current).then((config) => {
            const currentLoadKey = `${location.pathname}?${query.toString()}`;
            if (currentLoadKey === loadingPath.current) {
              const { redirect, error, props } = config || {};
              if (redirect) {
                isRedirect.current = `${redirect.location.pathName}?${redirect.location.query?.toString()}`;
              } else {
                isRedirect.current = "";
              }
              if (error) {
                console.error(error);
                setLoading(false);
              } else if (redirect) {
                navigate(isRedirect.current);
              } else {
                timer2.current = setTimeout(() => {
                  timer1.current && clearTimeout(timer1.current);
                  timer1.current = null;
                  if (loadingPath.current === currentLoadKey) {
                    props && storeRef.current.dispatch(setDataSuccess_client({ name: clientActionName.clientProps, data: props }));
                    setLoading(false);
                    setLoadedLocation({ location, query });
                  }
                }, 50);
              }
            }
          });
        };

        currentLoad(location, query);
      }
    } else {
      firstLoad.current = false;
    }
  }, [location, preLoad, routes, navigate, query, setLoading]);

  return { loaded: loadedLocation };
};

export { usePreLoad };
