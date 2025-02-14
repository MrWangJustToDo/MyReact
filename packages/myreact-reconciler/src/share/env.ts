import { createRef } from "@my-react/react";

import { MyWeakMap } from "./map";

import type { RefreshHandler } from "./refresh";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const currentRenderDispatch = createRef<CustomRenderDispatch | null>(null);

export const currentRefreshHandler = createRef<RefreshHandler | null>(null);

// TODO
// need improve
export const currentTriggerFiber = createRef<MyReactFiberNode | null>(null);

export const currentCallingFiber = createRef<MyReactFiberNode | null>(null);

export const fiberToDispatchMap = new MyWeakMap() as WeakMap<MyReactFiberNode, CustomRenderDispatch>;

export const enableFiberForLog = createRef(false);

export const enableDebugUpdateQueue = createRef(false);

export const enableValidMyReactElement = createRef(false);

export const enableLogForCurrentFlowIsRunning = createRef(false);
