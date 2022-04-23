import { nextWorkCommon } from "./core.js";
import { pushLayoutEffect } from "./effect.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactInstance } from "./share.js";
import { getContextFiber, isNormalEqual } from "./tools.js";

class MyReactComponent extends MyReactInstance {
  constructor(props, context) {
    super();
    this.props = props;
    this.context = context;
  }

  __prevProps__ = null;

  __nextProps__ = null;

  __prevContext__ = null;

  __nextContext__ = null;

  __prevState__ = null;

  __nextState__ = null;

  __pendingEffect__ = false;

  get isMyReactComponent() {
    return true;
  }

  setState = (newValue) => {
    let newState = newValue;
    if (typeof newValue === "function") {
      newState = newValue(this.state);
    }
    this.__nextState__ = newState;
    if (!Object.is(this.state, this.__nextState__)) {
      this.forceUpdate();
    }
  };

  forceUpdate = () => {
    Promise.resolve().then(() => this.__fiber__.update());
  };

  updateInstance(newState, newProps, newContext) {
    if (newProps) {
      this.__prevProps__ = this.props;
      this.props = newProps;
    }
    if (newState) {
      this.__prevState__ = this.state;
      this.state = newState;
    }
    if (newContext) {
      this.__prevContext__ = this.context;
      this.context = newContext;
    }
    this.__nextProps__ = null;
    this.__nextState__ = null;
    this.__nextContext__ = null;
    this.__fiber__.memoProps = this.props;
    this.__fiber__.memoState = this.state;
  }
}

class MyReactPureComponent extends MyReactComponent {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !isNormalEqual(this.props, nextProps) ||
      !isNormalEqual(this.state, nextState) ||
      !isNormalEqual(this.context, nextContext)
    );
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processStateFromProps(fiber) {
  const Component = fiber.__vdom__.type;
  let newState = null;
  if (typeof Component.getDerivedStateFromProps === "function") {
    newState = Component.getDerivedStateFromProps(
      fiber.__vdom__.props,
      fiber.instance.state
    );
  }

  return newState;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processStateFromPropsMountLifeCircle(fiber) {
  const newState = processStateFromProps(fiber);
  fiber.instance.updateInstance(
    Object.assign(
      {},
      fiber.instance.state,
      newState,
      fiber.instance.__nextState__
    )
  );
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processStateFromPropsUpdateLiftCircle(fiber) {
  const newState = processStateFromProps(fiber);
  return Object.assign(
    {},
    fiber.instance.state,
    newState,
    fiber.instance.__nextState__
  );
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processComponentInstanceLifeCircle(fiber) {
  const Component = fiber.__vdom__.type;
  const providerFiber = getContextFiber(fiber, Component.contextType);
  const instance = new Component(
    fiber.__vdom__.props,
    providerFiber?.__vdom__.props.value
  );
  fiber.installInstance(instance);
  instance.updateDependence(fiber, providerFiber);
  providerFiber?.addListener(instance);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processComponentRenderLifeCircle(fiber) {
  const children = fiber.instance.render();

  fiber.__vdom__.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processComponentDidMountLiftCircle(fiber) {
  if (
    !fiber.instance.__pendingEffect__ &&
    typeof fiber.instance.componentDidMount === "function"
  ) {
    fiber.instance.__pendingEffect__ = true;
    pushLayoutEffect(fiber, () => {
      fiber.instance.componentDidMount();
      fiber.instance.__pendingEffect__ = false;
    });
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function classComponentMount(fiber) {
  processComponentInstanceLifeCircle(fiber);
  processStateFromPropsMountLifeCircle(fiber);
  const children = processComponentRenderLifeCircle(fiber);
  processComponentDidMountLiftCircle(fiber);
  return children;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processComponentContextUpdate(fiber) {
  if (fiber.instance.__context__ && !fiber.instance.__context__.mount) {
    const providerFiber = fiber.instance.processContext(
      fiber.__vdom__.type.contextType
    );
    return providerFiber.__vdom__.props.value;
  }
  return fiber.instance.context;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processShouldComponentUpdateLifeCircle(fiber) {
  if (typeof fiber.instance.shouldComponentUpdate === "function") {
    return fiber.instance.shouldComponentUpdate(
      fiber.instance.__nextProps__,
      fiber.instance.__nextState__,
      fiber.instance.__nextContext__
    );
  }
  return true;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processComponentDidUpdateLiftCircle(fiber) {
  if (
    !fiber.instance.__pendingEffect__ &&
    typeof fiber.instance.componentDidUpdate === "function"
  ) {
    fiber.instance.__pendingEffect__ = true;
    pushLayoutEffect(fiber, () => {
      fiber.instance.componentDidUpdate(
        fiber.instance.__prevProps__,
        fiber.instance.__prevState__,
        fiber.instance.__prevContext__
      );
      fiber.instance.__prevProps__ = null;
      fiber.instance.__prevState__ = null;
      fiber.instance.__prevContext__ = null;
      fiber.instance.__pendingEffect__ = false;
    });
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function classComponentUpdate(fiber) {
  fiber.instance.updateDependence(fiber);
  const newState = processStateFromPropsUpdateLiftCircle(fiber);
  const newProps = fiber.__vdom__.props;
  const newContext = processComponentContextUpdate(fiber);
  fiber.instance.__nextState__ = newState;
  fiber.instance.__nextProps__ = newProps;
  fiber.instance.__nextContext__ = newContext;
  const shouldUpdate = processShouldComponentUpdateLifeCircle(fiber);
  fiber.instance.updateInstance(newState, newProps, newContext);
  if (shouldUpdate) {
    const children = processComponentRenderLifeCircle(fiber);
    processComponentDidUpdateLiftCircle(fiber);
    return children;
  } else {
    fiber.stopUpdate();
    return [];
  }
}

export {
  MyReactComponent,
  MyReactPureComponent,
  classComponentMount,
  classComponentUpdate,
};
