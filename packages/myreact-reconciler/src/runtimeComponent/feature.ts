import { __my_react_shared__ } from "@my-react/react";
import { Effect_TYPE, NODE_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import type { RenderDispatch } from "../runtimeDispatch";
import type { MyReactFiberNode, memo, MixinMyReactComponentType, MyReactClassComponent, MyReactComponentStaticType, MyReactComponent } from "@my-react/react";

const { enableLegacyLifeCycle, enableStrictLifeCycle } = __my_react_shared__;

const processComponentStateFromProps = (fiber: MyReactFiberNode, devInstance?: MyReactComponent | null) => {
  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? fiber.elementType : (fiber.elementType as ReturnType<typeof memo>).render;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const pendingProps = Object.assign({}, fiber.pendingProps);
  const currentState = Object.assign({}, typedInstance.state);

  if (typedComponent.getDerivedStateFromProps) {
    const payloadState = typedComponent.getDerivedStateFromProps?.(pendingProps, currentState);
    if (payloadState) {
      typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
    }
  }

  if (devInstance) {
    const typedDevInstance = devInstance as MixinMyReactComponentType;

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
  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? fiber.elementType : (fiber.elementType as ReturnType<typeof memo>).render;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  if (typedComponent.getDerivedStateFromError) {
    const payloadState = typedComponent.getDerivedStateFromError?.(error);
    if (payloadState) {
      typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
    }
  }
};

const processComponentInstanceOnMount = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const ReactNewStrictMod = __DEV__ ? renderDispatch.resolveStrict(fiber) && enableStrictLifeCycle.current : false;

  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? fiber.elementType : (fiber.elementType as ReturnType<typeof memo>).render;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  const ProviderFiber = renderDispatch.resolveContextFiber(fiber, typedComponent.contextType);

  const context = renderDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);

  const props = Object.assign({}, fiber.pendingProps);

  const instance = new typedComponent(props, context);

  instance.props = props;

  instance.context = context;

  fiber._installInstance(instance);

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
  const typedInstance = fiber.instance as MixinMyReactComponentType;
  typedInstance._setOwner(fiber);
};

const processComponentRenderOnMountAndUpdate = (fiber: MyReactFiberNode, devInstance?: MyReactComponent | null) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  if (devInstance) {
    const cached = Object.assign({}, typedInstance);

    const children = typedInstance.render();

    // reset
    Object.assign(typedInstance, cached);

    typedInstance.render();

    return children;
  } else {
    const children = typedInstance.render();

    return children;
  }
};

const processComponentDidMountOnMount = (fiber: MyReactFiberNode, devInstance?: MyReactComponent | null) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  if (devInstance) {
    if ((typedInstance.componentDidMount || typedInstance.componentWillUnmount) && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
      typedInstance.mode = Effect_TYPE.__pendingEffect__;
      renderDispatch.pendingLayoutEffect(fiber, () => {
        typedInstance.mode = Effect_TYPE.__initial__;
        typedInstance.componentDidMount?.();
        typedInstance.componentWillUnmount?.();
        typedInstance.componentDidMount?.();
      });
    }
  } else {
    if (typedInstance.componentDidMount && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
      typedInstance.mode = Effect_TYPE.__pendingEffect__;
      renderDispatch.pendingLayoutEffect(fiber, () => {
        typedInstance.mode = Effect_TYPE.__initial__;
        typedInstance.componentDidMount?.();
      });
    }
  }
};

const processComponentDidCatchOnMountAndUpdate = (fiber: MyReactFiberNode, error: Error, targetFiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform;

  if (typedInstance.componentDidCatch && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;
    renderDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      typedInstance.componentDidCatch?.(error, { componentStack: renderPlatform.getFiberTree(targetFiber) });
    });
  }
};

const processComponentContextOnUpdate = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? fiber.elementType : (fiber.elementType as ReturnType<typeof memo>).render;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  if (typedComponent.contextType) {
    if (!typedInstance?._contextFiber || !typedInstance._contextFiber.isMounted) {
      const ProviderFiber = renderDispatch.resolveContextFiber(fiber, typedComponent.contextType);

      const context = renderDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);

      typedInstance?._setContext(ProviderFiber);

      return context;
    } else {
      const context = renderDispatch.resolveContextValue(typedInstance._contextFiber, typedComponent.contextType);

      // for ReActive component, we need set context fiber again
      typedInstance?._setContext(typedInstance._contextFiber);

      return context;
    }
  }
};

const processComponentPropsAndContextOnActive = (fiber: MyReactFiberNode) => {
  const props = Object.assign({}, fiber.pendingProps);

  const context = processComponentContextOnUpdate(fiber);

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  typedInstance.props = props;

  typedInstance.context = context;
};

const processComponentShouldUpdateOnUpdate = (
  fiber: MyReactFiberNode,
  { nextState, nextProps, nextContext }: { nextState: unknown; nextProps: unknown; nextContext: unknown }
) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  if (fiber.mode & UPDATE_TYPE.__trigger__) return true;

  if (typedInstance.shouldComponentUpdate) {
    return typedInstance.shouldComponentUpdate?.(nextProps, nextState, nextContext);
  }

  return true;
};

const processComponentGetSnapshotOnUpdate = (fiber: MyReactFiberNode, { baseState, baseProps }: { baseState: unknown; baseProps: unknown }) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

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
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const hasEffect = typedInstance.componentDidUpdate || callback.length;

  if (hasEffect && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;
    renderDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      callback.forEach((c) => c.call(null));
      typedInstance.componentDidUpdate?.(baseProps, baseState, snapshot);
    });
  }
};

const processComponentWillMountOnMount = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  // TODO setState
  if (typedInstance.UNSAFE_componentWillMount) {
    typedInstance.UNSAFE_componentWillMount?.();
    if (__DEV__) {
      fiber.root.renderPlatform.log({
        message: "should not invoke legacy lifeCycle function `UNSAFE_componentWillMount`",
        fiber,
        level: "warn",
        triggerOnce: true,
      });
    }
  }
};

const processComponentWillReceiveProps = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  // only trigger on parent component update
  if (fiber.mode & UPDATE_TYPE.__update__) {
    if (typedInstance.UNSAFE_componentWillReceiveProps) {
      const nextProps = Object.assign({}, fiber.pendingProps);
      typedInstance.UNSAFE_componentWillReceiveProps?.(nextProps);
      if (__DEV__) {
        fiber.root.renderPlatform.log({
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
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  if (typedInstance.UNSAFE_componentWillUpdate) {
    typedInstance.UNSAFE_componentWillUpdate(nextProps, nextState);
    if (__DEV__) {
      fiber.root.renderPlatform.log({
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

export const classComponentUpdate = (fiber: MyReactFiberNode) => {
  processComponentFiberOnUpdate(fiber);

  processComponentStateFromProps(fiber);

  if (enableLegacyLifeCycle.current) processComponentWillReceiveProps(fiber);

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  // when a class component update, need flash all the queueUpdater
  // processClassComponentUpdateQueue(fiber);

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

export const classComponentCatch = (fiber: MyReactFiberNode, error: Error, targetFiber: MyReactFiberNode) => {
  processComponentStateFromError(fiber, error);

  const children = processComponentRenderOnMountAndUpdate(fiber);

  processComponentDidCatchOnMountAndUpdate(fiber, error, targetFiber);

  return children;
};
