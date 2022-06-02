import {
  isMounted,
  isServerRender,
  isHydrateRender,
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
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 */
function isSameTypeNode(newVDom, previousRenderChild) {
  if (!isMounted.current) return false;

  const newVDomIsArray = Array.isArray(newVDom);
  const previousRenderChildIsArray = Array.isArray(previousRenderChild);

  if (newVDomIsArray && previousRenderChildIsArray) return true;

  if (newVDomIsArray) return false;

  if (previousRenderChildIsArray) return false;

  const previousRenderChildVDom = previousRenderChild?.__vdom__;
  const newVDomIsVDomInstance = newVDom instanceof MyReactVDom;
  const previousRenderChildVDomIsVDomInstance =
    previousRenderChildVDom instanceof MyReactVDom;

  if (newVDomIsVDomInstance && previousRenderChildVDomIsVDomInstance) {
    // key different
    if (enableKeyDiff.current && newVDom.key !== previousRenderChildVDom.key) {
      return false;
    }

    const result = newVDom.isSameTypeNode(previousRenderChildVDom);

    if (result) {
      if (newVDom.__isDynamicNode__ || newVDom.__isPlainNode__) {
        return newVDom.type === previousRenderChildVDom.type;
      }
      if (newVDom.__isObjectNode__) {
        return newVDom.type.type === previousRenderChildVDom.type.type;
      }
      return result;
    } else {
      return false;
    }
  }
  if (newVDomIsVDomInstance) return false;
  if (previousRenderChildVDomIsVDomInstance) return false;
  // text node
  if (typeof newVDom !== "object") {
    return previousRenderChild && previousRenderChild.__isTextNode__;
  }
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
  if (isServerRender.current) return previousRenderChildren;
  if (isHydrateRender.current) return previousRenderChildren;
  if (!enableKeyDiff.current) return previousRenderChildren;
  if (!previousRenderChildren) return previousRenderChildren;
  if (previousRenderChildren.length === 0) return previousRenderChildren;

  const tempRenderChildren = previousRenderChildren.slice(0);
  const assignPreviousRenderChildren = Array(tempRenderChildren.length).fill(
    null
  );
  newChildren.forEach((vDom, index) => {
    if (tempRenderChildren.length) {
      if (vDom instanceof MyReactVDom && vDom.key !== undefined) {
        const targetIndex = tempRenderChildren.findIndex(
          (fiber) => fiber instanceof MyReactFiberNode && fiber.key === vDom.key
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
      effect: "PLACEMENT",
    },
    newVDom === false || newVDom === null ? "" : newVDom
  );
}

/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 * @param {MyReactFiberNode | MyReactFiberNode[]} matchedPreviousRenderChild
 * @returns
 */
function getNewFiberWithUpdate(
  newVDom,
  parentFiber,
  previousRenderChild,
  matchedPreviousRenderChild
) {
  const isSameType = isSameTypeNode(newVDom, matchedPreviousRenderChild);
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
          matchedPreviousRenderChild[index]
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
      effect: "PLACEMENT",
    },
    {
      newVDom: newVDom === false || newVDom === null ? "" : newVDom,
      previousRenderFiber: previousRenderChild,
    }
  );
}

export {
  getMatchedRenderChildren,
  getNewFiberWithInitial,
  getNewFiberWithUpdate,
};
