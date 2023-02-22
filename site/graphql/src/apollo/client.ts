import { ApolloClient, from } from "@apollo/client";
import merge from "lodash/merge";
import { useMemo } from "react";

import { autoMergeCache, plainCache } from "./cache";
import { authLink, httpLink, onErrorLink } from "./links";

import type { ApolloClientOptions, NormalizedCacheObject } from "@apollo/client";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const __SERVER__ = typeof window === "undefined";

const _createApolloClient = ({ ...restProps }: Omit<ApolloClientOptions<NormalizedCacheObject>, "cache"> = {}, enableInfinityLoad = true) =>
  new ApolloClient<NormalizedCacheObject>({
    ssrMode: __SERVER__,
    link: from([onErrorLink, authLink, httpLink]),
    cache: enableInfinityLoad ? autoMergeCache : plainCache,
    ...restProps,
  });

const createApolloClient = (initialState: NormalizedCacheObject = {}, enableInfinityLoad?: boolean) => {
  const _apolloClient = apolloClient ?? _createApolloClient({}, enableInfinityLoad);

  // for server side, every apollo request should clean the cache
  if (__SERVER__) {
    _apolloClient.cache.restore({});
  } else {
    // for client side, should merge exist cacheData
    const existCacheData = _apolloClient.cache.extract();
    _apolloClient.cache.restore(merge(existCacheData, initialState));
  }

  if (!__SERVER__) apolloClient = _apolloClient;

  return _apolloClient;
};

export const getApolloClient = createApolloClient;

export const useApollo = (initialState: NormalizedCacheObject, enableInfinityLoad?: boolean): ApolloClient<any> => {
  const store = useMemo(() => createApolloClient(initialState, enableInfinityLoad), [initialState, enableInfinityLoad]);
  return store;
};
