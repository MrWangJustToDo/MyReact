import { isArray, isCollection, isInteger, isObject } from "@my-react/react-shared";

import { getProxyCacheMap } from "./create";
import { pauseTracking, resetTracking, track, trigger } from "./effect";
import { reactive, isReadonly as isReadOnlyFunction, isShallow as isShallowFunction, toRaw, readonly } from "./reactive";
import { isRef } from "./ref";
import { ReactiveFlags } from "./symbol";

/**
 * array method track:
 * const data = {a: 1, b: 2};
 * const arr = reactive([data]);
 * usage effect(() => {
 *  if (arr.includes(data)) {
 *    console.log('foo')
 *  }
 * })
 */

export const generateArrayProxyHandler = () => {
  const methodNames = ["includes", "indexOf", "lastIndexOf", "find", "findIndex", "findLast", "findLastIndex"] as const;

  // 这些方法会修改数组  同时也会访问length属性，对于数组的操作可能会死循环
  const noTrackMethodNames = ["push", "pop", "shift", "unshift", "splice"] as const;

  const handlerObject: Partial<Record<typeof methodNames[number] | typeof noTrackMethodNames[number], (...args: unknown[]) => unknown>> = {};

  methodNames.reduce((p, c) => {
    p[c] = function (this: unknown[], ...args: unknown[]) {
      const arr = toRaw(this) as any;
      for (let i = 0; i < this.length; i++) {
        track(arr, "get", i.toString());
      }
      const res = arr[c](...args);
      if (res === -1 || res === false) {
        // if that didn't work, run it again using raw values.
        return arr[c](...args.map(toRaw));
      } else {
        return res;
      }
    };
    return p;
  }, handlerObject);

  noTrackMethodNames.reduce((p, c) => {
    p[c] = function (this: unknown[], ...args: unknown[]) {
      pauseTracking();
      const arr = toRaw(this) as any;
      const res = arr[c].apply(this, args);
      resetTracking();
      return res;
    };
    return p;
  }, handlerObject);

  return handlerObject;
};

const arrayProxyHandler = generateArrayProxyHandler();

export const generateProxyHandler = (isShallow = false, isReadOnly = false): ProxyHandler<Record<string, unknown>> => {
  const deletePropertyHandler = createDeletePropertyHandler(isReadOnly);
  const getHandler = createGetHandler(isShallow, isReadOnly);
  const setHandler = createSetHandler(isShallow, isReadOnly);
  const ownKeysHandler = createOwnKeysHandler();
  const hasHandler = createHasHandler();
  return {
    deleteProperty: deletePropertyHandler,
    ownKeys: ownKeysHandler,
    get: getHandler,
    set: setHandler,
    has: hasHandler,
  };
};

export const createObjectGetHandler = (isShallow: boolean, isReadOnly: boolean) => {
  return function (target: Record<string, unknown>, key: string | symbol, receiver: unknown) {
    const res = Reflect.get(target, key, receiver);

    if (!isReadOnly) {
      track(target, "get", key);
    }

    if (isShallow) return res;

    if (isRef(res)) return res.value;

    if (isObject(res)) {
      return isReadOnly ? readonly(res) : reactive(res);
    }

    return res;
  };
};

export const createArrayGetHandler = (isShallow: boolean, isReadOnly: boolean) => {
  return function (target: unknown[], key: string | symbol | number, receiver: unknown) {
    if (!isReadOnly && Reflect.has(arrayProxyHandler, key)) {
      return Reflect.get(arrayProxyHandler, key, receiver);
    }

    const res = Reflect.get(target, key, receiver);

    if (!isReadOnly) {
      track(target, "get", key);
    }

    if (isShallow) return res;

    if (isRef(res)) {
      return isInteger(key) ? res : res.value;
    }

    if (isObject(res)) {
      return isReadOnly ? readonly(res) : reactive(res);
    }

    return res;
  };
};

export const createGetHandler = (isShallow: boolean, isReadOnly: boolean) => {
  const objectGetHandler = createObjectGetHandler(isShallow, isReadOnly);
  const arrayGetHandler = createArrayGetHandler(isShallow, isReadOnly);

  return function (target: Record<string | number | symbol, unknown>, key: string | number | symbol, receiver: unknown) {
    if (key === ReactiveFlags.Reactive_key) return !isReadOnly;
    if (key === ReactiveFlags.Readonly_key) return isReadOnly;
    if (key === ReactiveFlags.Shallow_key) return isShallow;
    if (key === ReactiveFlags.Raw_key && receiver === getProxyCacheMap(isShallow, isReadOnly).get(target)) {
      return target;
    }

    if (isArray(target)) {
      return arrayGetHandler(target, key, receiver);
    }
    if (isCollection(target)) {
      throw new Error("current not support collection object");
    }
    return objectGetHandler(target, key as string | symbol, receiver);
  };
};

export const createDeletePropertyHandler = (isReadonly: boolean): ProxyHandler<Record<string, unknown>>["deleteProperty"] => {
  return function (target, key) {
    if (isReadonly) {
      console.warn("current object is readonly object");
      return true;
    }
    const hasKey = Reflect.has(target, key);
    const oldValue = target[key as string];
    const result = Reflect.deleteProperty(target, key);
    if (result && hasKey) {
      trigger(target, "delete", key, undefined, oldValue);
    }
    return result;
  };
};

export const createHasHandler = (): ProxyHandler<Record<string, unknown>>["has"] => {
  return function (target, key) {
    const result = Reflect.has(target, key);
    track(target, "has", key);
    return result;
  };
};

export const createOwnKeysHandler = (): ProxyHandler<Record<string, unknown>>["ownKeys"] => {
  return function (target) {
    track(target, "iterate", isArray(target) ? "length" : "collection");
    return Reflect.ownKeys(target);
  };
};

export const createSetHandler = (isShallow: boolean, isReadOnly: boolean) => {
  return function (target: Record<string, unknown>, key: string, value: unknown, receiver: unknown) {
    if (key === ReactiveFlags.Reactive_key || key === ReactiveFlags.Readonly_key || key === ReactiveFlags.Shallow_key || key === ReactiveFlags.Raw_key) {
      throw new Error(`can not set internal ${key} field for current object`);
    }

    if (isReadOnly) {
      throw new Error(`can not set ${key} field for readonly object`);
    }

    const targetIsArray = isArray(target);

    let oldValue = target[key as string];

    // TODO from source code
    if (isReadOnlyFunction(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }

    // TODO from source code
    if (!isShallow) {
      if (!isShallowFunction(value) && !isReadOnlyFunction(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!targetIsArray && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    } else {
      void 0;
    }

    const hadKey = targetIsArray && isInteger(key) ? Number(key) < target.length : Reflect.has(target, key);

    const res = Reflect.set(target, key, value, receiver);

    // 原型链的proxy set方法会按层级触发
    if (Object.is(target, toRaw(receiver))) {
      if (!hadKey) {
        trigger(target, "add", key, value, oldValue);
      } else if (!Object.is(oldValue, value)) {
        trigger(target, "set", key, value, oldValue);
      }
    }

    return res;
  };
};
