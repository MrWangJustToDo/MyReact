import { __myreact_shared__ } from "@my-react/react";
import { mapFiber } from "@ReactDOM_shared";
import { clearFiberDom } from "./clearFiberDom";
export var _unmount = function (fiber) {
    __myreact_shared__.unmountFiber(fiber);
    clearFiberDom(fiber);
};
export var unmount = function (fiber) {
    var allUnmountFiber = fiber.__unmountQueue__.slice(0);
    if (allUnmountFiber.length) {
        mapFiber(allUnmountFiber, function (f) { return _unmount(f); });
    }
    fiber.__unmountQueue__ = [];
};
//# sourceMappingURL=feature.js.map