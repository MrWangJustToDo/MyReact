import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";
import { isHydrateRender, startRender } from "../../shared";
import { ClientDispatch } from "../dispatch";
var globalDispatch = __myreact_internal__.globalDispatch, rootContainer = __myreact_internal__.rootContainer, rootFiber = __myreact_internal__.rootFiber;
var createFiberNode = __myreact_shared__.createFiberNode;
export var hydrate = function (element, container) {
    var _a;
    globalDispatch.current = new ClientDispatch();
    isHydrateRender.current = true;
    var fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);
    fiber.dom = container;
    fiber.__root__ = true;
    rootFiber.current = fiber;
    rootContainer.current = container;
    (_a = container.setAttribute) === null || _a === void 0 ? void 0 : _a.call(container, "hydrate", "MyReact");
    container.__fiber__ = fiber;
    startRender(fiber, true);
    isHydrateRender.current = false;
};
//# sourceMappingURL=hydrate.js.map