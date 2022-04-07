import { classComponentMount, classComponentUpdate } from "./component.js";
import {
  currentFunctionFiber,
  currentRunningFiber,
  currentHookDeepIndex,
  isMounted,
  enableKeyDiff,
} from "./env.js";
import { createFiberNode, MyReactFiberNode, updateFiberNode } from "./fiber.js";
import { isEqual, isNormalEqual } from "./tools.js";
import { pushFiber, pushPosition, pushUnmount, pushUpdate } from "./update.js";
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

    if (!matchedPreviousRenderChild) return null;

    if (
      matchedPreviousRenderChild.__isTextNode__ &&
      matchedPreviousRenderChild.__vdom__ === newVDom
    ) {
      return updateFiberNode(matchedPreviousRenderChild, parentFiber, newVDom);
    }

    if (
      matchedPreviousRenderChild.__isPlainNode__ &&
      isEqual(matchedPreviousRenderChild.__vdom__.props, newVDom.props)
    ) {
      const fiber = updateFiberNode(
        matchedPreviousRenderChild,
        parentFiber,
        newVDom
      );
      if (matchedPreviousRenderChild !== previousRenderChild) {
        fiber.diffMount = true;
        fiber.diffPrevRender = previousRenderChild;
        pushPosition(fiber.fiberParent);
      }
      return fiber;
    }

    // 优化Provider更新，方法之一
    if (
      matchedPreviousRenderChild.__isContextProvider__ &&
      isNormalEqual(
        matchedPreviousRenderChild.__vdom__.props.value,
        newVDom.props.value
      )
    ) {
      return updateFiberNode(previousRenderChild, parentFiber, newVDom);
    }

    let fiber = createFiberNode(
      {
        fiberParent: parentFiber,
        deepIndex: parentFiber.deepIndex + 1,
        fiberAlternate: matchedPreviousRenderChild,
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
      newVDom === false || newVDom === null ? "" : newVDom
    );

    if (fiber.dom && fiber.effect) {
      pushUpdate(fiber);
    }

    if (matchedPreviousRenderChild !== previousRenderChild) {
      fiber.diffMount = true;
      fiber.diffPrevRender = previousRenderChild;
      pushPosition(fiber.fiberParent);
    }

    return fiber;
  }

  if (previousRenderChild) {
    pushUnmount(previousRenderChild);
  }

  if (Array.isArray(newVDom)) {
    return newVDom.map((v) =>
      getNewFiberWithUpdate(v, parentFiber, null, null, false)
    );
  }

  if (newVDom === undefined) return null;

  let fiber = createFiberNode(
    {
      fiberParent: parentFiber,
      deepIndex: parentFiber.deepIndex + 1,
      effect: newVDom.__isPortal__ ? "PORTAL" : "PLACEMENT",
    },
    newVDom === false || newVDom === null ? "" : newVDom
  );

  if (isMounted.current) {
    fiber.diffMount = true;
    fiber.diffPrevRender = previousRenderChild;
    pushPosition(fiber.fiberParent);
  }

  return fiber;
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
  // throw new Error("return null if need render empty element");

  let fiber = createFiberNode(
    {
      fiberParent: parentFiber,
      deepIndex: parentFiber.deepIndex + 1,
      effect: newVDom.__isPortal__ ? "PORTAL" : "PLACEMENT",
    },
    newVDom === false || newVDom === null ? "" : newVDom
  );

  if (isMounted.current && fiber.dom && fiber.effect) {
    pushUpdate(fiber);
  }

  return fiber;
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
    if (newVDom.__isDynamicNode__ || newVDom.__isPlainNode__)
      return newVDom.type === previousRenderChildVDom.type;
    if (newVDom.__isObjectNode__)
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
 * @param {MyReactVDom | MyReactVDom[]} newChildren
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChildren
 */
function getMatchedRenderChildren(newChildren, previousRenderChildren) {
  if (!isMounted.current) return previousRenderChildren;
  if (!enableKeyDiff.current) return previousRenderChildren;
  const usedState = Array(previousRenderChildren.length).fill(false);
  const assignPreviousRenderChildren = Array(
    previousRenderChildren.length
  ).fill(null);
  // 优先处理有key的
  newChildren.forEach((vdom, index) => {
    if (vdom instanceof MyReactVDom && vdom.key !== undefined) {
      const targetIndex = previousRenderChildren.findIndex(
        (fiber, _index) => !usedState[_index] && fiber.key === vdom.key
      );
      if (targetIndex !== -1) {
        usedState[targetIndex] = true;
        assignPreviousRenderChildren[index] =
          previousRenderChildren[targetIndex];
      }
    }
  });
  // 剩下的填满位置
  for (let i = 0, j = 0; i < assignPreviousRenderChildren.length; i++) {
    if (!assignPreviousRenderChildren[i]) {
      while (usedState[j]) {
        j++;
      }
      if (j >= usedState.length) {
        throw new Error("排序children索引错误");
      }
      usedState[j] = true;
      assignPreviousRenderChildren[i] = previousRenderChildren[j];
    }
  }

  return assignPreviousRenderChildren;
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
    parentFiber.fiberAlternate?.renderedChildren || [];

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

    parentFiber.renderedChildren.push(newFiber);

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

  fiber.__vdom__.children = children;

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
  if (fiber.__vdom__.children !== undefined) {
    return transformChildrenFiber(fiber, fiber.__vdom__.children);
  }
  if (fiber.__vdom__.props.children !== undefined) {
    throw new Error("预料之外的错误");
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

  fiber.__vdom__.children = children;

  return nextWorkCommon(fiber);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWorkProvider(fiber) {
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

  const children = fiber.__vdom__.children(fiber.instance.context);

  fiber.__vdom__.children = children;

  return nextWorkCommon(fiber);
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
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function nextWork(fiber) {
  currentRunningFiber.current = fiber;

  let children = [];

  if (fiber.__isDynamicNode__) children = nextWorkComponent(fiber);
  else if (fiber.__isObjectNode__) children = nextWorkObject(fiber);
  else if (!fiber.__isTextNode__) children = nextWorkCommon(fiber);

  !fiber.effect && (fiber.fiberAlternate = null);

  fiber.initial = false;
  fiber.__needUpdate__ = false;

  return children;
}

export { nextWork, transformChildrenFiber, nextWorkCommon };
