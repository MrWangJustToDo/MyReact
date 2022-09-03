import { __spreadArray } from "tslib";
import { currentRunningFiber, isAppCrash } from "./env";
export var getTrackDevLog = function (fiber) {
    var _a;
    if (!__DEV__)
        return "";
    var element = fiber.element;
    var source = typeof element === "object" ? element === null || element === void 0 ? void 0 : element._source : null;
    var owner = typeof element === "object" ? element === null || element === void 0 ? void 0 : element._owner : null;
    var preString = "";
    if (source) {
        var fileName = source.fileName, lineNumber = source.lineNumber;
        preString = "".concat(preString, " (").concat(fileName, ":").concat(lineNumber, ")");
    }
    if (owner &&
        !fiber.__isDynamicNode__ &&
        typeof owner.element === "object" &&
        typeof ((_a = owner.element) === null || _a === void 0 ? void 0 : _a.type) === "function") {
        var typedType = owner.element.type;
        var name_1 = typedType.displayName || owner.element.type.name;
        preString = "".concat(preString, " (render dy ").concat(name_1, ")");
    }
    return preString;
};
export var getFiberNodeName = function (fiber) {
    var _a, _b, _c;
    if (fiber.__isMemo__)
        return "<Memo />".concat(getTrackDevLog(fiber));
    if (fiber.__isLazy__)
        return "<Lazy />".concat(getTrackDevLog(fiber));
    if (fiber.__isPortal__)
        return "<Portal />".concat(getTrackDevLog(fiber));
    if (fiber.__isNullNode__)
        return "<null />".concat(getTrackDevLog(fiber));
    if (fiber.__isEmptyNode__)
        return "<Empty />".concat(getTrackDevLog(fiber));
    if (fiber.__isStrictNode__)
        return "<Strict />".concat(getTrackDevLog(fiber));
    if (fiber.__isSuspense__)
        return "<Suspense />".concat(getTrackDevLog(fiber));
    if (fiber.__isForwardRef__)
        return "<ForwardRef />".concat(getTrackDevLog(fiber));
    if (fiber.__isFragmentNode__)
        return "<Fragment />".concat(getTrackDevLog(fiber));
    if (fiber.__isContextProvider__)
        return "<Provider />".concat(getTrackDevLog(fiber));
    if (fiber.__isContextConsumer__)
        return "<Consumer />".concat(getTrackDevLog(fiber));
    if (typeof fiber.element === "object" && fiber.element !== null) {
        if (fiber.__isPlainNode__ && typeof ((_a = fiber.element) === null || _a === void 0 ? void 0 : _a.type) === "string") {
            return "<".concat(fiber.element.type, " />").concat(getTrackDevLog(fiber));
        }
        if (fiber.__isDynamicNode__ && typeof ((_b = fiber.element) === null || _b === void 0 ? void 0 : _b.type) === "function") {
            var typedType = fiber.element.type;
            var name_2 = typedType.displayName || fiber.element.type.name || "anonymous";
            name_2 = fiber.__root__ ? "".concat(name_2, " (root)") : name_2;
            return "<".concat(name_2, "* />").concat(getTrackDevLog(fiber));
        }
        return "<unknown />".concat(getTrackDevLog(fiber));
    }
    else {
        return "<text - (".concat((_c = fiber.element) === null || _c === void 0 ? void 0 : _c.toString(), ") />").concat(getTrackDevLog(fiber));
    }
};
export var getFiberTree = function (fiber) {
    if (fiber) {
        var preString = "".padEnd(4) + "at".padEnd(4);
        var parent_1 = fiber.parent;
        var res = "".concat(preString).concat(getFiberNodeName(fiber));
        while (parent_1) {
            res = "".concat(preString).concat(getFiberNodeName(parent_1), "\n").concat(res);
            parent_1 = parent_1.parent;
        }
        return "\n".concat(res);
    }
    return "";
};
export var getHookTree = function (hookType, newType) {
    var re = "\n" + "".padEnd(6) + "Prev render:".padEnd(20) + "Next render:".padEnd(10) + "\n";
    for (var key in hookType) {
        var c = hookType[key];
        var n = newType[key];
        re += (+key + 1).toString().padEnd(6) + (c === null || c === void 0 ? void 0 : c.padEnd(20)) + (n === null || n === void 0 ? void 0 : n.padEnd(10)) + "\n";
    }
    re += "".padEnd(6) + "^".repeat(30) + "\n";
    return re;
};
var cache = {};
export var log = function (_a) {
    var fiber = _a.fiber, message = _a.message, _b = _a.level, level = _b === void 0 ? "warn" : _b, _c = _a.triggerOnce, triggerOnce = _c === void 0 ? false : _c;
    var tree = getFiberTree(fiber || currentRunningFiber.current);
    if (triggerOnce) {
        if (cache[tree])
            return;
        cache[tree] = true;
    }
    console[level]("[".concat(level, "]:"), "\n-----------------------------------------\n", "".concat(typeof message === "string" ? message : message.stack || message.message), "\n-----------------------------------------\n", "Render Tree:", tree);
};
export var safeCall = function (action) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    try {
        return action.call.apply(action, __spreadArray([null], args, false));
    }
    catch (e) {
        log({ message: e, level: "error" });
        isAppCrash.current = true;
        throw new Error(e.message);
    }
};
export var safeCallWithFiber = function (_a) {
    var action = _a.action, fiber = _a.fiber;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    try {
        return action.call.apply(action, __spreadArray([null], args, false));
    }
    catch (e) {
        log({ message: e, level: "error", fiber: fiber });
        isAppCrash.current = true;
        throw new Error(e.message);
    }
};
//# sourceMappingURL=debug.js.map