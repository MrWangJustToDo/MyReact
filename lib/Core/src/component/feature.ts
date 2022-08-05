import { nextWorkCommon } from '../core';
import {
  getContextFiber,
  getContextValue,
  processComponentUpdateQueue,
} from '../fiber';
import { globalDispatch } from '../share';

import type { Children, ClassComponent, memo } from '../element';
import type { MyReactFiberNode } from '../fiber';
import type {
  MixinMyReactComponentType,
  MyReactComponentStaticType,
} from './instance';

const processComponentStateFromProps = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as Children;

  const Component = fiber.__isDynamicNode__
    ? typedElement.type
    : (typedElement.type as ReturnType<typeof memo>).render;

  const typedComponent = Component as ClassComponent &
    MyReactComponentStaticType;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const props = Object.assign({}, typedElement.props);
  const state = Object.assign({}, typedInstance.state);

  if (typeof typedComponent.getDerivedStateFromProps === 'function') {
    const payloadState = typedComponent.getDerivedStateFromProps(props, state);
    if (payloadState) {
      typedInstance.state = Object.assign(
        {},
        typedInstance.state,
        payloadState
      );
    }
  }
};

const processComponentInstanceOnMount = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as Children;

  const Component = fiber.__isDynamicNode__
    ? typedElement.type
    : (typedElement.type as ReturnType<typeof memo>).render;

  const typedComponent = Component as ClassComponent &
    MyReactComponentStaticType;

  const ProviderFiber = getContextFiber(fiber, typedComponent.contextType);

  const context = getContextValue(ProviderFiber, typedComponent.contextType);

  const props = Object.assign({}, typedElement.props);

  const instance = new typedComponent(props, context);

  instance.props = props;

  instance.context = context;

  fiber.installInstance(instance);

  instance.setFiber(fiber);

  instance.setContext(ProviderFiber);
};

const processComponentFiberOnUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;
  typedInstance.setFiber(fiber);
};

const processComponentRenderOnMountAndUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const children = typedInstance.render();

  fiber.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
};

const processComponentDidMountOnMount = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  if (typedInstance.componentDidMount && !typedInstance.__pendingEffect__) {
    typedInstance.__pendingEffect__ = true;
    globalDispatch.current.pendingLayoutEffect(fiber, () => {
      typedInstance.__pendingEffect__ = false;
      typedInstance.componentDidMount?.();
    });
  }
};

const processComponentContextOnUpdate = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as Children;

  const Component = fiber.__isDynamicNode__
    ? typedElement.type
    : (typedElement.type as ReturnType<typeof memo>).render;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const typedComponent = Component as ClassComponent &
    MyReactComponentStaticType;

  if (!typedInstance?.__context__ || !typedInstance.__context__.mount) {
    const ProviderFiber = getContextFiber(fiber, typedComponent.contextType);

    const context = getContextValue(ProviderFiber, typedComponent.contextType);

    typedInstance?.setContext(ProviderFiber);

    return context;
  } else {
    const context = getContextValue(
      typedInstance.__context__,
      typedComponent.contextType
    );

    return context;
  }
};

const processComponentShouldUpdateOnUpdate = (
  fiber: MyReactFiberNode,
  {
    nextState,
    nextProps,
    nextContext,
  }: { nextState: unknown; nextProps: unknown; nextContext: unknown }
) => {
  const typedInstance = fiber.instance as MixinMyReactComponentType;

  if (fiber.__needTrigger__) return true;

  if (typedInstance.shouldComponentUpdate) {
    return typedInstance.shouldComponentUpdate(
      nextProps,
      nextState,
      nextContext
    );
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
  const hasEffect = typedInstance.componentDidUpdate || callback.length;

  // TODO it is necessary to use __pendingEffect__ field ?
  if (hasEffect && !typedInstance.__pendingEffect__) {
    typedInstance.__pendingEffect__ = true;
    globalDispatch.current.pendingLayoutEffect(fiber, () => {
      typedInstance.__pendingEffect__ = false;
      callback.forEach((c) => c.call(null));
      typedInstance.componentDidUpdate?.(baseProps, baseState, baseContext);
    });
  }
};

export const classComponentMount = (fiber: MyReactFiberNode) => {
  processComponentInstanceOnMount(fiber);
  processComponentStateFromProps(fiber);
  const children = processComponentRenderOnMountAndUpdate(fiber);
  processComponentDidMountOnMount(fiber);
  return children;
};

export const classComponentUpdate = (fiber: MyReactFiberNode) => {
  processComponentFiberOnUpdate(fiber);
  processComponentStateFromProps(fiber);
  const { newState, isForce, callback } = processComponentUpdateQueue(fiber);
  const typedInstance = fiber.instance as MixinMyReactComponentType;
  const baseState = typedInstance.state;
  const baseProps = typedInstance.props;
  const baseContext = typedInstance.context;
  const nextState = Object.assign({}, baseState, newState);
  const nextProps = Object.assign({}, fiber.__props__);
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
    return children;
  } else {
    return [];
  }
};
