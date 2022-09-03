import { __spreadArray } from "tslib";
import { __myreact_shared__ } from "@my-react/react";
import { enableControlComponent, enableEventSystem } from "@ReactDOM_shared";
import { getNativeEventName } from "./getEventName";
var safeCallWithFiber = __myreact_shared__.safeCallWithFiber;
var controlElementTag = {
    input: true,
    // textarea: true,
    // select: true,
};
export var addEventListener = function (fiber, dom, key) {
    var _a;
    var typedElement = fiber.element;
    var callback = typedElement.props[key];
    var _b = getNativeEventName(key.slice(2), typedElement.type, typedElement.props), nativeName = _b.nativeName, isCapture = _b.isCapture;
    if (enableEventSystem.current) {
        var eventState = fiber.__internal_node_event__;
        var eventName = "".concat(nativeName, "_").concat(isCapture);
        if (eventState[eventName]) {
            (_a = eventState[eventName].cb) === null || _a === void 0 ? void 0 : _a.push(callback);
        }
        else {
            var handler_1 = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var e = args[0];
                e.nativeEvent = e;
                safeCallWithFiber({
                    action: function () { var _a; return (_a = handler_1.cb) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return typeof cb === "function" && cb.call.apply(cb, __spreadArray([null], args, false)); }); },
                    fiber: fiber,
                });
                if (enableControlComponent.current) {
                    if (controlElementTag[typedElement.type] && typeof typedElement.props["value"] !== "undefined") {
                        dom["value"] = typedElement.props["value"];
                    }
                }
            };
            handler_1.cb = [callback];
            eventState[eventName] = handler_1;
            dom.addEventListener(nativeName, handler_1, isCapture);
        }
    }
    else {
        dom.addEventListener(nativeName, callback, isCapture);
    }
};
//# sourceMappingURL=addEvent.js.map