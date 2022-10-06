import { Effect_TYPE, NODE_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import type {
  MyReactElement,
  MyReactFiberNode,
  memo,
  MixinMyReactComponentType,
  MyReactClassComponent,
  MyReactComponentStaticType,
  MyReactFiberNodeDev,
  MyReactComponent,
} from "@my-react/react";

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

const processComponentInstanceOnMount = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as MyReactElement;

  const globalDispatch = fiber.root.dispatch;

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

  if (__DEV__) {
    fiber.checkInstance();
  }

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

  const typeFiber = fiber as MyReactFiberNodeDev;

  if (devInstance) {
    const cached = Object.assign({}, typedInstance);

    const children = typedInstance.render();

    typeFiber._debugDynamicChildren = children;

    // reset
    Object.assign(typedInstance, cached);

    typedInstance.render();

    return children;
  } else {
    const children = typedInstance.render();

    if (__DEV__) {
      typeFiber._debugDynamicChildren = children;
    }

    return children;
  }
};

const processComponentDidMountOnMount = (fiber: MyReactFiberNode, devInstance?: MyReactComponent | null) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const globalDispatch = fiber.root.dispatch;

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

const processComponentContextOnUpdate = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as MyReactElement;

  const globalDispatch = fiber.root.dispatch;

  const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? typedElement.type : (typedElement.type as ReturnType<typeof memo>).render;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

  if (!typedInstance?._contextFiber || !typedInstance._contextFiber.mounted) {
    const ProviderFiber = globalDispatch.resolveContextFiber(fiber, typedComponent.contextType);

    const context = globalDispatch.resolveContextValue(ProviderFiber, typedComponent.contextType);

    typedInstance?.setContext(ProviderFiber);

    return context;
  } else {
    const context = globalDispatch.resolveContextValue(typedInstance._contextFiber, typedComponent.contextType);

    return context;
  }
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

const processComponentDidUpdateOnUpdate = (
  fiber: MyReactFiberNode,
  {
    baseState,
    baseProps,
    baseContext,
    callback,
  }: {
    baseState: unknown;
    baseProps: unknown;
    baseContext: unknown;
    callback: Array<() => void>;
  }
) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const globalDispatch = fiber.root.dispatch;

  const hasEffect = typedInstance.componentDidUpdate || callback.length;

  if (hasEffect && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;
    globalDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;
      callback.forEach((c) => c.call(null));
      typedInstance.componentDidUpdate?.(baseProps, baseState, baseContext);
    });
  }
};

export const classComponentMount = (fiber: MyReactFiberNode) => {
  const devInstance = processComponentInstanceOnMount(fiber);
  processComponentStateFromProps(fiber, devInstance);
  const children = processComponentRenderOnMountAndUpdate(fiber, devInstance);
  processComponentDidMountOnMount(fiber, devInstance);
  return children;
};

export const classComponentActive = (fiber: MyReactFiberNode) => {
  const children = processComponentRenderOnMountAndUpdate(fiber);
  processComponentDidMountOnMount(fiber);
  return children;
};

export const classComponentUpdate = (fiber: MyReactFiberNode) => {
  processComponentFiberOnUpdate(fiber);
  processComponentStateFromProps(fiber);
  fiber.root.dispatch.resolveComponentQueue(fiber);
  const typedInstance = fiber.instance as MixinMyReactComponentType;
  const newElement = fiber.element;
  const { newState, isForce, callback } = typedInstance.result;
  // maybe could improve here
  typedInstance.result = DEFAULT_RESULT;
  const baseState = typedInstance.state;
  const baseProps = typedInstance.props;
  const baseContext = typedInstance.context;
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
  typedInstance.state = nextState;
  typedInstance.props = nextProps;
  typedInstance.context = nextContext;
  if (shouldUpdate) {
    const children = processComponentRenderOnMountAndUpdate(fiber);
    processComponentDidUpdateOnUpdate(fiber, {
      baseContext,
      baseProps,
      baseState,
      callback,
    });
    return { updated: true, children };
  } else {
    return { updated: false };
  }
};
