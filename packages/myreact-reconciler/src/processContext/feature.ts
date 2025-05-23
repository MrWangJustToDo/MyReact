import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { include, isNormalEquals, STATE_TYPE } from "@my-react/react-shared";

import { prepareUpdateAllDependence, prepareUpdateAllDependenceFromRoot } from "../dispatchContext";
import { getInstanceContextFiber, initInstance, setContextForInstance, setOwnerForInstance } from "../runtimeGenerate";
import { currentRenderDispatch, safeCallWithCurrentFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { createContext, MyReactFunctionComponent } from "@my-react/react";

const { currentComponentFiber, MyReactInternalInstance } = __my_react_internal__;
const { enableLoopFromRoot } = __my_react_shared__;

export const processProvider = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  if (renderDispatch.isAppMounted) {
    const prevProps = fiber.memoizedProps.value;

    const nextProps = fiber.pendingProps.value;

    if (!isNormalEquals(prevProps as Record<string, unknown>, nextProps as Record<string, unknown>)) {
      if (enableLoopFromRoot.current) {
        prepareUpdateAllDependence(renderDispatch, fiber, prevProps, nextProps);
      } else {
        renderDispatch.pendingLayoutEffect(fiber, function invokePrepareUpdateAllDependenceFromRoot() {
          prepareUpdateAllDependenceFromRoot(renderDispatch, fiber, prevProps, nextProps);
        });
      }
    }
  }
};

export const processConsumer = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];

  const isUpdate = !!fiber.instance;

  fiber.instance = fiber.instance || new MyReactInternalInstance();

  !isUpdate && initInstance(fiber.instance);

  setOwnerForInstance(fiber.instance, fiber);

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

    setContextForInstance(fiber.instance, contextFiber);

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
