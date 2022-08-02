import { EmptyDispatch } from '../dispatch';

import { createRef } from './createRef';

import type { FiberDispatch } from '../dispatch';
import type { PlainElement } from '../dom';
import type { MyReactFiberNode } from '../fiber';
import type { LinkTreeList } from './listTree';

export const asyncUpdateTimeLimit = 8;

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
export const pendingModifyFiberArray = createRef<MyReactFiberNode[]>([]);

export const pendingModifyTopLevelFiber = createRef<MyReactFiberNode | null>(
  null
);

export const pendingUpdateFiberListArray = createRef<
  LinkTreeList<MyReactFiberNode>[]
>([]);

export const pendingUpdateFiberList =
  createRef<LinkTreeList<MyReactFiberNode> | null>(null);
