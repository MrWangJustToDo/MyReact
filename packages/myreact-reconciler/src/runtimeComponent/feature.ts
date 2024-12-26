/* eslint-disable max-lines */
import { __my_react_shared__ } from "@my-react/react";
import { Effect_TYPE, STATE_TYPE, exclude, include } from "@my-react/react-shared";

import { syncFlushComponentQueue } from "../processQueue";
import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import {
  getInstanceContextFiber,
  getInstanceEffectState,
  initInstance,
  setContextForInstance,
  setEffectForInstance,
  setOwnerForInstance,
  unmountInstance,
} from "../runtimeGenerate";
import { afterSyncFlush, beforeSyncFlush, currentRenderDispatch, onceWarnWithKeyAndFiber, safeCallWithCurrentFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactComponent, MixinMyReactClassComponent } from "@my-react/react";

const { enableLegacyLifeCycle } = __my_react_shared__;

const processComponentStateFromProps = (fiber: MyReactFiberNode) => {
  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const typedInstance = fiber.instance as MyReactComponent;

  const pendingProps = fiber.pendingProps;

  const pendingState = fiber.pendingState;

  if (typedComponent.getDerivedStateFromProps) {
    const payloadState = safeCallWithCurrentFiber({
      fiber,
      action: function safeCallGetDerivedStateFromProps() {
        return typedComponent.getDerivedStateFromProps?.(pendingProps, pendingState);
      },
    });

    if (payloadState) {
      const newState = Object.assign({}, pendingState, payloadState);

      typedInstance.state = newState;

      fiber.pendingState = newState;
    }
  }
};

const processComponentInstanceOnMount = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const Component = fiber.elementType;

  const typedComponent = Component as MixinMyReactClassComponent;

  const providerFiber = renderDispatch.resolveContextFiber(fiber, typedComponent.contextType);

  const context = renderDispatch.resolveContextValue(providerFiber, typedComponent.contextType);

  const props = Object.assign({}, fiber.pendingProps);

  if (__DEV__) Object.freeze(props);

  const instance = safeCallWithCurrentFiber({
    fiber,
    action: function safeCallCreateComponentInstance() {
      return new typedComponent(props, context);
    },
  });

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallInstanceInitialListener() {
      listenerMap.get(renderDispatch)?.instanceInitial?.forEach((cb) => cb(instance, fiber));
    },
  });

  if (__DEV__) Object.freeze(instance.state);

  instance.props = props;

  instance.context = context;

  fiber.instance = instance;

  initInstance(instance);

  setOwnerForInstance(instance, fiber);

  setContextForInstance(instance, providerFiber);

  fiber.pendingState = instance.state;
};

const processComponentFiberOnUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallInstanceUpdateListener() {
      listenerMap.get(currentRenderDispatch.current)?.instanceUpdate?.forEach((cb) => cb(typedInstance, fiber));
    },
  });

  setOwnerForInstance(typedInstance, fiber);
};

const processComponentRenderOnMountAndUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const children = safeCallWithCurrentFiber({
    fiber,
    action: function safeCallRender() {
      return typedInstance.render();
    },
  });

  return children;
};

const processComponentDidMountOnMount = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderDispatch = currentRenderDispatch.current;

  const effect = getInstanceEffectState(typedInstance);

  if (typedInstance.componentDidMount && exclude(effect, Effect_TYPE.__effect__)) {
    setEffectForInstance(typedInstance, Effect_TYPE.__effect__);

    renderDispatch.pendingLayoutEffect(fiber, function invokeComponentDidMountOnInstance() {
      setEffectForInstance(typedInstance, Effect_TYPE.__initial__);

      typedInstance.componentDidMount?.();
    });
  }
};

