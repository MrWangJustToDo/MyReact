import { __spreadArray } from "tslib";
export var once = function (action) {
    var called = false;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (called)
            return;
        called = true;
        action.call.apply(action, __spreadArray([null], args, false));
    };
};
//# sourceMappingURL=once.js.map