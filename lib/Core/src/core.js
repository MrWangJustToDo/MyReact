import { classComponentMount, classComponentUpdate } from "./component.js";
import {
  currentFunctionFiber,
  currentRunningFiber,
  currentHookDeepIndex,
  isMounted,
  enableKeyDiff,
} from "./env.js";
import {
  createFiberNodeWithUpdate,
  createFiberNodeWithPosition,
  createFiberNodeWithUpdateAndPosition,
  MyReactFiberNode,
  updateFiberNodeWithPosition,
} from "./fiber.js";
import { isEqual, isNormalEqual } from "./tools.js";
import { pushUnmount } from "./unmount.js";
import { MyReactVDom } from "./vdom.js";

/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 * @param {MyReactFiberNode | MyReactFiberNode[]} matchedPreviousRenderChild
 * @param {boolean} isSameType
 * @returns
 */
function getNewFiberWithUpdate(
  newVDom,
  parentFiber,
  previousRenderChild,
  matchedPreviousRenderChild,
  isSameType
) {
  if (isSameType) {
    if (Array.isArray(newVDom)) {
      matchedPreviousRenderChild = getMatchedRenderChildren(
        newVDom,
        matchedPreviousRenderChild
      );
      if (newVDom.length < matchedPreviousRenderChild.length) {
        pushUnmount(matchedPreviousRenderChild.slice(newVDom.length));
      }
      return newVDom.map((v, index) =>
        getNewFiberWithUpdate(
          v,
          parentFiber,
          previousRenderChild[index],
          matchedPreviousRenderChild[index],
          isSameTypeNode(v, matchedPreviousRenderChild[index])
        )
      );
    }

    if (matchedPreviousRenderChild === null) return null;

    // 相同的引用  不会重新运行
    if (Object.is(matchedPreviousRenderChild.__vdom__, newVDom)) {
      return updateFiberNodeWithPosition(
        matchedPreviousRenderChild,
        parentFiber,
        previousRenderChild,
        newVDom
      );
    }

    // 更新dom节点
    if (
      matchedPreviousRenderChild.__isPlainNode__ &&
      isEqual(matchedPreviousRenderChild.__vdom__.props, newVDom.props)
    ) {
      return updateFiberNodeWithPosition(
        matchedPreviousRenderChild,
        parentFiber,
        previousRenderChild,
        newVDom
      );
    }

    if (
      matchedPreviousRenderChild.__isMemo__ &&
      isNormalEqual(matchedPreviousRenderChild.__vdom__.props, newVDom.props)
    ) {
      return updateFiberNodeWithPosition(
        matchedPreviousRenderChild,
        parentFiber,
        previousRenderChild,
        newVDom
      );
    }

    // 优化Provider更新，方法之一
    if (
      matchedPreviousRenderChild.__isContextProvider__ &&
      isNormalEqual(
        matchedPreviousRenderChild.__vdom__.props.value,
        newVDom.props.value
      )
    ) {
      return updateFiberNodeWithPosition(
        matchedPreviousRenderChild,
        parentFiber,
        previousRenderChild,
        newVDom
      );
    }

    return createFiberNodeWithUpdateAndPosition(
      {
        fiberParent: parentFiber,
        deepIndex: parentFiber.deepIndex + 1,
        // skip commit
        fiberAlternate: matchedPreviousRenderChild.__pendingUpdate__
          ? matchedPreviousRenderChild.fiberAlternate
          : matchedPreviousRenderChild,
        dom: matchedPreviousRenderChild.dom,
        hookHead: matchedPreviousRenderChild.hookHead,
        hookFoot: matchedPreviousRenderChild.hookFoot,
        hookList: matchedPreviousRenderChild.hookList,
        listeners: matchedPreviousRenderChild.listeners,
        instance: matchedPreviousRenderChild.instance,
        effect:
          matchedPreviousRenderChild.__isTextNode__ ||
          matchedPreviousRenderChild.__isPlainNode__
            ? "UPDATE"
            : null,
      },
      {
        newVDom: newVDom === false || newVDom === null ? "" : newVDom,
        previousRenderFiber: previousRenderChild,
      }
    );
  }

  if (matchedPreviousRenderChild) {
    pushUnmount(matchedPreviousRenderChild);
  }

  if (Array.isArray(newVDom)) {
    return newVDom.map((v) =>
      getNewFiberWithUpdate(v, parentFiber, null, null, false)
    );
  }

  if (newVDom === undefined) return null;

  return createFiberNodeWithPosition(
    {
      fiberParent: parentFiber,
      deepIndex: parentFiber.deepIndex + 1,
      effect: newVDom?.__isPortal__ ? "PORTAL" : "PLACEMENT",
    },
    {
      newVDom: newVDom === false || newVDom === null ? "" : newVDom,
      previousRenderFiber: previousRenderChild,
    }
  );
}

