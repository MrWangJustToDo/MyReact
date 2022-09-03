import { EmptyDispatch } from "../dispatch";

import { createRef } from "./createRef";

import type { FiberDispatch } from "../dispatch";
import type { MyReactFiberNode } from "../fiber";

export const globalLoop = createRef(false);

export const globalDispatch = createRef<FiberDispatch>(new EmptyDispatch());

export const rootFiber = createRef<MyReactFiberNode | null>(null);

export const rootContainer = createRef<any | null>(null);

export const currentRunningFiber = createRef<MyReactFiberNode | null>(null);

export const currentFunctionFiber = createRef<MyReactFiberNode | null>(null);

export const currentHookDeepIndex = createRef(0);

export const isAppMounted = createRef(false);

export const isAppCrash = createRef(false);

// ==== feature ==== //
export const enableDebugLog = createRef(false);

export const enableAsyncUpdate = createRef(true);

// ==== running ==== //
export const nRoundTransformFiberArray = createRef<MyReactFiberNode[]>([]);

export const cRoundTransformFiberArray = createRef<MyReactFiberNode[]>([]);
