import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { Effect_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { currentRenderDispatch, safeCallWithFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactComponent, MixinMyReactClassComponent } from "@my-react/react";

const { enableLegacyLifeCycle } = __my_react_shared__;

const { currentRenderPlatform } = __my_react_internal__;

const processComponentStateFromProps = (fiber: MyReactFiberNode) => {
  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const typedInstance = fiber.instance as MyReactComponent;

  const pendingProps = Object.assign({}, fiber.pendingProps);

  const currentState = Object.assign({}, typedInstance.state);

  const nextState = fiber.pendingState.state;

  if (typedComponent.getDerivedStateFromProps) {
    const payloadState = typedComponent.getDerivedStateFromProps?.(pendingProps, currentState);
    if (payloadState) {
      nextState.pendingState = Object.assign({}, nextState.pendingState, payloadState);
      // typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
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
      // if there are a error happen, ignore all the updateQueue
      typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
    }
  }
};

const processComponentInstanceOnMount = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

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

  const pendingState = Object.assign({}, instance.state);

  // prepare state flow
  fiber.pendingState = { state: { pendingState, isForce: false, callback: [] }, error: { revertState: null, error: null, stack: null } };

  fiber.memoizedState = { stableState: null, revertState: null };
};

const processComponentFiberOnUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;
  typedInstance._setOwner(fiber);
};

const processComponentRenderOnMountAndUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const children = safeCallWithFiber({ fiber, action: () => typedInstance.render() });

  return children;
};

const processComponentDidMountOnMount = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderDispatch = currentRenderDispatch.current;

  if (typedInstance.componentDidMount && !(typedInstance.mode & Effect_TYPE.__effect__)) {
    typedInstance.mode = Effect_TYPE.__effect__;
    renderDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      typedInstance.componentDidMount?.();
    });
  }
};

const processComponentDidCatchOnMountAndUpdate = (fiber: MyReactFiberNode, error: Error, stack: string) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderDispatch = currentRenderDispatch.current;

  if (typedInstance.componentDidCatch && !(typedInstance.mode & Effect_TYPE.__effect__)) {
    typedInstance.mode = Effect_TYPE.__effect__;
    renderDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      typedInstance.componentDidCatch?.(error, { componentStack: stack });
    });
  }
};

const processComponentContextOnUpdate = (fiber: MyReactFiberNode) => {
  const Component = fiber.elementType;

  const renderDispatch = currentRenderDispatch.current;

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

  const renderDispatch = currentRenderDispatch.current;

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

  const renderPlatform = currentRenderPlatform.current;

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

  const renderPlatform = currentRenderPlatform.current;

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

  const renderPlatform = currentRenderPlatform.current;

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
  processComponentInstanceOnMount(fiber);

  processComponentStateFromProps(fiber);

  // legacy lifeCycle
  if (enableLegacyLifeCycle.current) {
    processComponentWillMountOnMount(fiber);
  }

  const children = processComponentRenderOnMountAndUpdate(fiber);

  processComponentDidMountOnMount(fiber);

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

  const { pendingState, isForce, callback } = fiber.pendingState.state;

  const baseState = typedInstance.state;

  const baseProps = typedInstance.props;

  // const baseContext = typedInstance.context;
  const nextState = Object.assign({}, pendingState);

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
  const renderDispatch = currentRenderDispatch.current;

  const { error, stack } = fiber.pendingState.error;

  processComponentStateFromError(fiber, error);

  const children = processComponentRenderOnMountAndUpdate(fiber);

  processComponentDidCatchOnMountAndUpdate(fiber, error, stack);

  renderDispatch.runtimeFiber.errorCatchFiber = fiber;

  return { updated: true, children };
};

export const classComponentUpdate = (fiber: MyReactFiberNode) => {
  if (fiber.pendingState.error?.error) {
    const res = classComponentUpdateFromError(fiber);

    const pendingState = fiber.pendingState;

    const memoizedState = fiber.memoizedState;

    const typedInstance = fiber.instance as MyReactComponent;

    // sync pendingState
    pendingState.state.pendingState = Object.assign({}, typedInstance.state);

    // sync memoizedState
    memoizedState.stableState = Object.assign({}, typedInstance.state);
    memoizedState.revertState = pendingState.error.revertState;

    // clear pendingState
    pendingState.state.isForce = false;
    pendingState.state.callback = [];
    pendingState.error.stack = null;
    pendingState.error.error = null;
    pendingState.error.revertState = null;

    return res;
  } else {
    const res = classComponentUpdateFromNormal(fiber);

    const pendingState = fiber.pendingState;

    const memoizedState = fiber.memoizedState;

    const typedInstance = fiber.instance as MyReactComponent;

    // sync pendingState
    pendingState.state.pendingState = Object.assign({}, typedInstance.state);

    // sync memoizedState
    memoizedState.stableState = Object.assign({}, typedInstance.state);

    // clear pendingState
    pendingState.state.isForce = false;
    pendingState.state.callback = [];

    return res;
  }
};
