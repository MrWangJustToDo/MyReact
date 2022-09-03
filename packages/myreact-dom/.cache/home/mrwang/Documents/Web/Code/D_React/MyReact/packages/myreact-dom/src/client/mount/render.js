import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";
import { startRender, unmountComponentAtNode } from "../../shared";
import { ClientDispatch } from "../dispatch";
var globalDispatch = __myreact_internal__.globalDispatch, isAppCrash = __myreact_internal__.isAppCrash, rootContainer = __myreact_internal__.rootContainer, rootFiber = __myreact_internal__.rootFiber, MyReactFiberNodeClass = __myreact_internal__.MyReactFiberNode;
var createFiberNode = __myreact_shared__.createFiberNode;
export var render = function (element, container) {
    var _a;
    globalDispatch.current = new ClientDispatch();
    isAppCrash.current = false;
    var containerFiber = container.__fiber__;
    if (containerFiber instanceof MyReactFiberNodeClass) {
        if (containerFiber.checkIsSameType(element)) {
            containerFiber.installVDom(element);
            containerFiber.update();
            return;
        }
        else {
            unmountComponentAtNode(container);
        }
    }
    Array.from(container.children).forEach(function (n) { var _a; return (_a = n.remove) === null || _a === void 0 ? void 0 : _a.call(n); });
    var fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);
    fiber.dom = container;
    fiber.__root__ = true;
    rootFiber.current = fiber;
    rootContainer.current = container;
    (_a = container.setAttribute) === null || _a === void 0 ? void 0 : _a.call(container, "render", "MyReact");
    container.__fiber__ = fiber;
    startRender(fiber);
};
//# sourceMappingURL=render.js.map