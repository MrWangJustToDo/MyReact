import { createRef } from "@my-react/react";
export var enableAllCheck = createRef(__DEV__);
export var asyncUpdateTimeLimit = 8;
export var asyncUpdateTimeStep = createRef(null);
export var isHydrateRender = createRef(false);
export var isServerRender = createRef(false);
// ==== update ==== //
export var pendingModifyFiberArray = createRef([]);
export var pendingModifyTopLevelFiber = createRef(null);
export var pendingUpdateFiberListArray = createRef([]);
export var pendingUpdateFiberList = createRef(null);
// ==== feature ==== //
export var enableControlComponent = createRef(true);
export var enableEventSystem = createRef(true);
export var enableHighlight = createRef(false);
//# sourceMappingURL=env.js.map