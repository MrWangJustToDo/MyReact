import { __my_react_internal__ } from "@my-react/react";
import { include, isNormalEquals, STATE_TYPE } from "@my-react/react-shared";

import { prepareUpdateAllDependence } from "../dispatchContext";
import { getInstanceContextFiber, initInstance, setContextForInstance, setOwnerForInstance } from "../runtimeGenerate";
import { safeCallWithCurrentFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { createContext, MyReactFunctionComponent } from "@my-react/react";

const { currentComponentFiber, MyReactInternalInstance } = __my_react_internal__;

export const processProvider = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (renderDispatch.isAppMounted) {
    const prevProps = fiber.memoizedProps.value;

    const nextProps = fiber.pendingProps.value;

    if (!isNormalEquals(prevProps as Record<string, unknown>, nextProps as Record<string, unknown>)) {
      prepareUpdateAllDependence(renderDispatch, fiber, prevProps, nextProps);
    }
  }
};

export const processConsumer = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];

  const isUpdate = !!fiber.instance;

  fiber.instance = fiber.instance || new MyReactInternalInstance();

  !isUpdate && initInstance(fiber.instance);

  !isUpdate && setOwnerForInstance(fiber.instance, fiber);

  const Context = typedElementType.Context as ReturnType<typeof createContext>;

  currentComponentFiber.current = fiber;

  const contextFiber = getInstanceContextFiber(fiber.instance);

  let finalContext = null;

  if (!contextFiber || include(contextFiber.state, STATE_TYPE.__unmount__)) {
    const providerFiber = renderDispatch.resolveContextFiber(fiber, Context);

    const context = renderDispatch.resolveContextValue(providerFiber, Context);

    finalContext = context;

    setContextForInstance(fiber.instance, providerFiber);
  } else {
    const context = renderDispatch.resolveContextValue(contextFiber, Context);

    finalContext = context;
  }

  const typedChildren = fiber.pendingProps.children as MyReactFunctionComponent;

  const children = safeCallWithCurrentFiber({
    fiber,
    action: function safeCallConsumerChildren() {
      return typedChildren(finalContext);
    },
  });

  currentComponentFiber.current = null;

  return children;
};
