import { __myreact_internal__ } from "@my-react/react";
import { pendingModifyFiberArray, pendingModifyTopLevelFiber } from "@ReactDOM_shared";
var globalDispatch = __myreact_internal__.globalDispatch, isAppCrash = __myreact_internal__.isAppCrash;
var currentYield = null;
export var updateFiberController = {
    setYield: function (fiber) {
        if (fiber) {
            currentYield = fiber;
        }
        else {
            currentYield = null;
            globalDispatch.current.endProgressList();
        }
    },
    getNext: function () {
        if (isAppCrash.current)
            return null;
        var yieldFiber = currentYield;
        currentYield = null;
        if (yieldFiber)
            return yieldFiber;
        while (pendingModifyFiberArray.current.length) {
            var newProgressFiber = pendingModifyFiberArray.current.shift();
            if (newProgressFiber === null || newProgressFiber === void 0 ? void 0 : newProgressFiber.mount) {
                globalDispatch.current.beginProgressList();
                pendingModifyTopLevelFiber.current = newProgressFiber;
                return newProgressFiber;
            }
        }
        return null;
    },
    getUpdateList: function (fiber) {
        globalDispatch.current.generateUpdateList(fiber);
    },
    hasNext: function () {
        if (isAppCrash.current)
            return false;
        return currentYield !== null || pendingModifyFiberArray.current.length > 0;
    },
    doesPause: function () { return currentYield !== null; },
    getTopLevel: function () { return pendingModifyTopLevelFiber.current; },
};
//# sourceMappingURL=tool.js.map