/**
 *
 * @param {MyReactVDom} newVDom
 * @param {MyReactFiberNode} parentFiber
 */
function getNewFiberWithInitial(newVDom, parentFiber) {
  if (Array.isArray(newVDom)) {
    return newVDom.map((v) => getNewFiberWithInitial(v, parentFiber));
  }

  if (newVDom === undefined) return null;

  return createFiberNodeWithUpdate(
    {
      fiberParent: parentFiber,
      deepIndex: parentFiber.deepIndex + 1,
      effect: newVDom?.__isPortal__ ? "PORTAL" : "PLACEMENT",
    },
    newVDom === false || newVDom === null ? "" : newVDom
  );
}

/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 */
function isSameTypeNode(newVDom, previousRenderChild) {
  if (Array.isArray(newVDom) && Array.isArray(previousRenderChild)) return true;
  const previousRenderChildVDom = previousRenderChild?.__vdom__;
  if (
    newVDom instanceof MyReactVDom &&
    previousRenderChildVDom instanceof MyReactVDom
  ) {
    if (enableKeyDiff.current && newVDom.key !== previousRenderChildVDom.key)
      return false;
    if (newVDom.__isDynamicNode__ || newVDom.__isPlainNode__)
      return newVDom.type === previousRenderChildVDom.type;
    if (newVDom.__isObjectNode__)
      // cause hook error
      return (
        previousRenderChildVDom.__isObjectNode__ &&
        newVDom.type.type === previousRenderChildVDom.type.type
      );
    if (newVDom.__isEmptyNode__) return previousRenderChildVDom.__isEmptyNode__;
    if (newVDom.__isFragmentNode__)
      return previousRenderChildVDom.__isFragmentNode__;
  }
  if (newVDom instanceof MyReactVDom) return false;
  if (previousRenderChildVDom instanceof MyReactVDom) return false;
  if (typeof newVDom !== "object")
    return previousRenderChild && previousRenderChild.__isTextNode__;
  if (newVDom === null) return previousRenderChild === null;
  return false;
}

/**
 *
 * @param {MyReactVDom[]} newChildren
 * @param {MyReactFiberNode[]} previousRenderChildren
 */
function getMatchedRenderChildren(newChildren, previousRenderChildren) {
  if (!isMounted.current) return previousRenderChildren;
  if (!enableKeyDiff.current) return previousRenderChildren;
  const tempRenderChildren = previousRenderChildren.slice(0);
  const assignPreviousRenderChildren = Array(tempRenderChildren.length).fill(
    null
  );
  newChildren.forEach((vdom, index) => {
    if (tempRenderChildren.length) {
      if (vdom instanceof MyReactVDom && vdom.key !== undefined) {
        const targetIndex = tempRenderChildren.findIndex(
          (fiber) => fiber instanceof MyReactFiberNode && fiber.key === vdom.key
        );
        if (targetIndex !== -1) {
          assignPreviousRenderChildren[index] = tempRenderChildren[targetIndex];
          tempRenderChildren.splice(targetIndex, 1);
        }
      }
    }
  });

  return assignPreviousRenderChildren.map((v) => {
    if (v) return v;
    return tempRenderChildren.shift();
  });
}

/**
 *
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactVDom[]} children
 */
