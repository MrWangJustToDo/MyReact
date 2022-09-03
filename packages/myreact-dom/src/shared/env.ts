import { createRef } from "@my-react/react";

import type { LinkTreeList } from "./listTree";
import type { MyReactFiberNode } from "@my-react/react";

export const enableAllCheck = createRef(__DEV__);

export const asyncUpdateTimeLimit = 8;

export const asyncUpdateTimeStep = createRef<number | null>(null);

export const isHydrateRender = createRef(false);

export const isServerRender = createRef(false);

// ==== update ==== //
export const pendingModifyFiberArray = createRef<MyReactFiberNode[]>([]);

export const pendingModifyTopLevelFiber = createRef<MyReactFiberNode | null>(null);

export const pendingUpdateFiberListArray = createRef<LinkTreeList<MyReactFiberNode>[]>([]);

export const pendingUpdateFiberList = createRef<LinkTreeList<MyReactFiberNode> | null>(null);

// ==== feature ==== //
export const enableControlComponent = createRef(true);

export const enableEventSystem = createRef(true);

export const enableHighlight = createRef(false);
