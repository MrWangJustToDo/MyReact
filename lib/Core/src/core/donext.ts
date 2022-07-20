import { classComponentMount, classComponentUpdate } from '../component';
import {
  getContextFiber,
  getContextValue,
  processHookUpdateQueue,
} from '../fiber';
import {
  currentFunctionFiber,
  currentHookDeepIndex,
  currentRunningFiber,
  isServerRender,
  pendingAsyncModifyTopLevelFiber,
} from '../share';

import { transformChildrenFiber } from './tool';

import type { createContext, forwardRef, lazy, memo } from '../element';
import type { MyReactFiberNode } from '../fiber';
import type {
  Children,
  ClassComponent,
  FunctionComponent,
  MaybeArrayChildrenNode,
} from '../vdom';

export const nextWorkCommon = (fiber: MyReactFiberNode) => {
  if (fiber.__isRenderDynamic__) {
    return transformChildrenFiber(fiber, fiber.__dynamicChildren__);
  } else if (fiber.__children__ !== undefined) {
    return transformChildrenFiber(
      fiber,
      fiber.__children__ as MaybeArrayChildrenNode
    );
  } else {
    return [];
  }
};

const nextWorkClassComponent = (fiber: MyReactFiberNode) => {
  if (!fiber.instance) {
    return classComponentMount(fiber);
  } else {
    return classComponentUpdate(fiber);
  }
};

const nextWorkFunctionComponent = (fiber: MyReactFiberNode) => {
  processHookUpdateQueue(fiber);

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const typedElement = fiber.element as Children;

  const children = (typedElement.type as FunctionComponent)(fiber.__props__);

  currentFunctionFiber.current = null;

  currentHookDeepIndex.current = 0;

  fiber.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
};

const nextWorkComponent = (fiber: MyReactFiberNode) => {
  if (fiber.__isFunctionComponent__) {
    return nextWorkFunctionComponent(fiber);
  } else {
    return nextWorkClassComponent(fiber);
  }
};

const nextWorkMemo = (fiber: MyReactFiberNode) => {
  const { type, ref } = fiber.element as Children;

  const typedType = type as ReturnType<typeof memo>;

  const render = typedType.render;

  let isForwardRefRender = false;

  const targetRender =
    typeof render === 'object'
      ? ((isForwardRefRender = true), render.render)
      : render;

  const isClassComponent = targetRender?.prototype?.isMyReactComponent;

  if (isClassComponent) {
    return nextWorkClassComponent(fiber);
  } else {
    processHookUpdateQueue(fiber);

    currentHookDeepIndex.current = 0;

    currentFunctionFiber.current = fiber;

    const typedRender = targetRender as FunctionComponent;

    const children = isForwardRefRender
      ? typedRender(fiber.__props__, ref)
      : typedRender(fiber.__props__);

    currentFunctionFiber.current = null;

    currentHookDeepIndex.current = 0;

    fiber.__dynamicChildren__ = children;

    return nextWorkCommon(fiber);
  }
};

const nextWorkLazy = (fiber: MyReactFiberNode) => {
  const { type } = fiber.element as Children;

  const typedType = type as ReturnType<typeof lazy>;

  if (typedType._loaded === true) {
    const render = typedType.render;

    if (typeof render === 'function') {
      const isClassComponent = render.prototype.isMyReactComponent;

      if (isClassComponent) {
        return nextWorkClassComponent(fiber);
      } else {
        processHookUpdateQueue(fiber);

        currentHookDeepIndex.current = 0;

        currentFunctionFiber.current = fiber;

        const typedRender = render as FunctionComponent;

        const children = typedRender(fiber.__props__);

        currentFunctionFiber.current = null;

        currentHookDeepIndex.current = 0;

        fiber.__dynamicChildren__ = children;

        return nextWorkCommon(fiber);
      }
    } else {
      fiber.__dynamicChildren__ = render as Children;

      return nextWorkCommon(fiber);
    }
  } else if (typedType._loading === false) {
    if (!isServerRender.current) {
      typedType._loading = true;
      Promise.resolve()
        .then(() => typedType.loader())
        .then((re) => {
          const render =
            typeof re === 'object' && typeof re?.default === 'function'
              ? re.default
              : re;
          typedType._loaded = true;
          typedType._loading = false;
          typedType.render = render as ClassComponent | FunctionComponent;
          fiber.__isIgnoreHook__ = true;
          fiber.update();
        });
    }
  }

  fiber.__dynamicChildren__ = fiber.__fallback__;

  return nextWorkCommon(fiber);
};

