import { nextWorkCommon } from "./core.js";
import { pushLayoutEffect } from "./effect.js";
import { enableAllCheck, isHydrate, isServerRender } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactInstance } from "./share.js";
import { isNormalEqual } from "./tools.js";

const COMPONENT_LIFE_CIRCLE_KEY = [
  "shouldComponentUpdate",
  "componentDidMount",
  "componentDidUpdate",
  "componentWillUnmount",
];

class MyReactComponentInternalInstance extends MyReactInstance {
  // ============ diff state =================
  props;

  context;

  __prevProps__ = null;

  __nextProps__ = null;

  __prevContext__ = null;

  __nextContext__ = null;

  __prevState__ = null;

  __nextState__ = null;

  __pendingCallback__ = [];

  __pendingEffect__ = false;

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
    this.__fiber__.memoProps = this.props;
    this.__fiber__.memoState = this.state;
    this.resetNextInstanceState();
  }

  resetPrevInstanceState() {
    this.__prevState__ = null;
    this.__prevProps__ = null;
    this.__prevContext__ = null;
  }

  resetNextInstanceState() {
    this.__nextProps__ = null;
    this.__nextState__ = null;
    this.__nextContext__ = null;
  }

  // ============== valid check ===============
  _checkComponentLifeCircleType() {
    if (enableAllCheck.current) {
      COMPONENT_LIFE_CIRCLE_KEY.forEach((key) => {
        if (this[key] !== undefined && typeof this[key] !== "function") {
          throw new Error("Component lifeCircle function type error");
        }
      });
    }
  }
}

class MyReactComponent extends MyReactComponentInternalInstance {
  constructor(props, context) {
    super();
    this.props = props;
    this.context = context;
    this._checkComponentLifeCircleType();
  }

  get isMyReactComponent() {
    return true;
  }

  setState = (newValue, callback) => {
    let newState = newValue;
    if (typeof newValue === "function") {
      newState = newValue(this.state);
    }
    this.__nextState__ = Object.assign({}, this.__nextState__, newState);
    callback && this.__pendingCallback__.push(callback);
    this.forceUpdate();
  };

  forceUpdate = () => {
    if (isServerRender.current)
      throw new Error("can not update component during server side rendering");
    if (isHydrate.current)
      throw new Error("can not update component during hydrate rendering");
    Promise.resolve().then(() => this.__fiber__.update());
  };
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
function processComponentInstanceRef(fiber) {
  if (fiber.__vdom__.ref) {
    if (typeof fiber.__vdom__.ref === "function") {
      fiber.__vdom__.ref(fiber.instance);
    } else if (typeof fiber.__vdom__.ref === "object") {
      fiber.__vdom__.ref.current = fiber.instance;
    }
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processComponentInstanceLifeCircle(fiber) {
  const Component = fiber.__vdom__.type;
  const providerFiber = Component.getContextFiber(fiber, Component.contextType);
  const context = providerFiber
    ? providerFiber.__vdom__.props.value
    : Component.contextType?.Provider.value;
  const instance = new Component(fiber.__vdom__.props, context);
  instance.context = context;
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
  if (!fiber.instance.__pendingEffect__ && fiber.instance.componentDidMount) {
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
  processComponentInstanceRef(fiber);
  processStateFromPropsMountLifeCircle(fiber);
  fiber.instance.resetPrevInstanceState();
  const children = processComponentRenderLifeCircle(fiber);
  // disable DidMount during SSR
  !isServerRender.current && processComponentDidMountLiftCircle(fiber);
  return children;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processComponentContextUpdate(fiber) {
  const Component = fiber.__vdom__.type;
  // context 更新过
  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    const providerFiber = fiber.instance.processContext(Component.contextType);
    return providerFiber
      ? providerFiber.__vdom__.props.value
      : Component.contextType?.Provider.value;
  }
  return fiber.instance.context;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function processShouldComponentUpdateLifeCircle(fiber) {
  if (fiber.instance.shouldComponentUpdate) {
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
  const hasUpdateLifeCircle =
    fiber.instance.__pendingCallback__.length ||
    fiber.instance.componentDidUpdate;
  if (!fiber.instance.__pendingEffect__ && hasUpdateLifeCircle) {
    fiber.instance.__pendingEffect__ = true;
    pushLayoutEffect(fiber, () => {
      const allCallback = fiber.instance.__pendingCallback__.slice(0);
      fiber.instance.__pendingCallback__ = [];
      allCallback.forEach((c) => c());
      if (fiber.instance.componentDidUpdate) {
        fiber.instance.componentDidUpdate(
          fiber.instance.__prevProps__,
          fiber.instance.__prevState__,
          fiber.instance.__prevContext__
        );
      }
      fiber.instance.resetPrevInstanceState();
      fiber.instance.__pendingEffect__ = false;
    });
  } else {
    fiber.instance.resetPrevInstanceState();
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function classComponentUpdate(fiber) {
  if (isServerRender.current)
    throw new Error("can not update component during SSR");
  if (isHydrate.current)
    throw new Error("can not update component during hydrate");
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
    fiber.instance.resetPrevInstanceState();
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
