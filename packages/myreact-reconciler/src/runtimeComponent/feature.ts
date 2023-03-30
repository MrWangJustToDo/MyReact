import { __my_react_shared__ } from "@my-react/react";
import { Effect_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { safeCallWithFiber } from "../share";

import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactComponent, MixinMyReactClassComponent } from "@my-react/react";

const { enableLegacyLifeCycle, enableStrictLifeCycle } = __my_react_shared__;

const processComponentStateFromProps = (fiber: MyReactFiberNode, devInstance?: MyReactComponent | null) => {
  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const typedInstance = fiber.instance as MyReactComponent;

  const pendingProps = Object.assign({}, fiber.pendingProps);
  const currentState = Object.assign({}, typedInstance.state);

  if (typedComponent.getDerivedStateFromProps) {
    const payloadState = typedComponent.getDerivedStateFromProps?.(pendingProps, currentState);
    if (payloadState) {
      typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
    }
  }

  if (devInstance) {
    const typedDevInstance = devInstance as MyReactComponent;

    const pendingProps = Object.assign({}, fiber.pendingProps);
    const currentState = Object.assign({}, typedInstance.state);

    if (typedComponent.getDerivedStateFromProps) {
      const payloadState = typedComponent.getDerivedStateFromProps?.(pendingProps, currentState);
      if (payloadState) {
        typedDevInstance.state = Object.assign({}, typedInstance.state, payloadState);
      }
    }
  }
};

const processComponentStateFromError = (fiber: MyReactFiberNode, error: Error) => {
  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const typedInstance = fiber.instance as MyReactComponent;

  if (typedComponent.getDerivedStateFromError) {
    const payloadState = typedComponent.getDerivedStateFromError?.(error);
    if (payloadState) {
      typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
    }
  }
};

const processComponentInstanceOnMount = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.container.renderDispatch;

  const ReactNewStrictMod = __DEV__ ? renderDispatch.resolveStrict(fiber) && enableStrictLifeCycle.current : false;

  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const ProviderFiber = renderDispatch.resolveContextFiber(fiber, typedComponent.contextType);

  const context = renderDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);

  const props = Object.assign({}, fiber.pendingProps);

  const instance = new typedComponent(props, context);

  instance.props = props;

  instance.context = context;

  fiber.instance = instance;

  instance._setOwner(fiber);

  instance._setContext(ProviderFiber);

  let devInstance: null | MyReactComponent = null;

  if (ReactNewStrictMod) {
    const props = Object.assign({}, fiber.pendingProps);

    devInstance = new typedComponent(props, context);

    devInstance.props = props;

    devInstance.context = context;
  }

  return devInstance;
};

const processComponentFiberOnUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;
  typedInstance._setOwner(fiber);
};

const processComponentRenderOnMountAndUpdate = (fiber: MyReactFiberNode, devInstance?: MyReactComponent | null) => {
  const typedInstance = fiber.instance as MyReactComponent;

  if (devInstance) {
    try {
      devInstance.render();
    } catch (e) {
      void 0;
    }
  }

  const children = safeCallWithFiber({ fiber, action: () => typedInstance.render() });

  return children;
};

const processComponentDidMountOnMount = (fiber: MyReactFiberNode, devInstance?: MyReactComponent | null) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderDispatch = fiber.container.renderDispatch;

  if (devInstance) {
    if ((typedInstance.componentDidMount || typedInstance.componentWillUnmount) && !(typedInstance.mode & Effect_TYPE.__effect__)) {
      typedInstance.mode = Effect_TYPE.__effect__;
      renderDispatch.pendingLayoutEffect(fiber, () => {
        typedInstance.mode = Effect_TYPE.__initial__;
        typedInstance.componentDidMount?.();
        typedInstance.componentWillUnmount?.();
        typedInstance.componentDidMount?.();
      });
    }
  } else {
    if (typedInstance.componentDidMount && !(typedInstance.mode & Effect_TYPE.__effect__)) {
      typedInstance.mode = Effect_TYPE.__effect__;
      renderDispatch.pendingLayoutEffect(fiber, () => {
        typedInstance.mode = Effect_TYPE.__initial__;
        typedInstance.componentDidMount?.();
      });
    }
  }
};

