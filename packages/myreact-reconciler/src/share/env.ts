import { createRef, __my_react_internal__ } from "@my-react/react";

import type { RefreshHandler } from "./refresh";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const currentRefreshHandler = createRef<RefreshHandler | null>(null);

// TODO
// need improve
export const currentTriggerFiber = createRef<MyReactFiberNode | MyReactFiberNode[] | null>(null);

export const fiberToDispatchMap = __my_react_internal__.fiberToDispatchMap as Map<MyReactFiberNode, CustomRenderDispatch>;

export const enableFiberForLog = createRef(false);

export const enableDebugUpdateQueue = createRef(false);

export const enableValidMyReactElement = createRef(false);

export const enableLogForCurrentFlowIsRunning = createRef(false);
