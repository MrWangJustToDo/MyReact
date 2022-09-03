import { __myreact_internal__ } from "@my-react/react";
import { _unmount } from "../client/dispatch/unmount";
var MyReactFiberNodeClass = __myreact_internal__.MyReactFiberNode;
export var unmountComponentAtNode = function (container) {
    var fiber = container.__fiber__;
    if (fiber instanceof MyReactFiberNodeClass) {
        _unmount(fiber);
    }
};
//# sourceMappingURL=unmount.js.map