const processComponentDidCatchOnMountAndUpdate = (fiber: MyReactFiberNode, error: Error, targetFiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderDispatch = fiber.container.renderDispatch;

  const renderPlatform = fiber.container.renderPlatform;

  if (typedInstance.componentDidCatch && !(typedInstance.mode & Effect_TYPE.__effect__)) {
    typedInstance.mode = Effect_TYPE.__effect__;
    renderDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      typedInstance.componentDidCatch?.(error, { componentStack: renderPlatform.getFiberTree(targetFiber) });
    });
  }
};

const processComponentContextOnUpdate = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.container.renderDispatch;

  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const typedInstance = fiber.instance as MyReactComponent;

  if (typedComponent.contextType) {
    if (!typedInstance?._contextFiber || typedInstance._contextFiber.state & STATE_TYPE.__unmount__) {
      const ProviderFiber = renderDispatch.resolveContextFiber(fiber, typedComponent.contextType);

      const context = renderDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);

      typedInstance?._setContext(ProviderFiber);

      return context;
    } else {
      const context = renderDispatch.resolveContextValue(typedInstance._contextFiber as MyReactFiberNode, typedComponent.contextType);

      typedInstance?._setContext(typedInstance._contextFiber);

      return context;
    }
  }
};

const processComponentPropsAndContextOnActive = (fiber: MyReactFiberNode) => {
  const props = Object.assign({}, fiber.pendingProps);

  const context = processComponentContextOnUpdate(fiber);

  const typedInstance = fiber.instance as MyReactComponent;

  typedInstance.props = props;

  typedInstance.context = context;
};

const processComponentShouldUpdateOnUpdate = (
  fiber: MyReactFiberNode,
  { nextState, nextProps, nextContext }: { nextState: unknown; nextProps: unknown; nextContext: unknown }
) => {
  const typedInstance = fiber.instance as MyReactComponent;

  if (fiber.state & (STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) return true;

  if (typedInstance.shouldComponentUpdate) {
    return typedInstance.shouldComponentUpdate?.(nextProps, nextState, nextContext);
  }

  return true;
};

const processComponentGetSnapshotOnUpdate = (fiber: MyReactFiberNode, { baseState, baseProps }: { baseState: unknown; baseProps: unknown }) => {
  const typedInstance = fiber.instance as MyReactComponent;

  if (typedInstance.getSnapshotBeforeUpdate) {
    return typedInstance.getSnapshotBeforeUpdate?.(baseProps, baseState);
  }

  return null;
};

const processComponentDidUpdateOnUpdate = (
  fiber: MyReactFiberNode,
  {
    baseState,
    baseProps,
    snapshot,
    callback,
  }: {
    baseState: unknown;
    baseProps: unknown;
    snapshot: unknown;
    callback: Array<() => void>;
  }
) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderDispatch = fiber.container.renderDispatch;

  const hasEffect = typedInstance.componentDidUpdate || callback.length;

  if (hasEffect && !(typedInstance.mode & Effect_TYPE.__effect__)) {
    typedInstance.mode = Effect_TYPE.__effect__;
    renderDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      callback.forEach((c) => c.call(null));
      typedInstance.componentDidUpdate?.(baseProps, baseState, snapshot);
    });
  }
};

const processComponentWillMountOnMount = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderPlatform = fiber.container.renderPlatform as CustomRenderPlatform;

  // TODO setState
  if (typedInstance.UNSAFE_componentWillMount) {
    typedInstance.UNSAFE_componentWillMount?.();
    if (__DEV__) {
      renderPlatform.log({
        message: "should not invoke legacy lifeCycle function `UNSAFE_componentWillMount`",
        fiber,
        level: "warn",
        triggerOnce: true,
      });
    }
  }
};

