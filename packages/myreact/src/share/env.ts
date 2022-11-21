import { createRef } from "./createRef";

import type { MyReactFiberNode } from "../fiber";
import type { MyReactReactiveInstance } from "../reactive";

export const globalLoop = createRef(false);

export const currentRunningFiber = createRef<MyReactFiberNode | null>(null);

export const currentComponentFiber = createRef<MyReactFiberNode | null>(null);

export const currentFunctionFiber = createRef<MyReactFiberNode | null>(null);

export const currentReactiveInstance = createRef<MyReactReactiveInstance | null>(null);

export const currentHookDeepIndex = createRef(0);

// ==== feature ==== //
export const enableDebugLog = createRef(false);

export const enableConcurrentMode = createRef(false);

export const enableKeyDiff = createRef(true);

// enable react-18 strict lifecycle method
export const enableStrictLifeCycle = createRef(false);
