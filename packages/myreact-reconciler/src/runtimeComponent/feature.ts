/* eslint-disable max-lines */
import { __my_react_shared__ } from "@my-react/react";
import { Effect_TYPE, STATE_TYPE, exclude, include } from "@my-react/react-shared";

import { isErrorBoundariesInstance } from "../dispatchErrorBoundaries";
import { syncFlushComponentQueue } from "../dispatchQueue";
import { afterSyncFlush, beforeSyncFlush, currentRenderDispatch, onceWarnWithKey, safeCallWithFiber } from "../share";

import type { MemoizedStateTypeWithError, MyReactFiberNode, PendingStateType, PendingStateTypeWithError } from "../runtimeFiber";
import type { MyReactComponent, MixinMyReactClassComponent } from "@my-react/react";

const { enableLegacyLifeCycle } = __my_react_shared__;

const processComponentStateFromProps = (fiber: MyReactFiberNode) => {
  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const typedInstance = fiber.instance as MyReactComponent;

  const isErrorCatch = isErrorBoundariesInstance(typedInstance, typedComponent);

  const pendingProps = fiber.pendingProps;

  const currentStateObj = isErrorCatch ? (fiber.pendingState as PendingStateTypeWithError).state : (fiber.pendingState as PendingStateType);

  const pendingState = currentStateObj.pendingState;

  if (typedComponent.getDerivedStateFromProps) {
    const payloadState = safeCallWithFiber({ fiber, action: () => typedComponent.getDerivedStateFromProps?.(pendingProps, pendingState) });

    if (payloadState) {
      const newState = Object.assign({}, pendingState, payloadState);

      typedInstance.state = newState;

      currentStateObj.pendingState = newState;
    }
  }
};

