import { isFunction, isObject } from "@my-react/react-shared";

import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

export type WatchSource<T = unknown> = (() => T) | T;

export type WatchCallback<T = unknown> = (newValue: T, oldValue: T, onCleanUp: (fn: () => void) => void) => void;

function traversal<T = unknown>(target: T, set = new Set()): T {
  if (isObject(target)) {
    if (set.has(target)) return target;

    set.add(target);

    for (const key in target) {
      traversal(target[key], set);
    }

    return target;
  } else {
    return target;
  }
}

export function watch<T = unknown>(source: WatchSource<T>, cb: WatchCallback<T>) {
  let effectAction: () => T | void = () => void 0;

  if (isReactive(source)) {
    effectAction = () => traversal(source as T);
  } else if (isFunction(source)) {
    effectAction = source;
  } else {
    return;
  }

  let cleanUp: (() => void) | null = null;

  const onCleanUp = (fn: () => void) => {
    cleanUp = fn;
  };

  let oldValue: T | null = null;

  const effect = new ReactiveEffect<T>(effectAction as () => T, () => {
    if (cleanUp) {
      cleanUp();

      cleanUp = null;
    }

    const newValue = effect.run();

    cb(newValue, oldValue as T, onCleanUp);

    oldValue = newValue;
  });

  oldValue = effect.run();

  return effect;
}
