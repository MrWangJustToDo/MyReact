import { createRef } from "./createRef";

import type { RenderFiber } from "../renderFiber";
import type { RenderHook } from "../renderHook";
import type { RenderPlatform } from "../renderPlatform";
import type { ListTreeNode } from "@my-react/react-shared";

export const globalLoop = createRef(false);

export const currentRunningFiber = createRef<RenderFiber | null>(null);

export const currentComponentFiber = createRef<RenderFiber | null>(null);

export const currentRenderPlatform = createRef<RenderPlatform | null>(null);

export const currentHookTreeNode = createRef<ListTreeNode<RenderHook> | null>(null);

export const currentHookNodeIndex = createRef<number>(0);

export const enableLoopFromRoot = createRef(false);

// ==== feature ==== //
export const enableDebugLog = createRef(false);

export const enableSyncFlush = createRef(false);

export const enableHMRForDev = createRef(true);

export const enableConcurrentMode = createRef(true);

export const enableOptimizeTreeLog = createRef(true);

export const enableScopeTreeLog = createRef(true);

// support "unsafe_" lifecycle
export const enableLegacyLifeCycle = createRef(true);

// enable react-18 strict lifecycle method
// for now there are some bug for current flow, should not enable this feature flag
// TODO need improve strictMode flow
export const enableStrictLifeCycle = createRef(false);
