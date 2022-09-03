import { globalDispatch } from "../share";
import { MyReactFiberNode } from "./instance";
export var createFiberNode = function (_a, VDom) {
    var fiberIndex = _a.fiberIndex, parent = _a.parent, _b = _a.type, type = _b === void 0 ? "append" : _b;
    var newFiberNode = new MyReactFiberNode(fiberIndex, parent, VDom);
    newFiberNode.checkVDom();
    newFiberNode.initialType();
    newFiberNode.initialParent();
    globalDispatch.current.pendingCreate(newFiberNode);
    globalDispatch.current.pendingUpdate(newFiberNode);
    if (type === "append") {
        globalDispatch.current.pendingAppend(newFiberNode);
    }
    else {
        globalDispatch.current.pendingPosition(newFiberNode);
    }
    if (newFiberNode.__isPlainNode__ || newFiberNode.__isClassComponent__) {
        if (VDom.ref) {
            globalDispatch.current.pendingLayoutEffect(newFiberNode, function () { return newFiberNode.applyRef(); });
        }
    }
    return newFiberNode;
};
//# sourceMappingURL=create.js.map