// TODO
const processComponentStateFromError = (fiber: MyReactFiberNode, error: Error) => {
  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const typedInstance = fiber.instance as MyReactComponent;

  if (typedComponent.getDerivedStateFromError) {
    const currentStateObj = (fiber.pendingState as PendingStateTypeWithError).state;

    const payloadState = safeCallWithFiber({ fiber, action: () => typedComponent.getDerivedStateFromError?.(error) });

    if (payloadState) {
      // if there are a error happen, ignore all the updateQueue
      const newState = Object.assign({}, typedInstance.state, payloadState);

      typedInstance.state = newState;

      currentStateObj.pendingState = newState;
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

  if (__DEV__) Object.freeze(props);

  const instance = safeCallWithFiber({ fiber, action: () => new typedComponent(props, context) });

  if (__DEV__) Object.freeze(instance.state);

  instance.props = props;

  instance.context = context;

  fiber.instance = instance;

  instance._setOwner(fiber);

  instance._setContext(ProviderFiber);

  const pendingState = instance.state;

  const isErrorCatch = isErrorBoundariesInstance(instance, typedComponent);

  // prepare state flow
  if (!isErrorCatch) {
    fiber.pendingState = { pendingState: pendingState, callback: [], isForce: false };
  } else {
    fiber.pendingState = { state: { pendingState: pendingState, callback: [], isForce: false }, error: { revertState: null, error: null, stack: null } };

    fiber.memoizedState = { stableState: null, revertState: null };
  }
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

  if (typedInstance.componentDidMount && exclude(typedInstance.mode, Effect_TYPE.__effect__)) {
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

  if (typedInstance.componentDidCatch && exclude(typedInstance.mode, Effect_TYPE.__effect__)) {
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
    if (!typedInstance?._contextFiber || include(typedInstance._contextFiber.state, STATE_TYPE.__unmount__)) {
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

  if (include(fiber.state, STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) return true;

  if (typedInstance.shouldComponentUpdate) {
    return safeCallWithFiber({ fiber, action: () => typedInstance.shouldComponentUpdate?.(nextProps, nextState, nextContext) });
  }

  return true;
};

const processComponentGetSnapshotOnUpdate = (fiber: MyReactFiberNode, { baseState, baseProps }: { baseState: unknown; baseProps: unknown }) => {
  const typedInstance = fiber.instance as MyReactComponent;

  if (typedInstance.getSnapshotBeforeUpdate) {
    return safeCallWithFiber({ fiber, action: () => typedInstance.getSnapshotBeforeUpdate?.(baseProps, baseState) });
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

  if (hasEffect && exclude(typedInstance.mode, Effect_TYPE.__effect__)) {
    typedInstance.mode = Effect_TYPE.__effect__;

    renderDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;

      safeCallWithFiber({ fiber, action: () => callback.forEach((c) => c.call(null)) });

      typedInstance.componentDidUpdate?.(baseProps, baseState, snapshot);
    });
  }
};

/**
 * @deprecated
 */
const processComponentWillMountOnMount = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  let hasLegacyLifeFunction = false;

  // TODO setState
  if (typedInstance.UNSAFE_componentWillMount) {
    hasLegacyLifeFunction = true;
    safeCallWithFiber({ fiber, action: () => typedInstance.UNSAFE_componentWillMount?.() });
    if (__DEV__) {
      onceWarnWithKey(fiber, "UNSAFE_componentWillMount", `[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillMount'`);
      // console.warn(`[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillMount'`);
    }
  }

  if (typedInstance.componentWillMount) {
    hasLegacyLifeFunction = true;
    safeCallWithFiber({ fiber, action: () => typedInstance.componentWillMount?.() });
    if (__DEV__) {
      onceWarnWithKey(fiber, "componentWillMount", `[@my-react/react] current component have legacy lifeCycle function 'componentWillMount'`);
      // console.warn(`[@my-react/react] current component have legacy lifeCycle function 'componentWillMount'`);
    }
  }

  return hasLegacyLifeFunction;
};

/**
 * @deprecated
 */
const processComponentWillReceiveProps = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  let hasLegacyLifeFunction = false;

  // only trigger on parent component update
  if (include(fiber.state, STATE_TYPE.__inherit__)) {
    if (typedInstance.UNSAFE_componentWillReceiveProps) {
      hasLegacyLifeFunction = true;
      const nextProps = Object.assign({}, fiber.pendingProps);
      safeCallWithFiber({ fiber, action: () => typedInstance.UNSAFE_componentWillReceiveProps?.(nextProps) });
      if (__DEV__) {
        onceWarnWithKey(
          fiber,
          "UNSAFE_componentWillReceiveProps",
          `[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillReceiveProps'`
        );
        // console.warn(`[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillReceiveProps'`);
      }
    }

    if (typedInstance.componentWillReceiveProps) {
      hasLegacyLifeFunction = true;
      const nextProps = Object.assign({}, fiber.pendingProps);
      safeCallWithFiber({ fiber, action: () => typedInstance.componentWillReceiveProps?.(nextProps) });
      if (__DEV__) {
        onceWarnWithKey(fiber, "componentWillReceiveProps", `[@my-react/react] current component have legacy lifeCycle function 'componentWillReceiveProps'`);
        // console.warn(`[@my-react/react] current component have legacy lifeCycle function 'componentWillReceiveProps'`);
      }
    }
  }

  return hasLegacyLifeFunction;
};

/**
 * @deprecated
 */
const processComponentWillUpdate = (fiber: MyReactFiberNode, { nextProps, nextState }: { nextProps: unknown; nextState: unknown }) => {
  const typedInstance = fiber.instance as MyReactComponent;

  if (typedInstance.UNSAFE_componentWillUpdate) {
    safeCallWithFiber({ fiber, action: () => typedInstance.UNSAFE_componentWillUpdate?.(nextProps, nextState) });
    if (__DEV__) {
      onceWarnWithKey(fiber, "UNSAFE_componentWillUpdate", `[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillUpdate'`);
      // console.warn(`[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillUpdate'`);
    }
  }

  if (typedInstance.componentWillUpdate) {
    safeCallWithFiber({ fiber, action: () => typedInstance.componentWillUpdate?.(nextProps, nextState) });
    if (__DEV__) {
      onceWarnWithKey(fiber, "componentWillUpdate", `[@my-react/react] current component have legacy lifeCycle function 'componentWillUpdate'`);
      // console.warn(`[@my-react/react] current component have legacy lifeCycle function 'componentWillUpdate'`);
    }
  }
};

export const classComponentMount = (fiber: MyReactFiberNode) => {
  processComponentInstanceOnMount(fiber);

  processComponentStateFromProps(fiber);

  // legacy lifeCycle
  if (enableLegacyLifeCycle.current) {
    beforeSyncFlush();
    processComponentWillMountOnMount(fiber) && syncFlushComponentQueue(fiber);
    afterSyncFlush();
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

// TODO
const classComponentUpdateFromNormal = (fiber: MyReactFiberNode) => {
  processComponentFiberOnUpdate(fiber);

  processComponentStateFromProps(fiber);

  if (enableLegacyLifeCycle.current) {
    beforeSyncFlush();
    processComponentWillReceiveProps(fiber) && syncFlushComponentQueue(fiber);
    afterSyncFlush();
  }

  const typedInstance = fiber.instance as MyReactComponent;

  const typedComponent = fiber.elementType as MixinMyReactClassComponent;

  const isErrorCatch = isErrorBoundariesInstance(typedInstance, typedComponent);

  const pendingState = isErrorCatch ? (fiber.pendingState as PendingStateTypeWithError).state : (fiber.pendingState as PendingStateType);

  const baseState = typedInstance.state;

  const baseProps = typedInstance.props;

  // const baseContext = typedInstance.context;
  const nextState = Object.assign({}, pendingState.pendingState);

  const nextProps = Object.assign({}, fiber.pendingProps);

  const nextContext = processComponentContextOnUpdate(fiber);

  let shouldUpdate = pendingState.isForce;

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
      callback: pendingState.callback,
    });

    return { updated: true, children };
  } else {
    return { updated: false };
  }
};

const classComponentUpdateFromError = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const {
    error: { error, stack },
  } = fiber.pendingState as PendingStateTypeWithError;

  processComponentStateFromError(fiber, error);

  const children = processComponentRenderOnMountAndUpdate(fiber);

  processComponentDidCatchOnMountAndUpdate(fiber, error, stack);

  renderDispatch.runtimeFiber.errorCatchFiber = fiber;

  return { updated: true, children };
};

export const syncComponentStateToFiber = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const typedComponent = fiber.elementType as MixinMyReactClassComponent;

  const isErrorCatch = isErrorBoundariesInstance(typedInstance, typedComponent);

  if (isErrorCatch) {
    const typedPendingState = fiber.pendingState as PendingStateTypeWithError;

    const typedMemoizedState = fiber.memoizedState as MemoizedStateTypeWithError;

    if (typedPendingState.error?.error) {
      const typedInstance = fiber.instance as MyReactComponent;

      // sync pendingState
      typedPendingState.state.pendingState = Object.assign({}, typedInstance.state);

      // sync memoizedState
      typedMemoizedState.stableState = Object.assign({}, typedInstance.state);
      typedMemoizedState.revertState = typedPendingState.error.revertState;

      // clear pendingState
      typedPendingState.state.isForce = false;
      typedPendingState.state.callback = [];
      typedPendingState.error.stack = null;
      typedPendingState.error.error = null;
      typedPendingState.error.revertState = null;
    } else {
      const typedInstance = fiber.instance as MyReactComponent;

      // sync pendingState
      typedPendingState.state.pendingState = Object.assign({}, typedInstance.state);

      // sync memoizedState
      typedMemoizedState.stableState = Object.assign({}, typedInstance.state);

      // clear pendingState
      typedPendingState.state.isForce = false;
      typedPendingState.state.callback = [];
    }
  } else {
    const typedPendingState = fiber.pendingState as PendingStateType;

    const typedInstance = fiber.instance as MyReactComponent;

    // sync pendingState
    typedPendingState.pendingState = Object.assign({}, typedInstance.state);

    // clear pendingState
    typedPendingState.isForce = false;
    typedPendingState.callback = [];
  }
};

export const classComponentUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const typedComponent = fiber.elementType as MixinMyReactClassComponent;

  const isErrorCatch = isErrorBoundariesInstance(typedInstance, typedComponent);

  if (isErrorCatch) {
    const typedPendingState = fiber.pendingState as PendingStateTypeWithError;
    if (typedPendingState.error?.error) {
      const res = classComponentUpdateFromError(fiber);

      syncComponentStateToFiber(fiber);

      return res;
    } else {
      const res = classComponentUpdateFromNormal(fiber);

      syncComponentStateToFiber(fiber);

      return res;
    }
  } else {
    const res = classComponentUpdateFromNormal(fiber);

    syncComponentStateToFiber(fiber);

    return res;
  }
};
