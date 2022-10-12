import { __my_react_reactive__, __my_react_internal__ } from "@my-react/react";
import { Effect_TYPE, NODE_TYPE } from "@my-react/react-shared";

import { queueJob } from "./scheduler";

import type { createReactive, MyReactElement, MyReactFiberNode, MyReactReactiveInstance as MyReactReactiveInstanceType, memo } from "@my-react/react";

const { MyReactReactiveInstance } = __my_react_reactive__;

const { currentReactiveInstance } = __my_react_internal__;

const processReactiveInstanceOnMount = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as MyReactElement;

  const globalDispatch = fiber.root.globalDispatch;

  const typedType =
    fiber.type & NODE_TYPE.__isMemo__
      ? ((typedElement.type as ReturnType<typeof memo>)["render"] as ReturnType<typeof createReactive>)
      : (typedElement.type as ReturnType<typeof createReactive>);

  const ProviderFiber = globalDispatch.resolveContextFiber(fiber, typedType.contextType);

  const context = globalDispatch.resolveContextValue(ProviderFiber, typedType.contextType);

  const props = Object.assign({}, typedElement.props);

  const instance = new MyReactReactiveInstance(props, context);

  // set global reactiveInstance, so in the `setup` function, we can get the current instance
  currentReactiveInstance.current = instance;

  instance.createSetupState(typedType.setup, typedType.render);

  instance.createEffectUpdate(() => queueJob(() => instance._ownerFiber.update()));

  currentReactiveInstance.current = null;

  instance.props = props;

  instance.context = context;

  fiber.installInstance(instance);

  instance.setOwner(fiber);

  instance.setContext(ProviderFiber);
};

const processBeforeMountHooks = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  if (typedInstance.beforeMountHooks.length) typedInstance.beforeMountHooks.forEach((f) => f?.());
};

const processReactiveRenderOnMountAndUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  const children = typedInstance.effect.run();

  return children;
};

const processReactivePropsAndContextOnActiveAndUpdate = (fiber: MyReactFiberNode) => {
  const typedElement = fiber.element as MyReactElement;

  const globalDispatch = fiber.root.globalDispatch;

  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  const typedType = typedElement.type as ReturnType<typeof createReactive>;

  const ProviderFiber = globalDispatch.resolveContextFiber(fiber, typedType.contextType);

  const context = globalDispatch.resolveContextValue(ProviderFiber, typedType.contextType);

  const props = Object.assign({}, typedElement.props);

  typedInstance.props = props;

  typedInstance.context = context;
};

const processMountedHooks = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  const globalDispatch = fiber.root.globalDispatch;

  if (typedInstance.mountedHooks.length && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;

    globalDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;

      typedInstance.mountedHooks.forEach((f) => f?.());
    });
  }
};

const processBeforeUpdateHooks = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  if (typedInstance.beforeUpdateHooks.length) typedInstance.beforeUpdateHooks.forEach((f) => f?.());
};

const processUpdatedHooks = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  const globalDispatch = fiber.root.globalDispatch;

  if (typedInstance.updatedHooks.length && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;

    globalDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;

      typedInstance.updatedHooks.forEach((f) => f?.());
    });
  }
};

const processReactiveFiberOnUpdate = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  typedInstance.effect.active();

  typedInstance.setOwner(fiber);
};

export const reactiveComponentMount = (fiber: MyReactFiberNode) => {
  processReactiveInstanceOnMount(fiber);

  processBeforeMountHooks(fiber);

  const children = processReactiveRenderOnMountAndUpdate(fiber);

  processMountedHooks(fiber);

  return children;
};

export const reactiveComponentActive = (fiber: MyReactFiberNode) => {
  processReactiveFiberOnUpdate(fiber);

  processBeforeMountHooks(fiber);

  processReactivePropsAndContextOnActiveAndUpdate(fiber);

  const children = processReactiveRenderOnMountAndUpdate(fiber);

  processMountedHooks(fiber);

  return children;
};

export const reactiveComponentUpdate = (fiber: MyReactFiberNode) => {
  processReactiveFiberOnUpdate(fiber);

  processBeforeUpdateHooks(fiber);

  processReactivePropsAndContextOnActiveAndUpdate(fiber);

  const children = processReactiveRenderOnMountAndUpdate(fiber);

  processUpdatedHooks(fiber);

  return children;
};
