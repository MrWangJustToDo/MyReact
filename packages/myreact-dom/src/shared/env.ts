import { createRef, __my_react_internal__ } from "@my-react/react";

const { createReadonlyRef } = __my_react_internal__;

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
export const enableNewEntry = createRef(false);

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
export const enableHydrateWarn = createRef(true);

/**
 * @internal
 */
export const isServer = typeof window === "undefined";

/**
 * @internal
 */
export const enableMoveBefore = createRef(false);
