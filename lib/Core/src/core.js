import { classComponentMount, classComponentUpdate } from "./component.js";
import {
  getMatchedRenderChildren,
  getNewFiberWithInitial,
  getNewFiberWithUpdate,
} from "./coreTool.js";
import {
  currentFunctionFiber,
  currentRunningFiber,
  currentHookDeepIndex,
  isMounted,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactVDom } from "./vdom.js";

/**
 *
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactVDom[]} children
 */
function transformChildrenFiber(parentFiber, _children) {
  let index = 0;

  const isNewChildren = !Boolean(parentFiber.fiberAlternate);

  const children = Array.isArray(_children) ? _children : [_children];

  const previousRenderChildren =
    parentFiber.fiberAlternate?.__renderedChildren__ || [];

  const assignPreviousRenderChildren = getMatchedRenderChildren(
    children,
    previousRenderChildren
  );

  parentFiber.reset();

  while (index < children.length || index < previousRenderChildren.length) {
    const newChild = children[index];

    const previousRenderChild = previousRenderChildren[index];

    const assignPreviousRenderChild = assignPreviousRenderChildren[index];

    const newFiber = isNewChildren
      ? getNewFiberWithInitial(newChild, parentFiber)
      : getNewFiberWithUpdate(
          newChild,
          parentFiber,
          previousRenderChild,
          assignPreviousRenderChild
        );

    parentFiber.__renderedChildren__.push(newFiber);

    index++;
  }

  return parentFiber.children;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkFunctionComponent(fiber) {
  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = fiber.__vdom__.type(fiber.__vdom__.props);

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = null;

  fiber.__vdom__.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkClassComponent(fiber) {
  if (!fiber.instance) {
    return classComponentMount(fiber);
  } else {
    return classComponentUpdate(fiber);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkComponent(fiber) {
  if (fiber.initial || fiber.__needUpdate__) {
    if (fiber.__isFunctionComponent__) {
      return nextWorkFunctionComponent(fiber);
    } else {
      return nextWorkClassComponent(fiber);
    }
  }
  return [];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkCommon(fiber) {
  if (fiber.__vdom__.__dynamicChildren__ !== null) {
    return transformChildrenFiber(fiber, fiber.__vdom__.__dynamicChildren__);
  }

  if (fiber.__vdom__.children !== undefined) {
    return transformChildrenFiber(fiber, fiber.__vdom__.children);
  }
  return [];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkForwardRef(fiber) {
  const { render } = fiber.__vdom__.type;

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = render(fiber.__vdom__.props, fiber.__vdom__.ref);

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = null;

  fiber.__vdom__.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkProvider(fiber) {
  // maybe need other way to get provider state
  // Provider 不存在needUpdate的状态
  if (isMounted.current && fiber.initial) {
    const listenerFibers = fiber.listeners.map((it) => it.__fiber__);
    // update only alive fiber
    Promise.resolve().then(() =>
      listenerFibers.filter((f) => f.mount).forEach((f) => f.update())
    );
  }
  // improve, need unmount ...
  fiber.__vdom__.type.Context.__context__ = fiber;

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkConsumer(fiber) {
  fiber.instance = fiber.instance || new fiber.__vdom__.type.Internal();

  fiber.instance.updateDependence(fiber);

  const Component = fiber.__vdom__.type;

  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    const providerFiber = fiber.instance.processContext(Component.Context);

    const context =
      providerFiber?.__vdom__.props.value || Component.Context.Provider.value;

    fiber.instance.context = context;
  }

  fiber.__vdom__.__dynamicChildren__ = fiber.__vdom__.children(
    fiber.instance.context
  );

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkMemo(fiber) {
  // 对于memo组件，只有当前fiber需要运行时才运行
  if (fiber.initial || fiber.__needUpdate__) {
    const { render: _render, isMyReactForwardRefRender } = fiber.__vdom__.type;

    const render = isMyReactForwardRefRender ? _render.render : _render;

    const isClassComponent = render.prototype?.isMyReactComponent;

    if (isClassComponent) {
      throw new Error(
        "not support memo(class) render, maybe need improve later, this error just a bug for MyReact"
      );
    } else {
      currentHookDeepIndex.current = 0;

      currentFunctionFiber.current = fiber;

      const children = isMyReactForwardRefRender
        ? render(fiber.__vdom__.props, fiber.__vdom__.ref)
        : render(fiber.__vdom__.props);

      currentHookDeepIndex.current = 0;

      currentFunctionFiber.current = null;

      fiber.__vdom__.__dynamicChildren__ = children;

      return nextWorkCommon(fiber);
    }
  } else {
    return [];
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkObject(fiber) {
  if (fiber.__isMemo__) return nextWorkMemo(fiber);
  if (fiber.__isPortal__) return nextWorkCommon(fiber);
  if (fiber.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.__isContextProvider__) return nextWorkProvider(fiber);
  if (fiber.__isContextConsumer__) return nextWorkConsumer(fiber);
  throw new Error("unknown element");
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWork(fiber) {
  // maybe need warning for this
  if (!fiber.mount) return [];

  currentRunningFiber.current = fiber;

  let children = [];

  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);
  else if (!fiber.__isTextNode__) children = nextWorkCommon(fiber);

  currentRunningFiber.current = null;

  fiber.updated();

  return children;
}

export { nextWork, nextWorkCommon };