function transformChildrenFiber(parentFiber, _children) {
  let index = 0;

  const isNewChildren = !Boolean(parentFiber.fiberAlternate);

  const children = Array.isArray(_children) ? _children : [_children];

  const previousRenderChildren =
    parentFiber.fiberAlternate?.__renderedChildren__ || [];

  const assignPreviousRenderChildren = getMatchedRenderChildren(
    children,
    previousRenderChildren
  );

  parentFiber.reset();

  while (index < children.length || index < previousRenderChildren.length) {
    const newChild = children[index];

    const previousRenderChild = previousRenderChildren[index];

    const assignPreviousRenderChild = assignPreviousRenderChildren[index];

    const isSameType =
      isMounted.current && isSameTypeNode(newChild, assignPreviousRenderChild);

    const newFiber = isNewChildren
      ? getNewFiberWithInitial(newChild, parentFiber)
      : getNewFiberWithUpdate(
          newChild,
          parentFiber,
          previousRenderChild,
          assignPreviousRenderChild,
          isSameType
        );

    parentFiber.__renderedChildren__.push(newFiber);

    index++;
  }

  return parentFiber.children;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkFunctionComponent(fiber) {
  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = fiber.__vdom__.type(fiber.__vdom__.props);

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = null;

  fiber.__vdom__.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkClassComponent(fiber) {
  if (!fiber.instance) {
    return classComponentMount(fiber);
  } else {
    return classComponentUpdate(fiber);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkComponent(fiber) {
  if (fiber.initial || fiber.__needUpdate__) {
    if (fiber.__isFunctionComponent__) {
      return nextWorkFunctionComponent(fiber);
    } else {
      return nextWorkClassComponent(fiber);
    }
  }
  return [];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkCommon(fiber) {
  if (fiber.__vdom__.__dynamicChildren__ !== null) {
    return transformChildrenFiber(fiber, fiber.__vdom__.__dynamicChildren__);
  }

  if (fiber.__vdom__.children !== undefined) {
    return transformChildrenFiber(fiber, fiber.__vdom__.children);
  }
  return [];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkForwardRef(fiber) {
  const { render } = fiber.__vdom__.type;

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = render(fiber.__vdom__.props, fiber.__vdom__.ref);

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = null;

  fiber.__vdom__.__dynamicChildren__ = children;

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkProvider(fiber) {
  // maybe need other way to get provider state
  if (fiber.initial) {
    const listenerFibers = fiber.listeners.map((it) => it.__fiber__);
    // update only alive fiber
    Promise.resolve().then(() =>
      listenerFibers.filter((f) => f.mount).forEach((f) => f.update())
    );
  }
  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkConsumer(fiber) {
  if (!fiber.instance) {
    fiber.instance = new fiber.__vdom__.type.Internal();
  }
  fiber.instance.updateDependence(fiber);
  if (!fiber.instance.__context__ || !fiber.instance.__context__.mount) {
    const providerFiber = fiber.instance.processContext(
      fiber.__vdom__.type.Context
    );
    fiber.instance.context = providerFiber.__vdom__.props.value;
  }

  fiber.__vdom__.__dynamicChildren__ = fiber.__vdom__.children(
    fiber.instance.context
  );

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkMemo(fiber) {
  // 对于memo组件，只有当前fiber需要运行时才运行
  if (fiber.initial || fiber.__needUpdate__) {
    const { render: _render, isMyReactForwardRefRender } = fiber.__vdom__.type;

    const render = isMyReactForwardRefRender ? _render.render : _render;

    currentHookDeepIndex.current = 0;

    currentFunctionFiber.current = fiber;

    const children = isMyReactForwardRefRender
      ? render(fiber.__vdom__.props, fiber.__vdom__.ref)
      : render(fiber.__vdom__.props);

    currentHookDeepIndex.current = 0;

    currentFunctionFiber.current = null;

    fiber.__vdom__.__dynamicChildren__ = children;

    return nextWorkCommon(fiber);
  } else {
    return [];
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkObject(fiber) {
  if (fiber.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.__isContextProvider__) return nextWorkProvider(fiber);
  if (fiber.__isContextConsumer__) return nextWorkConsumer(fiber);
  if (fiber.__isPortal__) return nextWorkCommon(fiber);
  if (fiber.__isMemo__) return nextWorkMemo(fiber);
  throw new Error("unknown element");
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWork(fiber) {
  // maybe need warning for this
  if (!fiber.mount) return [];

  currentRunningFiber.current = fiber;

  let children = [];

  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);
  else if (!fiber.__isTextNode__) children = nextWorkCommon(fiber);

  currentRunningFiber.current = null;

  fiber.updated();

  return children;
}

export { nextWork, nextWorkCommon };
