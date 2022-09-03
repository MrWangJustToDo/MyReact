import { __myreact_internal__ } from "@my-react/react";
var MyReactFiberNodeClass = __myreact_internal__.MyReactFiberNode;
export var mapFiber = function (arrayLike, action) {
    if (Array.isArray(arrayLike)) {
        arrayLike.forEach(function (f) { return mapFiber(f, action); });
    }
    else {
        if (arrayLike instanceof MyReactFiberNodeClass) {
            action(arrayLike);
        }
    }
};
//# sourceMappingURL=mapFiber.js.map