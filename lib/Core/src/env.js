import { SORT_BY_DEEP_HEAP, createRef } from "./share.js";

export const asyncUpdateTimeLimit = 18;

export const globalLoop = createRef(false);

export const rootFiber = createRef(null);

export const rootContainer = createRef(null);

export const currentRunningFiber = createRef(null);

export const currentFunctionFiber = createRef(null);

export const currentHookDeepIndex = createRef(0);

export const isMounted = createRef(false);

export const isServerRender = createRef(false);

export const isHydrateRender = createRef(false);

// ==== feature ==== //
export const enableKeyDiff = createRef(true);

export const enableHighLight = createRef(false);

export const enableDebugLog = createRef(false);

export const enableAllCheck = createRef(true);

export const enableAsyncUpdate = createRef(true);

export const enableEventSystem = createRef(true);

export const enableControlComponent = createRef(true);

// ==== running ==== //
export const asyncUpdateTimeStep = createRef(null);

export const nextTransformFiberArray = createRef([]);

export const currentTransformFiberArray = createRef([]);

// ==== update ==== //
export const pendingEffectArray = createRef([]);

export const pendingLayoutEffectArray = createRef([]);

export const pendingSyncModifyFiberArray = createRef([]);

export const pendingAsyncModifyFiberArray = createRef(SORT_BY_DEEP_HEAP);

export const pendingAsyncModifyTopLevelFiber = createRef(null);

export const pendingAsyncModifyFiber = createRef(null);

export const pendingMountFiberArray = createRef([]);

export const pendingUpdateFiberArray = createRef([]);

export const pendingUnmountFiberArray = createRef([]);

export const pendingPositionFiberArray = createRef([]);
