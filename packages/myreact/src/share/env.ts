import { createRef } from "./createRef";

import type { MyReactFiberNode } from "../fiber";

export const globalLoop = createRef(false);

export const currentRunningFiber = createRef<MyReactFiberNode | null>(null);

export const currentComponentFiber = createRef<MyReactFiberNode | null>(null);

export const currentFunctionFiber = createRef<MyReactFiberNode | null>(null);

export const currentHookDeepIndex = createRef(0);

// ==== feature ==== //
export const enableDebugLog = createRef(false);

export const enableAsyncUpdate = createRef(true);

export const enableKeyDiff = createRef(true);

export const enableStrictLifeCycle = createRef(false);
