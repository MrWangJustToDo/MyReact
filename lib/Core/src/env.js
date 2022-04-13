import { createRef } from "./tools.js";

export const empty = {};

export const needLoop = createRef(false);

export const rootFiber = createRef(null);

export const rootContainer = createRef(null);

export const currentRunningFiber = createRef(null);

export const isMounted = createRef(false);

export const enableKeyDiff = createRef(true);

export const enableHighLight = createRef(true);

export const currentHookDeepIndex = createRef(0);

export const currentFunctionFiber = createRef(null);

export const nextTransformFiberArray = createRef([]);

export const currentTransformFiberArray = createRef([]);

export const pendingLayoutEffectArray = createRef([]);

export const pendingEffectArray = createRef([]);

export const pendingUpdateFiberArray = createRef([]);

export const pendingModifyFiberArray = createRef([]);

export const pendingUnmountFiberArray = createRef([]);

export const pendingPositionFiberArray = createRef([]);
