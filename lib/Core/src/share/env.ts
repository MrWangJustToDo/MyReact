import { EmptyDispatch } from '../dispatch';

import { createRef } from './createRef';

import type { FiberDispatch } from '../dispatch';
import type { PlainElement } from '../dom';
import type { MyReactFiberNode } from '../fiber';

export const asyncUpdateTimeLimit = 6;

export const globalLoop = createRef(false);

export const globalDispatch = createRef<FiberDispatch>(new EmptyDispatch());

export const rootFiber = createRef<MyReactFiberNode | null>(null);

export const rootContainer = createRef<Element | PlainElement | null>(null);

export const currentRunningFiber = createRef<MyReactFiberNode | null>(null);

export const currentFunctionFiber = createRef<MyReactFiberNode | null>(null);

export const currentHookDeepIndex = createRef(0);

export const isAppMounted = createRef(false);

export const isAppCrash = createRef(false);

export const isClientRender = createRef(false);

export const isServerRender = createRef(false);

export const isHydrateRender = createRef(false);

// ==== feature ==== //
export const enableKeyDiff = createRef(true);

export const enableHighlight = createRef(false);

export const enableDebugLog = createRef(false);

export const enableAllCheck = createRef(true);

export const enableAsyncUpdate = createRef(true);

export const enableEventSystem = createRef(true);

export const enableControlComponent = createRef(true);

// ==== running ==== //
export const asyncUpdateTimeStep = createRef<number | null>(null);

export const nRoundTransformFiberArray = createRef<MyReactFiberNode[]>([]);

export const cRoundTransformFiberArray = createRef<MyReactFiberNode[]>([]);

// ==== update ==== //

export const pendingSyncModifyFiberArray = createRef<MyReactFiberNode[]>([]);

export const pendingAsyncModifyFiberArray = createRef<MyReactFiberNode[]>([]);

export const pendingAsyncModifyTopLevelFiber =
  createRef<MyReactFiberNode | null>(null);

export const yieldAsyncModifyFiber = createRef<MyReactFiberNode | null>(null);

export const pendingReconcileFiberArray = createRef<MyReactFiberNode[]>([]);
