import { createRef, PriorityQueueByArrayAboutJudge } from "./tools.js";

export const empty = {};

export const asyncUpdateTimeLimit = 16;

export const needLoop = createRef(false);

export const rootFiber = createRef(null);

export const rootContainer = createRef(null);

export const currentRunningFiber = createRef(null);

export const isMounted = createRef(false);

export const enableKeyDiff = createRef(true);

export const enableHighLight = createRef(true);

export const enableDebugLog = createRef(false);

export const enableAllCheck = createRef(true);

export const enableAsyncUpdate = createRef(true);

export const enableEventSystem = createRef(true);

export const enableControlComponent = createRef(true);

export const asyncUpdateTimeStep = createRef(null);

export const currentHookDeepIndex = createRef(0);

export const currentFunctionFiber = createRef(null);

export const nextTransformFiberArray = createRef([]);

export const currentTransformFiberArray = createRef([]);

export const pendingLayoutEffectArray = createRef([]);

export const pendingEffectArray = createRef([]);

export const pendingSyncModifyFiberArray = createRef([]);

export const pendingAsyncModifyFiberArray = createRef(
  new PriorityQueueByArrayAboutJudge(
    (o1, o2) => o1 > o2,
    (fiber) => fiber.deepIndex
  )
);

export const pendingUpdateFiberArray = createRef([]);

export const pendingUnmountFiberArray = createRef([]);

export const pendingPositionFiberArray = createRef([]);
