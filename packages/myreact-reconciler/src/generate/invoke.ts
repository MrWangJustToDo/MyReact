import { createElement, isValidElement, __my_react_internal__ } from "@my-react/react";

import { classComponentMount, classComponentUpdate } from "../component";

import { transformChildrenFiber } from "./generate";

import type {
  MyReactElement,
  MyReactFiberNode,
  MyReactFiberNodeDev,
  MyReactClassComponent,
  MyReactFunctionComponent,
  MaybeArrayMyReactElementNode,
  memo,
  lazy,
  createContext,
  forwardRef,
} from "@my-react/react";

const {
  currentHookDeepIndex,
  currentFunctionFiber,
  currentRunningFiber,
  currentComponentFiber,
  NODE_TYPE,
  UPDATE_TYPE,
} = __my_react_internal__;

export const nextWorkCommon = (fiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  const childrenFiber = transformChildrenFiber(fiber, children);

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugDynamicChildren = children;
  }

  return childrenFiber;
};

const nextWorkClassComponent = (fiber: MyReactFiberNode) => {
  if (!fiber.instance) {
    const children = classComponentMount(fiber);
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

const nextWorkFunctionComponent = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.dispatch;

  globalDispatch.resolveHookQueue(fiber);

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const typedElement = fiber.element as MyReactElement;

  const typedType = typedElement.type as MyReactFunctionComponent;

  const children = typedType(typedElement.props);

  currentFunctionFiber.current = null;

  currentHookDeepIndex.current = 0;

  return nextWorkCommon(fiber, children);
};

const nextWorkComponent = (fiber: MyReactFiberNode) => {
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

const nextWorkMemo = (fiber: MyReactFiberNode) => {
  const { type, ref, props } = fiber.element as MyReactElement;

  const typedType = type as ReturnType<typeof memo>;

  const render = typedType.render;

  let isForwardRefRender = false;

  const targetRender = typeof render === "object" ? ((isForwardRefRender = true), render.render) : render;

  const isClassComponent = targetRender?.prototype?.isMyReactComponent;

  if (isClassComponent) {
    currentComponentFiber.current = fiber;

    const res = nextWorkClassComponent(fiber);

    currentComponentFiber.current = null;

    return res;
  } else {
    const globalDispatch = fiber.root.dispatch;

    currentComponentFiber.current = fiber;

    globalDispatch.resolveHookQueue(fiber);

    currentHookDeepIndex.current = 0;

    currentFunctionFiber.current = fiber;

    const typedRender = targetRender as MyReactFunctionComponent;

    const children = isForwardRefRender ? typedRender(props, ref) : typedRender(props);

    currentFunctionFiber.current = null;

    currentHookDeepIndex.current = 0;

    currentComponentFiber.current = null;

    return nextWorkCommon(fiber, children);
  }
};

const nextWorkLazy = (fiber: MyReactFiberNode) => {
  const { type, props } = fiber.element as MyReactElement;

  const globalDispatch = fiber.root.dispatch;

  const typedType = type as ReturnType<typeof lazy>;

  if (typedType._loaded === true) {
    const render = typedType.render as MyReactClassComponent | MyReactFunctionComponent;

    const children = createElement(render, props);

    return nextWorkCommon(fiber, children);
  } else if (typedType._loading === false) {
    if (globalDispatch.resolveLazy()) {
      typedType._loading = true;
      Promise.resolve()
        .then(() => typedType.loader())
        .then((re) => {
          const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;
          typedType._loaded = true;
          typedType._loading = false;
          typedType.render = render as MyReactClassComponent | MyReactFunctionComponent;
          fiber.update();
        });
    }
  }

  const children = globalDispatch.resolveSuspenseElement(fiber);

  return nextWorkCommon(fiber, children);
};

const nextWorkForwardRef = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.dispatch;

  currentComponentFiber.current = fiber;

  globalDispatch.resolveHookQueue(fiber);

  const { type, ref, props } = fiber.element as MyReactElement;

  const typedType = type as ReturnType<typeof forwardRef>;

  const typedRender = typedType.render as MyReactFunctionComponent;

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = typedRender(props, ref);

  currentFunctionFiber.current = null;

  currentHookDeepIndex.current = 0;

  currentComponentFiber.current = null;

  return nextWorkCommon(fiber, children);
};

const nextWorkNormal = (fiber: MyReactFiberNode) => {
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

const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.dispatch;

  const { type, props } = fiber.element as MyReactElement;

  const typedType = type as ReturnType<typeof createContext>["Consumer"];

  fiber.instance = fiber.instance || new typedType.Internal();

  fiber.instance.setOwner(fiber);

  const Context = typedType.Context as ReturnType<typeof createContext>;

  currentComponentFiber.current = fiber;

  if (!fiber.instance._contextFiber || !fiber.instance._contextFiber.mount) {
    const ProviderFiber = globalDispatch.resolveContextFiber(fiber, Context);

    const context = globalDispatch.resolveContextValue(ProviderFiber, Context);

    fiber.instance.context = context;

    fiber.instance.setContext(ProviderFiber);
  } else {
    const context = globalDispatch.resolveContextValue(fiber.instance._contextFiber, Context);

    fiber.instance.context = context;
  }

  const typedChildren = props.children as unknown as MyReactFunctionComponent;

  const children = typedChildren(fiber.instance.context);

  currentComponentFiber.current = null;

  return nextWorkCommon(fiber, children);
};

const nextWorkObject = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isMemo__) return nextWorkMemo(fiber);
  if (fiber.type & NODE_TYPE.__isLazy__) return nextWorkLazy(fiber);
  if (fiber.type & NODE_TYPE.__isPortal__) return nextWorkNormal(fiber);
  if (fiber.type & NODE_TYPE.__isSuspense__) return nextWorkNormal(fiber);
  if (fiber.type & NODE_TYPE.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.type & NODE_TYPE.__isContextProvider__) return nextWorkNormal(fiber);
  if (fiber.type & NODE_TYPE.__isContextConsumer__) return nextWorkConsumer(fiber);
  throw new Error(`unknown element ${fiber.element}`);
};

export const nextWorkSync = (fiber: MyReactFiberNode) => {
  if (!fiber.mount) return [];

  if (!(fiber.mode & (UPDATE_TYPE.__run__ | UPDATE_TYPE.__trigger__))) return [];

  currentRunningFiber.current = fiber;

  let children: MyReactFiberNode[] = [];

  if (fiber.type & NODE_TYPE.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.type & NODE_TYPE.__isObjectNode__) children = nextWorkObject(fiber);
  else children = nextWorkNormal(fiber);

  fiber.invoked = true;

  currentRunningFiber.current = null;

  return children;
};

export const nextWorkAsync = (fiber: MyReactFiberNode, topLevelFiber: MyReactFiberNode | null) => {
  if (!fiber.mount) return null;

  if (fiber.mode & UPDATE_TYPE.__run__ || fiber.mode & UPDATE_TYPE.__trigger__) {
    currentRunningFiber.current = fiber;

    if (fiber.type & NODE_TYPE.__isDynamicNode__) nextWorkComponent(fiber);
    else if (fiber.type & NODE_TYPE.__isObjectNode__) nextWorkObject(fiber);
    else nextWorkNormal(fiber);

    currentRunningFiber.current = null;

    fiber.invoked = true;

    if (fiber.children.length) {
      return fiber.child;
    }
  }

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== topLevelFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return null;
};
