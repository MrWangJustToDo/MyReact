import { globalReactiveMap, globalReadOnlyMap, globalShallowReactiveMap, globalShallowReadOnlyMap } from "../share";

import { generateProxyHandler } from "./handler";
import { ReactiveFlags } from "./symbol";

export const getProxyCacheMap = (isShallow: boolean, isReadOnly: boolean) => {
  if (isShallow && isReadOnly) return globalShallowReadOnlyMap;
  if (isShallow) return globalShallowReactiveMap;
  if (isReadOnly) return globalReadOnlyMap;
  return globalReactiveMap;
};

export const createReactive = <T extends Record<string, unknown>>(target: T, cacheMap: WeakMap<T, T>, proxyHandler: ProxyHandler<T>) => {
  if (target[ReactiveFlags.Skip_key]) return target;

  if (!Object.isExtensible(target)) return target;

  if (cacheMap.has(target)) return cacheMap.get(target) as T;

  const proxy = new Proxy(target, proxyHandler);

  cacheMap.set(target, proxy);

  return proxy;
};

export function createReactiveWithCache<T extends Record<string, unknown>>(target: T, isShallow: boolean, isReadOnly: boolean) {
  return createReactive(target, getProxyCacheMap(isShallow, isReadOnly), generateProxyHandler(isShallow, isReadOnly));
}
