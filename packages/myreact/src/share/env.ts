
import { Scheduler, type RenderScheduler } from "../renderScheduler";

import { createReadonlyRef, createRef } from "./createRef";

import type { MyReactInternalInstance } from "../internal";
import type { RenderFiber } from "../renderFiber";
import type { RenderHook } from "../renderHook";
import type { ListTreeNode } from "@my-react/react-shared";

/**
 * @internal
 */
export const fiberToDispatchMap = new Map<RenderFiber, MyReactInternalInstance>();

/**
 * @internal
 */
export const currentCallingFiber: RenderFiber[] = [];

/**
 * @internal
 */
export const currentError = createRef<Error | null>(null);

/**
 * @internal
 */
export const currentScheduler = createRef<RenderScheduler | null>(new Scheduler());

/**
 * @internal
 */
export const globalLoop = createRef(false);

/**
 * @internal
 */
export const currentRunningFiber = createRef<RenderFiber | null>(null);

/**
 * @internal
 */
export const currentComponentFiber = createRef<RenderFiber | null>(null);

/**
 * @internal
 */
export const currentScopeFiber = createRef<RenderFiber | null>(null);

/**
 * @internal
 */
export const currentHookTreeNode = createRef<ListTreeNode<RenderHook> | null>(null);

/**
 * @internal
 */
export const currentHookNodeIndex = createRef<number>(0);

/**
 * @internal
 */
export const enableLoopFromRoot = createRef(true);

// ==== feature ==== //
/**
 * @internal
 */
export const enableDebugLog = createRef(false);

/**
 * @internal
 */
export const enableSyncFlush = createRef(false);

/**
 * @internal
 */
export const enableHMRForDev = createReadonlyRef(true);

/**
 * @internal
 */
export const enableConcurrentMode = createRef(true);

/**
 * @internal
 */
export const enableOptimizeTreeLog = createRef(true);

/**
 * @internal
 */
export const enableScopeTreeLog = createRef(true);

/**
 * @internal
 */
export const enablePerformanceLog = createRef(true);

// TODO
// double render, 尝试实现优先级中断的渲染
/**
 * @internal
 */
export const enableDoubleRender = createRef(false);

// support "unsafe_" lifecycle
/**
 * @internal
 */
export const enableLegacyLifeCycle = createReadonlyRef(true);

// enable react-18 strict lifecycle method
// for now there are some bug for current flow, should not enable this feature flag
// TODO need improve strictMode flow
/**
 * @internal
 */
export const enableStrictLifeCycle = createRef(false);

/**
 * @internal
 */
export const enableDebugFiled = createRef(true);

/**
 * @internal
 */
export const enableMockReact = createReadonlyRef(true);
