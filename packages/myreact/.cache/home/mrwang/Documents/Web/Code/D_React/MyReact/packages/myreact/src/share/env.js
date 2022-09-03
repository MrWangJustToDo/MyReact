import { EmptyDispatch } from "../dispatch";
import { createRef } from "./createRef";
export var globalLoop = createRef(false);
export var globalDispatch = createRef(new EmptyDispatch());
export var rootFiber = createRef(null);
export var rootContainer = createRef(null);
export var currentRunningFiber = createRef(null);
export var currentFunctionFiber = createRef(null);
export var currentHookDeepIndex = createRef(0);
export var isAppMounted = createRef(false);
export var isAppCrash = createRef(false);
// ==== feature ==== //
export var enableDebugLog = createRef(false);
export var enableAsyncUpdate = createRef(true);
// ==== running ==== //
export var nRoundTransformFiberArray = createRef([]);
export var cRoundTransformFiberArray = createRef([]);
//# sourceMappingURL=env.js.map