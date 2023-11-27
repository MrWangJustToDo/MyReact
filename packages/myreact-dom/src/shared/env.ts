import { createRef } from "@my-react/react";

type ReadOnlyRef<T> = { readonly: boolean; current: T };

const createReadonlyRef = <T>(v: T) => {
  const a: ReadOnlyRef<T> = { current: v, readonly: true };

  Object.freeze(a);

  return a;
};

/**
 * @internal
 */
export const asyncUpdateTimeLimit = createRef<number>(8);

/**
 * @internal
 */
export const asyncUpdateTimeStep = createRef<number | null>(null);

// ==== feature ==== //
/**
 * @internal
 */
export const enableControlComponent = createReadonlyRef(true);

/**
 * @internal
 */
export const enableEventSystem = createReadonlyRef(true);

/**
 * @internal
 */
export const enableHighlight = createRef(false);

/**
 * @internal
 */
export const enableASyncHydrate = createRef(false);

/**
 * @internal
 */
export const enableDOMField = createRef(false);

/**
 * @internal
 */
export const enableEventTrack = createRef(false);

/**
 * @internal
 */
export const isServer = typeof window === "undefined";
