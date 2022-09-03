import { __myreact_shared__ } from "@my-react/react";
import { nextWorkAsync } from "../generate";
var safeCall = __myreact_shared__.safeCall;
export var updateLoopSync = function (loopController, reconcileUpdate) {
    if (loopController.hasNext()) {
        var fiber = loopController.getNext();
        var _loop_1 = function () {
            var _fiber = fiber;
            fiber = safeCall(function () { return nextWorkAsync(_fiber, loopController.getTopLevel()); });
            loopController.getUpdateList(_fiber);
            loopController.setYield(fiber);
        };
        while (fiber) {
            _loop_1();
        }
    }
    reconcileUpdate();
};
//# sourceMappingURL=updateLoopSync.js.map