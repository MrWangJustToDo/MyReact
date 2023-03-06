import { __my_react_reactive__, __my_react_internal__ } from "@my-react/react";
import { Effect_TYPE, NODE_TYPE } from "@my-react/react-shared";

// import { queueJob } from "./scheduler";

import type { RenderDispatch } from "../dispatch";
import type { createReactive, MyReactFiberNode, MyReactReactiveInstance as MyReactReactiveInstanceType, memo } from "@my-react/react";

const {
  MyReactReactiveInstance,
  reactiveApi: { pauseTracking, pauseTrigger, resetTracking, resetTrigger },
} = __my_react_reactive__;

const { currentReactiveInstance } = __my_react_internal__;

const processReactiveInstanceOnMount = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const typedType =
    fiber.type & NODE_TYPE.__isMemo__
      ? ((fiber.elementType as ReturnType<typeof memo>)["render"] as ReturnType<typeof createReactive>)
      : (fiber.elementType as ReturnType<typeof createReactive>);

  const ProviderFiber = renderDispatch.resolveContextFiber(fiber, typedType.contextType);

  const context = renderDispatch.resolveContextValue(ProviderFiber, typedType.contextType);

  const props = Object.assign({}, fiber.pendingProps);

  const instance = new MyReactReactiveInstance(props, context);

  // set global reactiveInstance, so in the `setup` function, we can get the current instance
  currentReactiveInstance.current = instance;

  instance.createSetupState(typedType.setup, typedType.render);

  instance.createEffectUpdate(() => instance._ownerFiber.update());

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
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  const typedType =
    fiber.type & NODE_TYPE.__isMemo__
      ? ((fiber.elementType as ReturnType<typeof memo>)["render"] as ReturnType<typeof createReactive>)
      : (fiber.elementType as ReturnType<typeof createReactive>);

  if (typedType.contextType) {
    if (!typedInstance?._contextFiber || !typedInstance._contextFiber.isMounted) {
      const ProviderFiber = renderDispatch.resolveContextFiber(fiber, typedType.contextType);

      const context = renderDispatch.resolveContextValue(ProviderFiber, typedType.contextType);

      typedInstance?.setContext(ProviderFiber);

      typedInstance.context = context;
    } else {
      const context = renderDispatch.resolveContextValue(typedInstance._contextFiber, typedType.contextType);

      typedInstance?.setContext(typedInstance._contextFiber);

      typedInstance.context = context;
    }
  }

  const props = Object.assign({}, fiber.pendingProps);

  typedInstance.props = props;
};

const processMountedHooks = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  if (typedInstance.mountedHooks.length && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;

    renderDispatch.pendingLayoutEffect(fiber, () => {
      typedInstance.mode = Effect_TYPE.__initial__;

      typedInstance.mountedHooks.forEach((f) => f?.());
    });
  }
};

const processBeforeUpdateHooks = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  if (typedInstance.beforeUpdateHooks.length) {
    // disable reactive for beforeUpdate hook
    pauseTracking();
    pauseTrigger();
    typedInstance.beforeUpdateHooks.forEach((f) => f?.());
    resetTrigger();
    resetTracking();
  }
};

const processUpdatedHooks = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactReactiveInstanceType;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  if (typedInstance.updatedHooks.length && !(typedInstance.mode & Effect_TYPE.__pendingEffect__)) {
    typedInstance.mode = Effect_TYPE.__pendingEffect__;

    renderDispatch.pendingLayoutEffect(fiber, () => {
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