const processComponentWillReceiveProps = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderPlatform = fiber.container.renderPlatform as CustomRenderPlatform;

  // only trigger on parent component update
  if (fiber.state & STATE_TYPE.__inherit__) {
    if (typedInstance.UNSAFE_componentWillReceiveProps) {
      const nextProps = Object.assign({}, fiber.pendingProps);
      typedInstance.UNSAFE_componentWillReceiveProps?.(nextProps);
      if (__DEV__) {
        renderPlatform.log({
          message: "should not invoke legacy lifeCycle function `UNSAFE_componentWillReceiveProps`",
          fiber,
          level: "warn",
          triggerOnce: true,
        });
      }
    }
  }
};

const processComponentWillUpdate = (fiber: MyReactFiberNode, { nextProps, nextState }: { nextProps: unknown; nextState: unknown }) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderPlatform = fiber.container.renderPlatform as CustomRenderPlatform;

  if (typedInstance.UNSAFE_componentWillUpdate) {
    typedInstance.UNSAFE_componentWillUpdate(nextProps, nextState);
    if (__DEV__) {
      renderPlatform.log({
        message: "should not invoke legacy lifeCycle function `UNSAFE_componentWillUpdate`",
        fiber,
        level: "warn",
        triggerOnce: true,
      });
    }
  }
};

export const classComponentMount = (fiber: MyReactFiberNode) => {
  const devInstance = processComponentInstanceOnMount(fiber);

  processComponentStateFromProps(fiber, devInstance);

  // legacy lifeCycle
  if (enableLegacyLifeCycle.current) {
    processComponentWillMountOnMount(fiber);
  }

  const children = processComponentRenderOnMountAndUpdate(fiber, devInstance);

  processComponentDidMountOnMount(fiber, devInstance);

  return children;
};

// TODO
export const classComponentActive = (fiber: MyReactFiberNode) => {
  processComponentFiberOnUpdate(fiber);

  processComponentPropsAndContextOnActive(fiber);

  const children = processComponentRenderOnMountAndUpdate(fiber);

  processComponentDidMountOnMount(fiber);

  return children;
};

const classComponentUpdateFromNormal = (fiber: MyReactFiberNode) => {
  processComponentFiberOnUpdate(fiber);

  processComponentStateFromProps(fiber);

  if (enableLegacyLifeCycle.current) processComponentWillReceiveProps(fiber);

  const typedInstance = fiber.instance as MyReactComponent;

  const { newState, isForce, callback } = typedInstance._result;

  typedInstance._result = {
    newState: null,
    isForce: false,
    callback: [],
  };

  const baseState = typedInstance.state;

  const baseProps = typedInstance.props;

  // const baseContext = typedInstance.context;
  const nextState = Object.assign({}, baseState, newState);

  const nextProps = Object.assign({}, fiber.pendingProps);

  const nextContext = processComponentContextOnUpdate(fiber);

  let shouldUpdate = isForce;

  if (!shouldUpdate) {
    shouldUpdate = processComponentShouldUpdateOnUpdate(fiber, {
      nextState,
      nextProps,
      nextContext,
    });
  }

  if (shouldUpdate && enableLegacyLifeCycle.current) {
    processComponentWillUpdate(fiber, { nextProps, nextState });
  }

  typedInstance.state = nextState;

  typedInstance.props = nextProps;

  typedInstance.context = nextContext;

  if (shouldUpdate) {
    const children = processComponentRenderOnMountAndUpdate(fiber);

    const snapshot = processComponentGetSnapshotOnUpdate(fiber, { baseState, baseProps });

    processComponentDidUpdateOnUpdate(fiber, {
      snapshot,
      baseProps,
      baseState,
      callback,
    });

    return { updated: true, children };
  } else {
    return { updated: false };
  }
};

const classComponentUpdateFromError = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const { error, trigger } = typedInstance._error;

  processComponentStateFromError(fiber, error);

  const children = processComponentRenderOnMountAndUpdate(fiber);

  processComponentDidCatchOnMountAndUpdate(fiber, error, trigger as MyReactFiberNode);

  typedInstance._error = { hasError: false, error: null, trigger: null };

  return { updated: true, children };
};

export const classComponentUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  if (typedInstance._error.hasError) {
    return classComponentUpdateFromError(fiber);
  } else {
    return classComponentUpdateFromNormal(fiber);
  }
};
