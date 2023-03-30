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

// ==== feature ==== //
export const enableDebugLog = createRef(false);

export const enableConcurrentMode = createRef(true);

export const enableSyncFlush = createRef(false);

// support "unsafe_" lifecycle
export const enableLegacyLifeCycle = createRef(true);

// enable react-18 strict lifecycle method
export const enableStrictLifeCycle = createRef(false);