const nextWorkForwardRef = (fiber: MyReactFiberNode) => {
  processHookUpdateQueue(fiber);

  const { type, ref } = fiber.element as Children;

  const typedType = type as ReturnType<typeof forwardRef>;

  const typedRender = typedType.render as FunctionComponent;

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = typedRender(fiber.__props__, ref);

  currentFunctionFiber.current = null;

  currentHookDeepIndex.current = 0;

  fiber.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
};

const nextWorkProvider = (fiber: MyReactFiberNode) => {
  if (fiber.__pendingContext__) {
    const allListeners = fiber.__dependence__.map((n) => n.__fiber__);

    Promise.resolve().then(() => {
      allListeners.filter((f) => f && f.mount).forEach((f) => f?.update());
    });

    fiber.__pendingContext__ = false;
  }

  return nextWorkCommon(fiber);
};

const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const { type, props } = fiber.element as Children;

  const typedType = type as ReturnType<typeof createContext>['Consumer'];

  fiber.instance = fiber.instance || new typedType.Internal();

  fiber.instance.setFiber(fiber);

  const Context = (typedType as unknown as { Context: any }).Context;

  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    const ProviderFiber = getContextFiber(fiber, Context);

    const context = getContextValue(ProviderFiber, Context);

    fiber.instance.context = context;

    fiber.instance.setContext(ProviderFiber);
  } else {
    const context = getContextValue(fiber.instance.__context__, Context);

    fiber.instance.context = context;
  }

  const typedChildren = props.children as unknown as FunctionComponent;

  const children = typedChildren(fiber.instance.context);

  fiber.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
};

const nextWorkObject = (fiber: MyReactFiberNode) => {
  if (fiber.__isMemo__) return nextWorkMemo(fiber);
  if (fiber.__isLazy__) return nextWorkLazy(fiber);
  if (fiber.__isPortal__) return nextWorkCommon(fiber);
  if (fiber.__isSuspense__) return nextWorkCommon(fiber);
  if (fiber.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.__isContextProvider__) return nextWorkProvider(fiber);
  if (fiber.__isContextConsumer__) return nextWorkConsumer(fiber);
  throw new Error(`unknown element ${fiber.element}`);
};

export const nextWorkSync = (fiber: MyReactFiberNode) => {
  if (!fiber.mount) return [];

  if (!fiber.__needUpdate__ && !fiber.__needTrigger__) return [];

  currentRunningFiber.current = fiber;

  let children: MyReactFiberNode[] = [];

  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);
  else children = nextWorkCommon(fiber);

  currentRunningFiber.current = null;

  return children;
};

export const nextWorkAsync = (fiber: MyReactFiberNode) => {
  if (!fiber.mount) return null;

  if (fiber.__needUpdate__ || fiber.__needTrigger__) {
    currentRunningFiber.current = fiber;

    if (fiber.__isDynamicNode__) nextWorkComponent(fiber);
    else if (fiber.__isObjectNode__) nextWorkObject(fiber);
    else nextWorkCommon(fiber);

    currentRunningFiber.current = null;
  }

  if (fiber.children.length) {
    return fiber.child;
  }

  let nextFiber: MyReactFiberNode | null = fiber;

  while (nextFiber && nextFiber !== pendingAsyncModifyTopLevelFiber.current) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return null;
};
