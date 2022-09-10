import { EmptyDispatch } from "../dispatch";

import { createRef } from "./createRef";

import type { FiberDispatch } from "../dispatch";
import type { MyReactFiberNode } from "../fiber";

export const globalLoop = createRef(false);

export const globalDispatch = createRef<FiberDispatch>(new EmptyDispatch());

export const currentRunningFiber = createRef<MyReactFiberNode | null>(null);

export const currentFunctionFiber = createRef<MyReactFiberNode | null>(null);

export const currentHookDeepIndex = createRef(0);

// ==== feature ==== //
export const enableDebugLog = createRef(false);

export const enableAsyncUpdate = createRef(true);

export const enableKeyDiff = createRef(true);
