import { __myreact_internal__ } from "@my-react/react";
import { updateLoopAsync, updateLoopSync } from "@my-react/react-reconciler";
import { reconcileUpdate, shouldPauseAsyncUpdate } from "@ReactDOM_shared";
import { updateFiberController } from "./tool";
var globalLoop = __myreact_internal__.globalLoop;
export var updateAllSync = function () {
    globalLoop.current = true;
    updateLoopSync(updateFiberController, reconcileUpdate);
    globalLoop.current = false;
    Promise.resolve().then(function () {
        if (updateFiberController.hasNext()) {
            updateAllSync();
        }
    });
};
export var updateAllAsync = function () {
    globalLoop.current = true;
    updateLoopAsync(updateFiberController, shouldPauseAsyncUpdate, reconcileUpdate);
    globalLoop.current = false;
    Promise.resolve().then(function () {
        if (updateFiberController.hasNext()) {
            updateAllAsync();
        }
    });
};
//# sourceMappingURL=update.js.map