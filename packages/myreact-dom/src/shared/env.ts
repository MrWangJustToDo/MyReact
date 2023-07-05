import { createRef } from "@my-react/react";

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
export const enableControlComponent = createRef(true);

/**
 * @internal
 */
export const enableEventSystem = createRef(true);

/**
 * @internal
 */
export const enableHighlight = createRef(false);
