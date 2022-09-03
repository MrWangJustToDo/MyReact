import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";
import { isServerRender, startRender } from "../shared";
import { ServerDispatch } from "./dispatch";
import { PlainElement } from "./dom";
var globalDispatch = __myreact_internal__.globalDispatch, rootFiber = __myreact_internal__.rootFiber, rootContainer = __myreact_internal__.rootContainer;
var createFiberNode = __myreact_shared__.createFiberNode;
// TODO should create global scope for every render
export var renderToString = function (element) {
    globalDispatch.current = new ServerDispatch();
    isServerRender.current = true;
    var container = new PlainElement("");
    var fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);
    fiber.dom = container;
    fiber.__root__ = true;
    rootFiber.current = fiber;
    rootContainer.current = container;
    startRender(fiber, false);
    isServerRender.current = false;
    return container.toString();
};
//# sourceMappingURL=renderToString.js.map