import { globalDispatch } from "../share";
export var effect = function (fiber, hookNode) {
    if (hookNode.effect && !hookNode.__pendingEffect__) {
        hookNode.__pendingEffect__ = true;
        if (hookNode.hookType === "useEffect") {
            globalDispatch.current.pendingEffect(fiber, function () {
                var _a;
                hookNode.cancel && hookNode.cancel();
                if ((_a = hookNode.__fiber__) === null || _a === void 0 ? void 0 : _a.mount)
                    hookNode.cancel = hookNode.value();
                hookNode.effect = false;
                hookNode.__pendingEffect__ = false;
            });
        }
        if (hookNode.hookType === "useLayoutEffect") {
            globalDispatch.current.pendingLayoutEffect(fiber, function () {
                var _a;
                hookNode.cancel && hookNode.cancel();
                if ((_a = hookNode.__fiber__) === null || _a === void 0 ? void 0 : _a.mount)
                    hookNode.cancel = hookNode.value();
                hookNode.effect = false;
                hookNode.__pendingEffect__ = false;
            });
        }
        if (hookNode.hookType === "useImperativeHandle") {
            globalDispatch.current.pendingLayoutEffect(fiber, function () {
                if (hookNode.value && typeof hookNode.value === "object")
                    hookNode.value.current = hookNode.reducer.call(null);
                hookNode.effect = false;
                hookNode.__pendingEffect__ = false;
            });
        }
    }
};
//# sourceMappingURL=effect.js.map