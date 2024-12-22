import { isObject } from "@my-react/react-shared";

import { createReactiveWithCache } from "./create";
import { ReactiveFlags } from "./symbol";

import type { Ref, UnwrapRef } from "./ref";

export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>;

export function reactive<T>(target: T) {
  if (isObject(target)) {
    if (isReactive(target)) return target as UnwrapNestedRefs<T>;
    // from source code
    if (isReadonly(target)) return target;
    return createReactiveWithCache(target, false, false) as UnwrapNestedRefs<T>;
  } else {
    throw new Error("reactive() only accept a object value");
  }
}

type Primitive = string | number | boolean | bigint | symbol | undefined | null;
type Builtin = Primitive | ((...args: unknown[]) => unknown) | Date | Error | RegExp;

export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
        : T extends Set<infer U>
          ? ReadonlySet<DeepReadonly<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<DeepReadonly<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<DeepReadonly<U>>
              : T extends Promise<infer U>
                ? Promise<DeepReadonly<U>>
                : T extends Ref<infer U>
                  ? Readonly<Ref<DeepReadonly<U>>>
                  : T extends { [p: string]: unknown }
                    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                    : Readonly<T>;

export function readonly<T>(target: T) {
  if (isObject(target)) {
    if (isReadonly(target)) return target as DeepReadonly<UnwrapNestedRefs<T>>;
    return createReactiveWithCache(target, false, true) as DeepReadonly<UnwrapNestedRefs<T>>;
  } else {
    throw new Error("readonly() only accept a object value");
  }
}

export function shallowReactive<T>(target: T) {
  if (isObject(target)) {
    if (isReactive(target) && isShallow(target)) return target as UnwrapNestedRefs<T>;
    return createReactiveWithCache(target, true, false) as UnwrapNestedRefs<T>;
  } else {
    throw new Error("shallowReactive() only accept a object value");
  }
}

export function shallowReadonly<T>(target: T) {
  if (isObject(target)) {
    if (isReadonly(target) && isShallow(target)) return target as Readonly<T>;
    return createReactiveWithCache(target, true, true) as Readonly<T>;
  } else {
    throw new Error("shallowReadonly() only accept a object value");
  }
}

export function isReactive(target: unknown): target is Record<string, unknown> {
  return isObject(target) && !!target[ReactiveFlags.Reactive_key];
}

export function isReadonly(target: unknown): target is Readonly<Record<string, unknown>> {
  return isObject(target) && !!target[ReactiveFlags.Readonly_key];
}

export function isShallow(target: unknown): target is Record<string, unknown> {
  return isObject(target) && !!target[ReactiveFlags.Shallow_key];
}

export function isProxy(target: unknown): target is Record<string, unknown> {
  return isReactive(target) || isReadonly(target);
}

export function toReactive<T extends Builtin>(value: T): T;
export function toReactive<T extends Record<string, unknown>>(value: T): UnwrapNestedRefs<T>;
export function toReactive<T>(value: T): UnwrapNestedRefs<T> | T {
  return isObject(value) ? reactive(value) : value;
}

export function toReadonly<T extends Builtin>(value: T): T;
export function toReadonly<T extends Record<string, unknown>>(value: T): DeepReadonly<UnwrapNestedRefs<T>>;
export function toReadonly<T>(value: T): T | DeepReadonly<UnwrapNestedRefs<T>> {
  return isObject(value) ? readonly(value) : value;
}

export function toRaw<T>(observed: T): T {
  const raw = isObject(observed) && observed[ReactiveFlags.Raw_key];
  return raw ? toRaw(raw as T) : observed;
}

export function markRaw<T extends Record<string, unknown>>(value: T): T & { [ReactiveFlags.Skip_key]?: true } {
  Object.defineProperty(value, ReactiveFlags.Skip_key, {
    value,
    configurable: true,
    enumerable: false,
  });
  return value;
}
