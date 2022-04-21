import { createRef } from "./tools.js";

export const empty = {};

export const asyncUpdateTimeLimit = 16;

export const needLoop = createRef(false);

export const rootFiber = createRef(null);

export const rootContainer = createRef(null);

export const currentRunningFiber = createRef(null);

export const isMounted = createRef(false);

export const enableKeyDiff = createRef(true);

export const enableHighLight = createRef(false);

export const enableAsyncUpdate = createRef(true);

export const asyncUpdateTimeStep = createRef(null);

export const currentHookDeepIndex = createRef(0);

export const currentFunctionFiber = createRef(null);

export const nextTransformFiberArray = createRef([]);

export const currentTransformFiberArray = createRef([]);

export const pendingLayoutEffectArray = createRef([]);

export const pendingEffectArray = createRef([]);

export const pendingModifyFiberArray = createRef([]);

export const pendingUpdateFiberArray = createRef([]);

export const pendingUnmountFiberArray = createRef([]);

export const pendingPositionFiberArray = createRef([]);
