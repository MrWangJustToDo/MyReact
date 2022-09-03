import { __myreact_shared__ } from "@my-react/react";
import { nextWorkAsync } from "../generate";
var safeCall = __myreact_shared__.safeCall;
export var updateLoopAsync = function (loopController, shouldPause, reconcileUpdate) {
    var _loop_1 = function () {
        var fiber = loopController.getNext();
        if (fiber) {
            var nextFiber = safeCall(function () { return nextWorkAsync(fiber, loopController.getTopLevel()); });
            loopController.getUpdateList(fiber);
            loopController.setYield(nextFiber);
        }
    };
    while (loopController.hasNext() && !shouldPause()) {
        _loop_1();
    }
    if (!loopController.doesPause()) {
        reconcileUpdate();
    }
};
//# sourceMappingURL=updateLoopAsync.js.map