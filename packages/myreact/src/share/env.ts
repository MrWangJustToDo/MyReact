import { createRef } from "./createRef";

import type { MyReactFiberNode } from "../fiber";
import type { MyReactHookNode } from "../hook";
import type { ListTreeNode } from "@my-react/react-shared";

export const globalLoop = createRef(false);

export const currentRunningFiber = createRef<MyReactFiberNode | null>(null);

export const currentComponentFiber = createRef<MyReactFiberNode | null>(null);

export const currentFunctionFiber = createRef<MyReactFiberNode | null>(null);

export const currentHookTreeNode = createRef<ListTreeNode<MyReactHookNode> | null>(null);

// ==== feature ==== //
export const enableDebugLog = createRef(false);

export const enableConcurrentMode = createRef(true);

export const enableSyncFlush = createRef(false);

// TODO 从root更新并支持优先级
export const enableUpdateFromRoot = createRef(false);

// support "unsafe_" lifecycle
export const enableLegacyLifeCycle = createRef(true);

// enable react-18 strict lifecycle method
export const enableStrictLifeCycle = createRef(false);
