import { ForwardRef, isValidElement, Reactive, __my_react_internal__ } from "@my-react/react";
import { NODE_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import { classComponentActive, classComponentMount, classComponentUpdate } from "../component";
import { reactiveComponentActive, reactiveComponentMount, reactiveComponentUpdate } from "../reactive";
import { defaultResolveLazyElement } from "../share";

import { transformChildrenFiber, transformKeepLiveChildrenFiber } from "./generate";

import type { ReconcilerLoopController } from "../update";
import type {
  MyReactElement,
  MyReactFiberNode,
  MyReactFiberNodeDev,
  MyReactFunctionComponent,
  MaybeArrayMyReactElementNode,
  memo,
  forwardRef,
  createContext,
  MyReactElementNode,
  MixinMyReactFunctionComponent,
} from "@my-react/react";

const { currentHookDeepIndex, currentFunctionFiber, currentRunningFiber, currentComponentFiber } = __my_react_internal__;

export const nextWorkCommon = (fiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  const childrenFiber = transformChildrenFiber(fiber, children);

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugDynamicChildren = children;
  }

  return childrenFiber;
};

export const nextWorkClassComponent = (fiber: MyReactFiberNode) => {
  if (!fiber.instance) {
    const children = classComponentMount(fiber);

    return nextWorkCommon(fiber, children);
  } else if (!fiber.activated) {
    const children = classComponentActive(fiber);

    return nextWorkCommon(fiber, children);
  } else {
    const { updated, children } = classComponentUpdate(fiber);

    if (updated) {
      return nextWorkCommon(fiber, children);
    } else {
      fiber.afterUpdate();

      return [];
    }
  }
};

export const nextWorkFunctionComponent = (fiber: MyReactFiberNode) => {
  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const typedElement = fiber.element as MyReactElement;

  const typedType = typedElement.type as MyReactFunctionComponent;

  const children = typedType(typedElement.props);

  currentFunctionFiber.current = null;

  currentHookDeepIndex.current = 0;

  return nextWorkCommon(fiber, children);
};

export const nextWorkComponent = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isFunctionComponent__) {
    currentComponentFiber.current = fiber;

    const res = nextWorkFunctionComponent(fiber);

    currentComponentFiber.current = null;

    return res;
  } else {
    currentComponentFiber.current = fiber;

    const res = nextWorkClassComponent(fiber);

    currentComponentFiber.current = null;

    return res;
  }
};

export const nextWorkMemo = (fiber: MyReactFiberNode) => {
  const { type, ref, props } = fiber.element as MyReactElement;

  const typedType = type as ReturnType<typeof memo>;

  const targetRender = typedType.render;

  if (typeof targetRender === "object") {
    if (targetRender.$$typeof === ForwardRef) {
      const typedTargetRender = targetRender as ReturnType<typeof forwardRef>;

      const forwardRefRender = typedTargetRender.render;

      currentComponentFiber.current = fiber;

      currentHookDeepIndex.current = 0;

      // support hook for forwardRef render function
      currentFunctionFiber.current = fiber;

      const children = forwardRefRender(props, ref);

      currentFunctionFiber.current = null;

      currentHookDeepIndex.current = 0;

      currentComponentFiber.current = null;

      return nextWorkCommon(fiber, children);
    }

    if (targetRender.$$typeof === Reactive) {
      currentComponentFiber.current = fiber;

      const res = nextWorkReactive(fiber);

      currentComponentFiber.current = fiber;

      return res;
    }

    throw new Error("unSupport memo() usage");
  }

  if (typeof targetRender === "function") {
    const isClassComponent = targetRender?.prototype?.isMyReactComponent;
    if (isClassComponent) {
      currentComponentFiber.current = fiber;

      const res = nextWorkClassComponent(fiber);

      currentComponentFiber.current = null;

      return res;
    } else {
      const typedTargetRender = targetRender as MixinMyReactFunctionComponent;

      currentComponentFiber.current = fiber;

      currentHookDeepIndex.current = 0;

      currentFunctionFiber.current = fiber;

      const children = typedTargetRender(props);

      currentFunctionFiber.current = null;

      currentHookDeepIndex.current = 0;

      currentComponentFiber.current = null;

      return nextWorkCommon(fiber, children);
    }
  }

  throw new Error("unSupport memo() usage");
};

export const nextWorkLazy = (fiber: MyReactFiberNode) => {
  const children = defaultResolveLazyElement(fiber);

  return nextWorkCommon(fiber, children);
};

export const nextWorkLazySync = async (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const children = await globalDispatch.resolveLazyElement(fiber);

  return nextWorkCommon(fiber, children);
};

export const nextWorkReactive = (fiber: MyReactFiberNode) => {
  if (!fiber.instance) {
    const children = reactiveComponentMount(fiber);

    return nextWorkCommon(fiber, children);
  } else if (!fiber.activated) {
    const children = reactiveComponentActive(fiber);

    return nextWorkCommon(fiber, children);
  } else {
    const children = reactiveComponentUpdate(fiber);

    return nextWorkCommon(fiber, children);
  }
};

export const nextWorkReactiveComponent = (fiber: MyReactFiberNode) => {
  currentComponentFiber.current = fiber;

  const res = nextWorkReactive(fiber);

  currentComponentFiber.current = null;

  return res;
};

