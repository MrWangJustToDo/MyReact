import { __my_react_shared__ } from "@my-react/react";
import { Effect_TYPE, NODE_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import type {
  MyReactElement,
  MyReactFiberNode,
  memo,
  MixinMyReactComponentType,
  MyReactClassComponent,
  MyReactComponentStaticType,
  MyReactComponent,
} from "@my-react/react";

const { getFiberTree, enableLegacyLifeCycle } = __my_react_shared__;

const DEFAULT_RESULT = {
  newState: null,
  isForce: false,
  callback: [],
};

const processComponentStateFromProps = (fiber: MyReactFiberNode, devInstance?: MyReactComponent | null) => {
  const typedElement = fiber.element as MyReactElement;

  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? typedElement.type : (typedElement.type as ReturnType<typeof memo>).render;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const props = Object.assign({}, typedElement.props);
  const state = Object.assign({}, typedInstance.state);

  if (typeof typedComponent.getDerivedStateFromProps === "function") {
    const payloadState = typedComponent.getDerivedStateFromProps(props, state);
    if (payloadState) {
      typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
    }
  }

  if (devInstance) {
    const typedDevInstance = devInstance as MixinMyReactComponentType;

    const props = Object.assign({}, typedElement.props);
    const state = Object.assign({}, typedInstance.state);

    if (typeof typedComponent.getDerivedStateFromProps === "function") {
      const payloadState = typedComponent.getDerivedStateFromProps(props, state);
      if (payloadState) {
        typedDevInstance.state = Object.assign({}, typedInstance.state, payloadState);
      }
    }
  }
};

const processComponentStateFromError = (fiber: MyReactFiberNode, error: Error) => {
  const typedElement = fiber.element as MyReactElement;

  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? typedElement.type : (typedElement.type as ReturnType<typeof memo>).render;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  if (typeof typedComponent.getDerivedStateFromError === "function") {
    const payloadState = typedComponent.getDerivedStateFromError(error);
    if (payloadState) {
      typedInstance.state = Object.assign({}, typedInstance.state, payloadState);
    }
  }
};

const processComponentInstanceOnMount = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as MyReactElement;

  const globalDispatch = fiber.root.globalDispatch;

  const strictMod = globalDispatch.resolveStrictValue(fiber);

  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? typedElement.type : (typedElement.type as ReturnType<typeof memo>).render;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  const ProviderFiber = globalDispatch.resolveContextFiber(fiber, typedComponent.contextType);

  const context = globalDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);

  const props = Object.assign({}, typedElement.props);

  const instance = new typedComponent(props, context);

  instance.props = props;

  instance.context = context;

  fiber.installInstance(instance);

  instance.setOwner(fiber);

  instance.setContext(ProviderFiber);

  let devInstance: null | MyReactComponent = null;

  if (__DEV__ && strictMod) {
    const props = Object.assign({}, typedElement.props);

    devInstance = new typedComponent(props, context);

    devInstance.props = props;

    devInstance.context = context;
  }

  return devInstance;
};

const processComponentFiberOnUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;
  typedInstance.setOwner(fiber);
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

  const globalDispatch = fiber.root.globalDispatch;

  if (devInstance) {
    if (!(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
      typedInstance.mode = Effect_TYPE.__pendingEffect__;
      globalDispatch.pendingLayoutEffect(fiber, () => {
        typedInstance.mode = Effect_TYPE.__initial__;
        typedInstance.componentDidMount?.();
        typedInstance.componentWillUnmount?.();
        typedInstance.componentDidMount?.();
      });
    }
  } else if (typedInstance.componentDidMount && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;
    globalDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      typedInstance.componentDidMount?.();
    });
  }
};

const processComponentDidCatchOnMountAndUpdate = (fiber: MyReactFiberNode, error: Error, targetFiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const globalDispatch = fiber.root.globalDispatch;

  if (typedInstance.componentDidCatch && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;
    globalDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      typedInstance.componentDidCatch(error, { componentStack: getFiberTree(targetFiber) });
    });
  }
};

