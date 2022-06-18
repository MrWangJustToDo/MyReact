import { pushLayoutEffect } from "../effect.js";
import { safeCallWithFiber } from "../debug.js";
import { nextWorkCommon } from "../core/index.js";
import { MyReactFiberNode, getContextFiber } from "../fiber/index.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentStateFromProps = (fiber) => {
  const Component = fiber.__isDynamicNode__
    ? fiber.__vdom__.type
    : fiber.__vdom__.type.render;

  let newState = null;

  if (typeof Component.getDerivedStateFromProps === "function") {
    newState = Component.getDerivedStateFromProps(
      fiber.__vdom__.props,
      fiber.instance.state
    );
  }

  return newState;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentStateFromPropsOnMountAndUpdate = (fiber) => {
  const newState = processComponentStateFromProps(fiber);

  fiber.instance.__nextState__ = Object.assign(
    {},
    fiber.instance.state,
    fiber.instance.__nextState__,
    newState
  );

  return fiber.instance.__nextState__;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentInstanceRefOnMountAndUpdate = (fiber) => {
  if (fiber.__vdom__.ref) {
    if (typeof fiber.__vdom__.ref === "function") {
      fiber.__vdom__.ref(fiber.instance);
    } else if (typeof fiber.__vdom__.ref === "object") {
      fiber.__vdom__.ref.current = fiber.instance;
    }
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentInstanceOnMount = (fiber) => {
  const Component = fiber.__isDynamicNode__
    ? fiber.__vdom__.type
    : fiber.__vdom__.type.render;
  const providerFiber = getContextFiber(fiber, Component.contextType);
  const context = providerFiber
    ? providerFiber.__vdom__.props.value
    : Component.contextType?.Provider.value;

  const contextValue =
    typeof context === "object" && context !== null
      ? Object.assign({}, context)
      : context;

  const instance = new Component(fiber.__vdom__.props, contextValue);

  instance.props = Object.assign({}, fiber.__vdom__.props);

  // fix context value
  instance.context = contextValue;

  fiber.installInstance(instance);

  fiber.checkInstance(instance);

  fiber.instance.setFiber(fiber);

  fiber.instance.setContext(providerFiber);
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentRenderOnMountAndUpdate = (fiber) => {
  const children = fiber.instance.render();

  fiber.__vdom__.__dynamicChildren__ = children;

  fiber.__renderDynamic__ = true;

  return nextWorkCommon(fiber);
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentDidMountOnMount = (fiber) => {
  if (!fiber.instance.__pendingEffect__ && fiber.instance.componentDidMount) {
    fiber.instance.__pendingEffect__ = true;
    pushLayoutEffect(fiber, () => {
      safeCallWithFiber({
        action: () => fiber.instance.componentDidMount(),
        fiber,
      });

      fiber.instance.__pendingEffect__ = false;
    });
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const classComponentMount = (fiber) => {
  processComponentInstanceOnMount(fiber);
  processComponentInstanceRefOnMountAndUpdate(fiber);
  processComponentStateFromPropsOnMountAndUpdate(fiber);
  fiber.instance.updateInstance(fiber.instance.__nextState__);
  fiber.instance.resetPrevInstanceState();
  fiber.instance.resetNextInstanceState();
  const children = processComponentRenderOnMountAndUpdate(fiber);
  processComponentDidMountOnMount(fiber);
  return children;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentContextOnUpdate = (fiber) => {
  const Component = fiber.__isDynamicNode__
    ? fiber.__vdom__.type
    : fiber.__vdom__.type.render;
  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    const providerFiber = getContextFiber(fiber, Component.contextType);

    const context = providerFiber
      ? providerFiber.__vdom__.props.value
      : Component.contextType?.Provider.value;

    fiber.instance.setContext(providerFiber);

    return typeof context === "object" && context !== null
      ? Object.assign({}, context)
      : context;
  }

  return fiber.instance.context;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentShouldUpdateOnUpdate = (fiber) => {
  if (fiber.instance.__isForce__) {
    fiber.instance.__isForce__ = false;
    return true;
  }
  if (fiber.instance.shouldComponentUpdate) {
    return fiber.instance.shouldComponentUpdate(
      fiber.instance.__nextProps__,
      fiber.instance.__nextState__,
      fiber.instance.__nextContext__
    );
  }
  return true;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const processComponentDidUpdateOnUpdate = (fiber) => {
  const hasEffect =
    fiber.instance.__pendingCallback__.length ||
    fiber.instance.componentDidUpdate;

  if (!fiber.instance.__pendingEffect__ && hasEffect) {
    fiber.instance.__pendingEffect__ = true;
    pushLayoutEffect(fiber, () => {
      safeCallWithFiber({
        action: () => {
          const allCallback = fiber.instance.__pendingCallback__.slice(0);
          fiber.instance.__pendingCallback__ = [];
          allCallback.forEach((c) => typeof c === "function" && c());
          if (fiber.instance.componentDidUpdate) {
            fiber.instance.componentDidUpdate(
              fiber.instance.__prevProps__,
              fiber.instance.__prevState__,
              fiber.instance.__prevContext__
            );
          }
        },
        fiber,
      });
      fiber.instance.resetPrevInstanceState();
      fiber.instance.__pendingEffect__ = false;
    });
  } else {
    fiber.instance.resetPrevInstanceState();
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const classComponentUpdate = (fiber) => {
  fiber.instance.setFiber(fiber);
  const nextState = processComponentStateFromPropsOnMountAndUpdate(fiber);
  const nextProps = Object.assign({}, fiber.__vdom__.props);
  const nextContext = processComponentContextOnUpdate(fiber);
  fiber.instance.__nextState__ = nextState;
  fiber.instance.__nextProps__ = nextProps;
  fiber.instance.__nextContext__ = nextContext;
  const shouldComponentUpdate = processComponentShouldUpdateOnUpdate(fiber);
  fiber.instance.updateInstance(nextState, nextProps, nextContext);
  if (shouldComponentUpdate) {
    fiber.instance.resetNextInstanceState();
    const children = processComponentRenderOnMountAndUpdate(fiber);
    processComponentDidUpdateOnUpdate(fiber);
    return children;
  } else {
    fiber.instance.resetPrevInstanceState();
    fiber.instance.resetNextInstanceState();
    fiber.memoChildren();
    return [];
  }
};

export { classComponentMount, classComponentUpdate };
