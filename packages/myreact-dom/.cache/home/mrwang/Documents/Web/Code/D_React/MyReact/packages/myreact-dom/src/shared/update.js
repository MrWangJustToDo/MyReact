import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";
import { isHydrateRender, isServerRender, pendingModifyFiberArray } from "./env";
var globalLoop = __myreact_internal__.globalLoop, globalDispatch = __myreact_internal__.globalDispatch;
var enableAsyncUpdate = __myreact_shared__.enableAsyncUpdate;
var updateEntry = function () {
    if (globalLoop.current)
        return;
    if (enableAsyncUpdate.current) {
        globalDispatch.current.updateAllAsync();
    }
    else {
        globalDispatch.current.updateAllSync();
    }
};
var asyncUpdate = function () { return Promise.resolve().then(updateEntry); };
export var triggerUpdate = function (fiber) {
    if (isServerRender.current || isHydrateRender.current) {
        if (__DEV__) {
            console.log("can not update component");
        }
        return;
    }
    fiber.triggerUpdate();
    pendingModifyFiberArray.current.push(fiber);
    asyncUpdate();
};
//# sourceMappingURL=update.js.map