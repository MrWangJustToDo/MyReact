import { enableEventSystem } from "@ReactDOM_shared";
import { getNativeEventName } from "./getEventName";
export var removeEventListener = function (fiber, dom, key) {
    var _a;
    var typedElement = fiber.__prevVdom__;
    var callback = typedElement.props[key];
    var _b = getNativeEventName(key.slice(2), typedElement.type, typedElement.props), nativeName = _b.nativeName, isCapture = _b.isCapture;
    if (enableEventSystem.current) {
        var eventState = fiber.__internal_node_event__;
        var eventName = "".concat(nativeName, "_").concat(isCapture);
        if (!eventState[eventName])
            return;
        eventState[eventName].cb = (_a = eventState[eventName].cb) === null || _a === void 0 ? void 0 : _a.filter(function (c) { return c !== callback || typeof c !== "function"; });
    }
    else {
        dom.removeEventListener(nativeName, callback, isCapture);
    }
};
//# sourceMappingURL=removeEvent.js.map