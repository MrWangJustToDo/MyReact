import { classComponentMount, classComponentUpdate } from "../component";
import { createElement } from "../element";
import { getContextFiber, getContextValue, processHookUpdateQueue } from "../fiber";
import { isServerRender, currentRunningFiber, currentHookDeepIndex, currentFunctionFiber } from "../share";
import { transformChildrenFiber } from "./generate";
export const nextWorkCommon = (fiber) => {
    if (fiber.__isRenderDynamic__) {
        return transformChildrenFiber(fiber, fiber.__dynamicChildren__);
    }
    else {
        return transformChildrenFiber(fiber, fiber.__children__);
    }
};
const nextWorkClassComponent = (fiber) => {
    if (!fiber.instance) {
        return classComponentMount(fiber);
    }
    else {
        return classComponentUpdate(fiber);
    }
};
const nextWorkFunctionComponent = (fiber) => {
    processHookUpdateQueue(fiber);
    currentHookDeepIndex.current = 0;
    currentFunctionFiber.current = fiber;
    const typedElement = fiber.element;
    const children = typedElement.type(fiber.__props__);
    currentFunctionFiber.current = null;
    currentHookDeepIndex.current = 0;
    fiber.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
};
const nextWorkComponent = (fiber) => {
    if (fiber.__isFunctionComponent__) {
        return nextWorkFunctionComponent(fiber);
    }
    else {
        return nextWorkClassComponent(fiber);
    }
};
const nextWorkMemo = (fiber) => {
    const { type, ref } = fiber.element;
    const typedType = type;
    const render = typedType.render;
    let isForwardRefRender = false;
    const targetRender = typeof render === "object" ? ((isForwardRefRender = true), render.render) : render;
    const isClassComponent = targetRender?.prototype?.isMyReactComponent;
    if (isClassComponent) {
        return nextWorkClassComponent(fiber);
    }
    else {
        processHookUpdateQueue(fiber);
        currentHookDeepIndex.current = 0;
        currentFunctionFiber.current = fiber;
        const typedRender = targetRender;
        const children = isForwardRefRender ? typedRender(fiber.__props__, ref) : typedRender(fiber.__props__);
        currentFunctionFiber.current = null;
        currentHookDeepIndex.current = 0;
        fiber.__dynamicChildren__ = children;
        return nextWorkCommon(fiber);
    }
};
const nextWorkLazy = (fiber) => {
    const { type } = fiber.element;
    const typedType = type;
    if (typedType._loaded === true) {
        const render = typedType.render;
        fiber.__dynamicChildren__ = createElement(render, fiber.__props__);
        return nextWorkCommon(fiber);
    }
    else if (typedType._loading === false) {
        if (!isServerRender.current) {
            typedType._loading = true;
            Promise.resolve()
                .then(() => typedType.loader())
                .then((re) => {
                const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;
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
const nextWorkForwardRef = (fiber) => {
    processHookUpdateQueue(fiber);
    const { type, ref } = fiber.element;
    const typedType = type;
    const typedRender = typedType.render;
    currentHookDeepIndex.current = 0;
    currentFunctionFiber.current = fiber;
    const children = typedRender(fiber.__props__, ref);
    currentFunctionFiber.current = null;
    currentHookDeepIndex.current = 0;
    fiber.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
};
const nextWorkProvider = (fiber) => nextWorkCommon(fiber);
const nextWorkConsumer = (fiber) => {
    const { type, props } = fiber.element;
    const typedType = type;
    fiber.instance = fiber.instance || new typedType.Internal();
    fiber.instance.setFiber(fiber);
    const Context = typedType.Context;
    if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
        const ProviderFiber = getContextFiber(fiber, Context);
        const context = getContextValue(ProviderFiber, Context);
        fiber.instance.context = context;
        fiber.instance.setContext(ProviderFiber);
    }
    else {
        const context = getContextValue(fiber.instance.__context__, Context);
        fiber.instance.context = context;
    }
    const typedChildren = props.children;
    const children = typedChildren(fiber.instance.context);
    fiber.__dynamicChildren__ = children;
    return nextWorkCommon(fiber);
};
const nextWorkObject = (fiber) => {
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
    throw new Error(`unknown element ${fiber.element}`);
};
export const nextWorkSync = (fiber) => {
    if (!fiber.mount)
        return [];
    if (!fiber.__needUpdate__ && !fiber.__needTrigger__)
        return [];
    currentRunningFiber.current = fiber;
    let children = [];
    if (fiber.__isDynamicNode__)
        children = nextWorkComponent(fiber);
    else if (fiber.__isObjectNode__)
        children = nextWorkObject(fiber);
    else
        children = nextWorkCommon(fiber);
    currentRunningFiber.current = null;
    return children;
};
export const nextWorkAsync = (fiber, topLevelFiber) => {
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
    let nextFiber = fiber;
    while (nextFiber && nextFiber !== topLevelFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
    return null;
};
//# sourceMappingURL=invoke.js.map