const processComponentContextOnUpdate = (fiber: MyReactFiberNode) => {
  const Component = fiber.elementType;

  const renderDispatch = currentRenderDispatch.current;

  const typedComponent = Component as MixinMyReactClassComponent;

  const typedInstance = fiber.instance as MyReactComponent;

  if (typedComponent.contextType) {
    const contextFiber = getInstanceContextFiber(typedInstance);
    if (!contextFiber || include(contextFiber.state, STATE_TYPE.__unmount__)) {
      const providerFiber = renderDispatch.resolveContextFiber(fiber, typedComponent.contextType);

      const context = renderDispatch.resolveContextValue(providerFiber, typedComponent.contextType);

      setContextForInstance(typedInstance, providerFiber);

      return context;
    } else {
      const context = renderDispatch.resolveContextValue(contextFiber, typedComponent.contextType);

      setContextForInstance(typedInstance, contextFiber);

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

  // if (include(fiber.state, STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) return true;

  if (typedInstance.shouldComponentUpdate) {
    return safeCallWithCurrentFiber({
      fiber,
      action: function safeCallShouldComponentUpdateOnInstance() {
        return typedInstance.shouldComponentUpdate?.(nextProps, nextState, nextContext);
      },
    });
  }

  return true;
};

const processComponentGetSnapshotOnUpdate = (fiber: MyReactFiberNode, { baseState, baseProps }: { baseState: unknown; baseProps: unknown }) => {
  const typedInstance = fiber.instance as MyReactComponent;

  if (typedInstance.getSnapshotBeforeUpdate) {
    return safeCallWithCurrentFiber({
      fiber,
      action: function safeCallGetSnapshotBeforeUpdateOnInstance() {
        return typedInstance.getSnapshotBeforeUpdate?.(baseProps, baseState);
      },
    });
  }

  return null;
};

const processComponentDidUpdateOnUpdate = (
  fiber: MyReactFiberNode,
  {
    baseState,
    baseProps,
    snapshot,
  }: {
    baseState: unknown;
    baseProps: unknown;
    snapshot: unknown;
  }
) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const renderDispatch = currentRenderDispatch.current;

  const effect = getInstanceEffectState(typedInstance);

  if (typedInstance.componentDidUpdate && exclude(effect, Effect_TYPE.__effect__)) {
    setEffectForInstance(typedInstance, Effect_TYPE.__effect__);

    renderDispatch.pendingLayoutEffect(fiber, function invokeComponentDidUpdateOnInstance() {
      setEffectForInstance(typedInstance, Effect_TYPE.__initial__);

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

  if (typedInstance.UNSAFE_componentWillMount) {
    hasLegacyLifeFunction = true;
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallUNSAFE_componentWillMountOnInstance() {
        typedInstance.UNSAFE_componentWillMount?.();
      },
    });
    if (__DEV__) {
      onceWarnWithKeyAndFiber(
        fiber,
        "UNSAFE_componentWillMount",
        `[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillMount'`
      );
    }
  }

  if (typedInstance.componentWillMount) {
    hasLegacyLifeFunction = true;
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallComponentWillMountOnInstance() {
        typedInstance.componentWillMount?.();
      },
    });
    if (__DEV__) {
      onceWarnWithKeyAndFiber(fiber, "componentWillMount", `[@my-react/react] current component have legacy lifeCycle function 'componentWillMount'`);
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

      safeCallWithCurrentFiber({
        fiber,
        action: function safeCallUNSAFE_componentWillReceivePropsOnInstance() {
          typedInstance.UNSAFE_componentWillReceiveProps?.(nextProps);
        },
      });

      if (__DEV__) {
        onceWarnWithKeyAndFiber(
          fiber,
          "UNSAFE_componentWillReceiveProps",
          `[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillReceiveProps'`
        );
      }
    }

    if (typedInstance.componentWillReceiveProps) {
      hasLegacyLifeFunction = true;

      const nextProps = Object.assign({}, fiber.pendingProps);

      safeCallWithCurrentFiber({
        fiber,
        action: function safeCallComponentWillReceivePropsOnInstance() {
          typedInstance.componentWillReceiveProps?.(nextProps);
        },
      });

      if (__DEV__) {
        onceWarnWithKeyAndFiber(
          fiber,
          "componentWillReceiveProps",
          `[@my-react/react] current component have legacy lifeCycle function 'componentWillReceiveProps'`
        );
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
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallUNSAFE_componentWillUpdateOnInstance() {
        typedInstance.UNSAFE_componentWillUpdate?.(nextProps, nextState);
      },
    });

    if (__DEV__) {
      onceWarnWithKeyAndFiber(
        fiber,
        "UNSAFE_componentWillUpdate",
        `[@my-react/react] current component have legacy lifeCycle function 'UNSAFE_componentWillUpdate'`
      );
    }
  }

  if (typedInstance.componentWillUpdate) {
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallComponentWillUpdateOnInstance() {
        typedInstance.componentWillUpdate?.(nextProps, nextState);
      },
    });
    if (__DEV__) {
      onceWarnWithKeyAndFiber(fiber, "componentWillUpdate", `[@my-react/react] current component have legacy lifeCycle function 'componentWillUpdate'`);
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
const classComponentUpdateImpl = (fiber: MyReactFiberNode) => {
  processComponentFiberOnUpdate(fiber);

  processComponentStateFromProps(fiber);

  if (enableLegacyLifeCycle.current) {
    beforeSyncFlush();
    processComponentWillReceiveProps(fiber) && syncFlushComponentQueue(fiber);
    afterSyncFlush();
  }

  const typedInstance = fiber.instance as MyReactComponent;

  const baseState = typedInstance.state;

  const baseProps = typedInstance.props;

  // const baseContext = typedInstance.context;
  const nextState = Object.assign({}, fiber.pendingState);

  const nextProps = Object.assign({}, fiber.pendingProps);

  const nextContext = processComponentContextOnUpdate(fiber);

  let shouldUpdate = Boolean(include(fiber.state, STATE_TYPE.__triggerSyncForce__ | STATE_TYPE.__triggerConcurrentForce__));

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
    });

    return { updated: true, children };
  } else {
    return { updated: false };
  }
};

export const syncComponentStateToFiber = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  // sync pendingState
  fiber.pendingState = Object.assign({}, typedInstance.state);
};

export const classComponentUpdate = (fiber: MyReactFiberNode) => {
  const res = classComponentUpdateImpl(fiber);

  syncComponentStateToFiber(fiber);

  return res;
};

export const classComponentUnmount = (fiber: MyReactFiberNode, _renderDispatch: CustomRenderDispatch) => {
  const typedInstance = fiber.instance as MyReactComponent;

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallInstanceUnmountListener() {
      listenerMap.get(_renderDispatch)?.instanceUnmount?.forEach((cb) => cb(typedInstance, fiber));
    },
  });

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallComponentWillUnmountOnInstance() {
      typedInstance?.componentWillUnmount?.();
    },
  });

  unmountInstance(typedInstance);
};
