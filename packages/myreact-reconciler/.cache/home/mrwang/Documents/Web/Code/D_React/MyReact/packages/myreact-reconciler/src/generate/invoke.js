import { createElement, __myreact_internal__, __myreact_shared__ } from "@my-react/react";
import { classComponentMount, classComponentUpdate } from "../component";
import { processHookUpdateQueue } from "../queue";
import { transformChildrenFiber } from "./generate";
var currentHookDeepIndex = __myreact_internal__.currentHookDeepIndex, currentFunctionFiber = __myreact_internal__.currentFunctionFiber, currentRunningFiber = __myreact_internal__.currentRunningFiber, globalDispatch = __myreact_internal__.globalDispatch;
var getContextFiber = __myreact_shared__.getContextFiber, getContextValue = __myreact_shared__.getContextValue;
export var nextWorkCommon = function (fiber) {
    if (fiber.__isRenderDynamic__) {
        return transformChildrenFiber(fiber, fiber.__dynamicChildren__);
    }
    else {
        return transformChildrenFiber(fiber, fiber.__children__);
    }
};
var nextWorkClassComponent = function (fiber) {
    if (!fiber.instance) {
        return classComponentMount(fiber);
    }
    else {
        return classComponentUpdate(fiber);
    }
};
var nextWorkFunctionComponent = function (fiber) {
    processHookUpdateQueue(fiber);
    currentHookDeepIndex.current = 0;
    currentFunctionFiber.current = fiber;
    var typedElement = fiber.element;
    var children = typedElement.type(fiber.__props__);
    currentFunctionFiber.current = null;
    currentHookDeepIndex.current = 0;
    fiber.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
};
var nextWorkComponent = function (fiber) {
    if (fiber.__isFunctionComponent__) {
        return nextWorkFunctionComponent(fiber);
    }
    else {
        return nextWorkClassComponent(fiber);
    }
};
var nextWorkMemo = function (fiber) {
    var _a;
    var _b = fiber.element, type = _b.type, ref = _b.ref;
    var typedType = type;
    var render = typedType.render;
    var isForwardRefRender = false;
    var targetRender = typeof render === "object" ? ((isForwardRefRender = true), render.render) : render;
    var isClassComponent = (_a = targetRender === null || targetRender === void 0 ? void 0 : targetRender.prototype) === null || _a === void 0 ? void 0 : _a.isMyReactComponent;
    if (isClassComponent) {
        return nextWorkClassComponent(fiber);
    }
    else {
        processHookUpdateQueue(fiber);
        currentHookDeepIndex.current = 0;
        currentFunctionFiber.current = fiber;
        var typedRender = targetRender;
        var children = isForwardRefRender ? typedRender(fiber.__props__, ref) : typedRender(fiber.__props__);
        currentFunctionFiber.current = null;
        currentHookDeepIndex.current = 0;
        fiber.__dynamicChildren__ = children;
        return nextWorkCommon(fiber);
    }
};
var nextWorkLazy = function (fiber) {
    var type = fiber.element.type;
    var typedType = type;
    if (typedType._loaded === true) {
        var render = typedType.render;
        fiber.__dynamicChildren__ = createElement(render, fiber.__props__);
        return nextWorkCommon(fiber);
    }
    else if (typedType._loading === false) {
        if (globalDispatch.current.resolveLazy()) {
            typedType._loading = true;
            Promise.resolve()
                .then(function () { return typedType.loader(); })
                .then(function (re) {
                var render = typeof re === "object" && typeof (re === null || re === void 0 ? void 0 : re.default) === "function" ? re.default : re;
                typedType._loaded = true;
                typedType._loading = false;
                typedType.render = render;
                fiber.update();
            });
        }
    }
    fiber.__dynamicChildren__ = fiber.__fallback__;
    return nextWorkCommon(fiber);
};
var nextWorkForwardRef = function (fiber) {
    processHookUpdateQueue(fiber);
    var _a = fiber.element, type = _a.type, ref = _a.ref;
    var typedType = type;
    var typedRender = typedType.render;
    currentHookDeepIndex.current = 0;
    currentFunctionFiber.current = fiber;
    var children = typedRender(fiber.__props__, ref);
    currentFunctionFiber.current = null;
    currentHookDeepIndex.current = 0;
    fiber.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
};
var nextWorkProvider = function (fiber) { return nextWorkCommon(fiber); };
var nextWorkConsumer = function (fiber) {
    var _a = fiber.element, type = _a.type, props = _a.props;
    var typedType = type;
    fiber.instance = fiber.instance || new typedType.Internal();
    fiber.instance.setFiber(fiber);
    var Context = typedType.Context;
    if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
        var ProviderFiber = getContextFiber(fiber, Context);
        var context = getContextValue(ProviderFiber, Context);
        fiber.instance.context = context;
        fiber.instance.setContext(ProviderFiber);
    }
    else {
        var context = getContextValue(fiber.instance.__context__, Context);
        fiber.instance.context = context;
    }
    var typedChildren = props.children;
    var children = typedChildren(fiber.instance.context);
    fiber.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
};
var nextWorkObject = function (fiber) {
    if (fiber.__isMemo__)
        return nextWorkMemo(fiber);
    if (fiber.__isLazy__)
        return nextWorkLazy(fiber);
    if (fiber.__isPortal__)
        return nextWorkCommon(fiber);
    if (fiber.__isSuspense__)
        return nextWorkCommon(fiber);
    if (fiber.__isForwardRef__)
        return nextWorkForwardRef(fiber);
    if (fiber.__isContextProvider__)
        return nextWorkProvider(fiber);
    if (fiber.__isContextConsumer__)
        return nextWorkConsumer(fiber);
    throw new Error("unknown element ".concat(fiber.element));
};
export var nextWorkSync = function (fiber) {
    if (!fiber.mount)
        return [];
    if (!fiber.__needUpdate__ && !fiber.__needTrigger__)
        return [];
    currentRunningFiber.current = fiber;
    var children = [];
    if (fiber.__isDynamicNode__)
        children = nextWorkComponent(fiber);
    else if (fiber.__isObjectNode__)
        children = nextWorkObject(fiber);
    else
        children = nextWorkCommon(fiber);
    currentRunningFiber.current = null;
    return children;
};
export var nextWorkAsync = function (fiber, topLevelFiber) {
    if (!fiber.mount)
        return null;
    if (fiber.__needUpdate__ || fiber.__needTrigger__) {
        currentRunningFiber.current = fiber;
        if (fiber.__isDynamicNode__)
            nextWorkComponent(fiber);
        else if (fiber.__isObjectNode__)
            nextWorkObject(fiber);
        else
            nextWorkCommon(fiber);
        currentRunningFiber.current = null;
        if (fiber.children.length) {
            return fiber.child;
        }
    }
    var nextFiber = fiber;
    while (nextFiber && nextFiber !== topLevelFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
    return null;
};
//# sourceMappingURL=invoke.js.map