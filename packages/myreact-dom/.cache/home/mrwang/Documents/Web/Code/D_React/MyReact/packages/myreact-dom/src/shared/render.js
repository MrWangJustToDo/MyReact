import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";
import { mountLoopSync } from "@my-react/react-reconciler";
import { reconcileMount } from "./reconcileMount";
var globalLoop = __myreact_internal__.globalLoop, isAppMounted = __myreact_internal__.isAppMounted;
var safeCall = __myreact_shared__.safeCall;
export var startRender = function (fiber, hydrate) {
    if (hydrate === void 0) { hydrate = false; }
    globalLoop.current = true;
    safeCall(function () { return mountLoopSync(fiber); });
    reconcileMount(fiber, hydrate);
    isAppMounted.current = true;
    globalLoop.current = false;
};
//# sourceMappingURL=render.js.map