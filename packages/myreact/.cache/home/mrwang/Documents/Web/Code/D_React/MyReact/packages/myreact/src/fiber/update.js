import { globalDispatch, isNormalEquals } from "../share";
export var updateFiberNode = function (_a, newChild) {
    var fiber = _a.fiber, parent = _a.parent, prevFiber = _a.prevFiber;
    fiber.installParent(parent);
    var prevVDom = fiber.__vdom__;
    fiber.installVDom(newChild);
    var newVDom = fiber.__vdom__;
    fiber.checkVDom();
    fiber.updateRenderState();
    if (prevVDom !== newVDom) {
        if (fiber.__isMemo__) {
            var typedPrevVDom = prevVDom;
            var typedNewVDom = newVDom;
            if (!fiber.__needTrigger__ && isNormalEquals(typedPrevVDom.props, typedNewVDom.props)) {
                fiber.afterUpdate();
            }
            else {
                fiber.prepareUpdate();
            }
        }
        else {
            fiber.prepareUpdate();
            if (fiber.__isContextProvider__) {
                var typedPrevVDom = prevVDom;
                var typedNewVDom = newVDom;
                if (!isNormalEquals(typedPrevVDom.props.value, typedNewVDom.props.value)) {
                    globalDispatch.current.pendingContext(fiber);
                }
            }
            if (fiber.__isPlainNode__) {
                var typedPrevVDom = prevVDom;
                var typedNewVDom = newVDom;
                if (!isNormalEquals(typedPrevVDom.props, typedNewVDom.props, false)) {
                    globalDispatch.current.pendingUpdate(fiber);
                }
            }
            if (fiber.__isTextNode__) {
                globalDispatch.current.pendingUpdate(fiber);
            }
        }
    }
    if (fiber !== prevFiber) {
        globalDispatch.current.pendingPosition(fiber);
    }
    return fiber;
};
//# sourceMappingURL=update.js.map