export const nextWorkForwardRef = (fiber: MyReactFiberNode) => {
  currentComponentFiber.current = fiber;

  const { type, ref, props } = fiber.element as MyReactElement;

  const typedType = type as ReturnType<typeof forwardRef>;

  const typedRender = typedType.render;

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = typedRender(props, ref);

  currentFunctionFiber.current = null;

  currentHookDeepIndex.current = 0;

  currentComponentFiber.current = null;

  return nextWorkCommon(fiber, children);
};

export const nextWorkNormal = (fiber: MyReactFiberNode) => {
  if (isValidElement(fiber.element)) {
    const { props } = fiber.element;

    const { children } = props;

    const childrenFiber = transformChildrenFiber(fiber, children);

    return childrenFiber;
  } else {
    fiber.afterUpdate();

    return [];
  }
};

export const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const { type, props } = fiber.element as MyReactElement;

  const typedType = type as ReturnType<typeof createContext>["Consumer"];

  fiber.instance = fiber.instance || new typedType.Internal();

  fiber.instance.setOwner(fiber);

  const Context = typedType.Context as ReturnType<typeof createContext>;

  currentComponentFiber.current = fiber;

  // for deactivated context fiber, maybe will not update children context, but all the children has deactivated, so it will not matter
  if (!fiber.instance._contextFiber || !fiber.instance._contextFiber.mounted) {
    const ProviderFiber = globalDispatch.resolveContextFiber(fiber, Context);

    const context = globalDispatch.resolveContextValue(ProviderFiber, Context);

    fiber.instance.context = context;

    fiber.instance.setContext(ProviderFiber);
  } else {
    const context = globalDispatch.resolveContextValue(fiber.instance._contextFiber, Context);

    fiber.instance.context = context;
  }

  const typedChildren = props.children as (p: any) => MyReactElementNode;

  const children = typedChildren(fiber.instance.context);

  currentComponentFiber.current = null;

  return nextWorkCommon(fiber, children);
};

export const nextWorkObject = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isMemo__) return nextWorkMemo(fiber);
  if (fiber.type & NODE_TYPE.__isLazy__) return nextWorkLazy(fiber);
  if (fiber.type & NODE_TYPE.__isPortal__) return nextWorkNormal(fiber);
  if (fiber.type & NODE_TYPE.__isReactive__) return nextWorkReactiveComponent(fiber);
  if (fiber.type & NODE_TYPE.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.type & NODE_TYPE.__isContextProvider__) return nextWorkNormal(fiber);
  if (fiber.type & NODE_TYPE.__isContextConsumer__) return nextWorkConsumer(fiber);
  throw new Error(`unknown element ${fiber.element}`);
};

export const nextWorkKeepLive = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  globalDispatch.resolveKeepLiveMap(fiber);

  const typedElement = fiber.element as MyReactElement;

  const children = typedElement.props.children as MyReactElementNode;

  return transformKeepLiveChildrenFiber(fiber, children);
};

export const nextWorkSync = (fiber: MyReactFiberNode) => {
  if (!fiber.mounted) return [];

  if (fiber.invoked && !(fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__))) return [];

  currentRunningFiber.current = fiber;

  let children: MyReactFiberNode[] = [];

  if (fiber.type & NODE_TYPE.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.type & NODE_TYPE.__isObjectNode__) children = nextWorkObject(fiber);
  else if (fiber.type & NODE_TYPE.__isKeepLiveNode__) children = nextWorkKeepLive(fiber);
  else children = nextWorkNormal(fiber);

  fiber.invoked = true;

  fiber.activated = true;

  currentRunningFiber.current = null;

  return children;
};

export const nextWorkSyncAwait = async (fiber: MyReactFiberNode) => {
  if (!fiber.mounted) return [];

  if (fiber.invoked && !(fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__))) return [];

  currentRunningFiber.current = fiber;

  let children: MyReactFiberNode[] = [];

  if (fiber.type & NODE_TYPE.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.type & NODE_TYPE.__isLazy__) children = await nextWorkLazySync(fiber);
  else if (fiber.type & NODE_TYPE.__isObjectNode__) children = nextWorkObject(fiber);
  else if (fiber.type & NODE_TYPE.__isKeepLiveNode__) children = nextWorkKeepLive(fiber);
  else children = nextWorkNormal(fiber);

  fiber.invoked = true;

  fiber.activated = true;

  currentRunningFiber.current = null;

  return children;
};

export const nextWorkAsync = (fiber: MyReactFiberNode, loopController: ReconcilerLoopController) => {
  if (!fiber.mounted) return null;

  if (!fiber.invoked || fiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__)) {
    currentRunningFiber.current = fiber;

    if (fiber.type & NODE_TYPE.__isDynamicNode__) nextWorkComponent(fiber);
    else if (fiber.type & NODE_TYPE.__isObjectNode__) nextWorkObject(fiber);
    else if (fiber.type & NODE_TYPE.__isKeepLiveNode__) nextWorkKeepLive(fiber);
    else nextWorkNormal(fiber);

    fiber.invoked = true;

    fiber.activated = true;

    currentRunningFiber.current = null;

    if (fiber.children.length) {
      return fiber.child;
    }
  }

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== loopController.getTopLevel()) {
    loopController.getUpdateList(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === loopController.getTopLevel()) {
    loopController.getUpdateList(nextFiber);
  }

  return null;
};
