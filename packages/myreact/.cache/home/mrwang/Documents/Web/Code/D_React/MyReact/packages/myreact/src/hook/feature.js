import { __spreadArray } from "tslib";
import { createRef, currentFunctionFiber, currentHookDeepIndex, enableDebugLog, getFiberTree } from "../share";
import { getHookNode } from "./create";
export var useState = function (initial) {
    var currentHookNode = getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useState",
        value: typeof initial === "function" ? initial : function () { return initial; },
        reducer: null,
        deps: [],
    }, currentFunctionFiber.current);
    return [currentHookNode.result, currentHookNode.dispatch];
};
export var useEffect = function (action, deps) {
    getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useEffect",
        value: action,
        reducer: null,
        deps: deps,
    }, currentFunctionFiber.current);
};
export var useLayoutEffect = function (action, deps) {
    getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useLayoutEffect",
        value: action,
        reducer: null,
        deps: deps,
    }, currentFunctionFiber.current);
};
export var useCallback = function (callback, deps) {
    return getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useCallback",
        value: callback,
        reducer: null,
        deps: deps,
    }, currentFunctionFiber.current).result;
};
export var useMemo = function (action, deps) {
    return getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useMemo",
        value: action,
        reducer: null,
        deps: deps,
    }, currentFunctionFiber.current).result;
};
export var useRef = function (value) {
    return getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useRef",
        value: createRef(value),
        reducer: null,
        deps: [],
    }, currentFunctionFiber.current).result;
};
export var useContext = function (Context) {
    return getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useContext",
        value: Context,
        reducer: null,
        deps: [],
    }, currentFunctionFiber.current).result;
};
export var useReducer = function (reducer, initialArgs, init) {
    var currentHookNode = getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useReducer",
        value: typeof init === "function" ? function () { return init(initialArgs); } : function () { return initialArgs; },
        reducer: reducer,
        deps: [],
    }, currentFunctionFiber.current);
    return [currentHookNode.result, currentHookNode.dispatch];
};
export var useImperativeHandle = function (ref, createHandle, deps) {
    getHookNode({
        hookIndex: currentHookDeepIndex.current++,
        hookType: "useImperativeHandle",
        value: ref,
        reducer: createHandle,
        deps: deps,
    }, currentFunctionFiber.current);
};
export var useDebugValue = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (enableDebugLog.current) {
        console.log.apply(console, __spreadArray(__spreadArray(["[debug]: "], args, false), [getFiberTree(currentFunctionFiber.current)], false));
    }
};
//# sourceMappingURL=feature.js.map