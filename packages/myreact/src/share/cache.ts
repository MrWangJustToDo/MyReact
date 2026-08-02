import { lazy } from "../element";

import type { MyReactElementNode } from "../element";

type AnyFn = (...args: unknown[]) => unknown;

type CacheNode = {
  primitive: Map<unknown, CacheNode>;
  object: WeakMap<object, CacheNode>;
  status?: "value" | "error";
  value?: unknown;
  error?: unknown;
};

const functionCache = new WeakMap<AnyFn, CacheNode>();

function createNode(): CacheNode {
  return {
    primitive: new Map(),
    object: new WeakMap(),
  };
}

const EMPTY_OBJECT_KEY = {} as object;

function isStableEmptyObject(value: unknown): value is object {
  if (!value || typeof value !== "object") {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    return false;
  }

  return Object.keys(value).length === 0 && Object.getOwnPropertySymbols(value).length === 0;
}

export function cache<T extends AnyFn>(fn: T): T {
  return function cachedFn(...args: unknown[]) {
    let node = functionCache.get(fn);
    if (!node) {
      node = createNode();
      functionCache.set(fn, node);
    }

    for (const arg of args) {
      const isObject = (typeof arg === "object" && arg !== null) || typeof arg === "function";
      if (isObject) {
        // if the arg is empty (like {} ), the cache should be stable
        const key = isStableEmptyObject(arg) ? EMPTY_OBJECT_KEY : (arg as object);
        let next = node.object.get(key);
        if (!next) {
          next = createNode();
          node.object.set(key, next);
        }
        node = next;
      } else {
        let next = node.primitive.get(arg);
        if (!next) {
          next = createNode();
          node.primitive.set(arg, next);
        }
        node = next;
      }
    }

    if (node.status === "value") {
      return node.value as ReturnType<T>;
    }

    if (node.status === "error") {
      throw node.error;
    }

    try {
      const value = fn(...(args as Parameters<T>));
      node.status = "value";
      node.value = value;
      return value as ReturnType<T>;
    } catch (error) {
      node.status = "error";
      node.error = error;
      throw error;
    }
  } as T;
}

export function cacheSignal() {
  return {} as object;
}

const cacheLazyMap = new Map<Promise<MyReactElementNode>, ReturnType<typeof lazy>>();

export function cacheLazy(promise: Promise<MyReactElementNode>) {
  const exist = cacheLazyMap.get(promise);

  if (exist) return exist;

  const loader = function cacheLazyLoader() {
    return promise;
  };

  loader["$$rsc"] = promise;

  loader["displayName"] = "$$ServerResolve";

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const next = lazy(loader);

  cacheLazyMap.set(promise, next);

  return next;
}