const processComponentContextOnUpdate = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as MyReactElement;

  const globalDispatch = fiber.root.globalDispatch;

  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? typedElement.type : (typedElement.type as ReturnType<typeof memo>).render;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  if (typedComponent.contextType) {
    if (!typedInstance?._contextFiber || !typedInstance._contextFiber.isMounted) {
      const ProviderFiber = globalDispatch.resolveContextFiber(fiber, typedComponent.contextType);

      const context = globalDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);

      typedInstance?.setContext(ProviderFiber);

      return context;
    } else {
      const context = globalDispatch.resolveContextValue(typedInstance._contextFiber, typedComponent.contextType);

      // for ReActive component, we need set context fiber again
      typedInstance?.setContext(typedInstance._contextFiber);

      return context;
    }
  }
};

const processComponentPropsAndContextOnActive = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as MyReactElement;

  const props = Object.assign({}, typedElement.props);

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
    return typedInstance.shouldComponentUpdate(nextProps, nextState, nextContext);
  }

  return true;
};

const processComponentGetSnapshotOnUpdate = (fiber: MyReactFiberNode, { baseState, baseProps }: { baseState: unknown; baseProps: unknown }) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  if (typedInstance.getSnapshotBeforeUpdate) {
    return typedInstance.getSnapshotBeforeUpdate(baseProps, baseState);
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

  const globalDispatch = fiber.root.globalDispatch;

  const hasEffect = typedInstance.componentDidUpdate || callback.length;

  if (hasEffect && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;
    globalDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      callback.forEach((c) => c.call(null));
      typedInstance.componentDidUpdate?.(baseProps, baseState, snapshot);
    });
  }
};

const processComponentWillMountOnMount = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const globalPlatform = fiber.root.globalPlatform;

  // const globalDispatch = fiber.root.globalDispatch;

  // TODO setState
  if (typedInstance.UNSAFE_componentWillMount && typeof typedInstance.UNSAFE_componentWillMount === "function") {
    typedInstance.UNSAFE_componentWillMount();
    if (__DEV__) {
      globalPlatform.log({ message: "should not invoke legacy lifeCycle function `UNSAFE_componentWillMount`", fiber, level: "warn", triggerOnce: true });
    }
  }
};

const processComponentWillReceiveProps = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const globalPlatform = fiber.root.globalPlatform;

  const newElement = fiber.element;

  // only trigger on parent component update
  if (fiber.mode & UPDATE_TYPE.__update__ && !(fiber.mode & UPDATE_TYPE.__trigger__)) {
    if (typedInstance.UNSAFE_componentWillReceiveProps && typeof typedInstance.UNSAFE_componentWillReceiveProps === "function") {
      const nextProps = Object.assign({}, typeof newElement === "object" ? newElement?.["props"] : {});
      typedInstance.UNSAFE_componentWillReceiveProps(nextProps);
      if (__DEV__) {
        globalPlatform.log({
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

  const globalPlatform = fiber.root.globalPlatform;

  if (typedInstance.UNSAFE_componentWillUpdate && typeof typedInstance.UNSAFE_componentWillUpdate === "function") {
    typedInstance.UNSAFE_componentWillUpdate(nextProps, nextState);
    if (__DEV__) {
      globalPlatform.log({ message: "should not invoke legacy lifeCycle function `UNSAFE_componentWillUpdate`", fiber, level: "warn", triggerOnce: true });
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

  if (enableLegacyLifeCycle.current) {
    processComponentWillReceiveProps(fiber);
  }

  fiber.root.globalDispatch.resolveComponentQueue(fiber);

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const newElement = fiber.element;

  const { newState, isForce, callback } = typedInstance._result;

  // maybe could improve here
  typedInstance._result = DEFAULT_RESULT;

  const baseState = typedInstance.state;

  const baseProps = typedInstance.props;

  // const baseContext = typedInstance.context;
  const nextState = Object.assign({}, baseState, newState);

  const nextProps = Object.assign({}, typeof newElement === "object" ? newElement?.["props"] : {});

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