import type { ReactiveEffect } from "../api";

export const globalDepsMap = new WeakMap<Record<string, unknown> | unknown[], Map<string | number | symbol, Set<ReactiveEffect>>>();

export const globalReactiveMap = new WeakMap<Record<string, unknown>, Record<string, unknown>>();

export const globalReadOnlyMap = new WeakMap<Record<string, unknown>, Record<string, unknown>>();

export const globalShallowReactiveMap = new WeakMap<Record<string, unknown>, Record<string, unknown>>();

export const globalShallowReadOnlyMap = new WeakMap<Record<string, unknown>, Record<string, unknown>>();
