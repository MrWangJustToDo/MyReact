import {
  classComponentMount,
  classComponentUpdate,
} from "../component/index.js";
import {
  currentFunctionFiber,
  currentHookDeepIndex,
  currentRunningFiber,
  isMounted,
} from "../env.js";
import { transformChildrenFiber } from "./tool.js";
import { MyReactFiberNode, getContextFiber } from "../fiber/index.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkCommon = (fiber) => {
  if (fiber.__renderDynamic__) {
    return transformChildrenFiber(fiber, fiber.__vdom__.__dynamicChildren__);
  } else {
    return transformChildrenFiber(fiber, fiber.__vdom__.children);
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkClassComponent = (fiber) => {
  if (!fiber.instance) {
    return classComponentMount(fiber);
  } else {
    return classComponentUpdate(fiber);
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkFunctionComponent = (fiber) => {
  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = fiber.__vdom__.type(fiber.__vdom__.props);

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = null;

  fiber.__vdom__.__dynamicChildren__ = children;

  fiber.__renderDynamic__ = true;

  return nextWorkCommon(fiber);
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkComponent = (fiber) => {
  if (fiber.initial || fiber.__needUpdate__) {
    if (fiber.__isFunctionComponent__) {
      return nextWorkFunctionComponent(fiber);
    } else {
      return nextWorkClassComponent(fiber);
    }
  }
  return [];
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkMemo = (fiber) => {
  if (fiber.initial || fiber.__needUpdate__) {
    const { render: _render, isMyReactForwardRefRender } = fiber.__vdom__.type;

    const render = isMyReactForwardRefRender ? _render.render : _render;

    const isClassComponent = render.prototype?.isMyReactComponent;

    if (isClassComponent) {
      return nextWorkClassComponent(fiber);
    } else {
      currentHookDeepIndex.current = 0;

      currentFunctionFiber.current = fiber;

      const children = isMyReactForwardRefRender
        ? render(fiber.__vdom__.props, fiber.__vdom__.ref)
        : render(fiber.__vdom__.props);

      currentHookDeepIndex.current = 0;

      currentFunctionFiber.current = null;

      fiber.__vdom__.__dynamicChildren__ = children;

      fiber.__renderDynamic__ = true;

      return nextWorkCommon(fiber);
    }
  } else {
    return [];
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkForwardRef = (fiber) => {
  const { render } = fiber.__vdom__.type;

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = render(fiber.__vdom__.props, fiber.__vdom__.ref);

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = null;

  fiber.__vdom__.__dynamicChildren__ = children;

  fiber.__renderDynamic__ = true;

  return nextWorkCommon(fiber);
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkProvider = (fiber) => {
  // maybe need other way to get provider state
  if (isMounted.current && fiber.initial) {
    const listenerFibers = fiber.__dependence__.map((node) => node.__fiber__);
    // update only alive fiber
    Promise.resolve().then(() => {
      const aliveListenerFibers = listenerFibers.filter((f) => f.mount);
      aliveListenerFibers.forEach((f) => f.update());
    });
  }

  return nextWorkCommon(fiber);
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkConsumer = (fiber) => {
  fiber.instance = fiber.instance || new fiber.__vdom__.type.Internal();

  fiber.instance.setFiber(fiber);

  const Component = fiber.__vdom__.type;

  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    const providerFiber = getContextFiber(fiber, Component.Context);

    const context =
      providerFiber?.__vdom__.props.value || Component.Context.Provider.value;

    fiber.instance.context = context;

    fiber.instance.setContext(providerFiber);
  }

  fiber.__vdom__.__dynamicChildren__ = fiber.__vdom__.children(
    fiber.instance.context
  );

  fiber.__renderDynamic__ = true;

  return nextWorkCommon(fiber);
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWorkObject = (fiber) => {
  if (fiber.__isMemo__) return nextWorkMemo(fiber);
  if (fiber.__isPortal__) return nextWorkCommon(fiber);
  if (fiber.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.__isContextProvider__) return nextWorkProvider(fiber);
  if (fiber.__isContextConsumer__) return nextWorkConsumer(fiber);
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const nextWork = (fiber) => {
  if (!fiber.mount) return [];

  currentRunningFiber.current = fiber;

  let children = [];

  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);
  else if (!fiber.__isTextNode__) children = nextWorkCommon(fiber);

  fiber.afterTransform();

  currentRunningFiber.current = null;

  return children;
};

export { nextWork, nextWorkCommon };
