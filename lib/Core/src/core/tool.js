import { MyReactVDom } from "../vdom/index.js";
import {
  MyReactFiberNode,
  createNewFiberNodeWithMount,
  updateFiberNodeWithPosition,
  createNewFiberNodeWithPosition,
  createUpdatedFiberNodeWithUpdateAndPosition,
} from "../fiber/index.js";
import {
  enableKeyDiff,
  isHydrateRender,
  isMounted,
  isServerRender,
} from "../env.js";
import { pushUnmount } from "../unmount.js";
import { isEqual, isNormalEqual } from "../tool.js";

/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 */
const isSameTypeNode = (newVDom, previousRenderChild) => {
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

    return previousRenderChild.checkIsSameType(newVDom);
  }
  if (newVDomIsVDomInstance) return false;
  if (previousRenderChildVDomIsVDomInstance) return false;
  // fallback node
  if (newVDom === null || newVDom === false)
    return previousRenderChildVDom === "";
  // text node
  if (typeof newVDom !== "object") {
    return previousRenderChild && previousRenderChild.__isTextNode__;
  }
  return false;
};

/**
 *
 * @param {MyReactVDom[]} newChildren
 * @param {MyReactFiberNode[]} previousRenderChildren
 */
const getMatchedRenderChildren = (newChildren, previousRenderChildren) => {
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
};

/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode} parentFiber
 */
const getNewFiberWithInitial = (newVDom, parentFiber) => {
  if (Array.isArray(newVDom)) {
    return newVDom.map((v) => getNewFiberWithInitial(v, parentFiber));
  }

  if (newVDom === undefined) return null;

  return createNewFiberNodeWithMount(
    {
      fiberParent: parentFiber,
      deepIndex: parentFiber.deepIndex + 1,
      effect: "PLACEMENT",
    },
    newVDom === false || newVDom === null ? "" : newVDom
  );
};

/**
 *
 * @param {MyReactVDom | MyReactVDom[]} newVDom
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactFiberNode | MyReactFiberNode[]} previousRenderChild
 * @param {MyReactFiberNode | MyReactFiberNode[]} matchedPreviousRenderChild
 * @returns
 */
const getNewFiberWithUpdate = (
  newVDom,
  parentFiber,
  previousRenderChild,
  matchedPreviousRenderChild
) => {
  const isSameType = isSameTypeNode(newVDom, matchedPreviousRenderChild);
  if (isSameType) {
    if (Array.isArray(newVDom)) {
      matchedPreviousRenderChild = getMatchedRenderChildren(
        newVDom,
        matchedPreviousRenderChild
      );
      if (newVDom.length < matchedPreviousRenderChild.length) {
        // console.log(newVDom, matchedPreviousRenderChild);
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

    const currentMatchedPreviousRenderChild = matchedPreviousRenderChild;

    if (Object.is(currentMatchedPreviousRenderChild.__vdom__, newVDom)) {
      return updateFiberNodeWithPosition(
        currentMatchedPreviousRenderChild,
        parentFiber,
        newVDom,
        previousRenderChild
      );
    }

    if (
      currentMatchedPreviousRenderChild.__isPlainNode__ &&
      isEqual(currentMatchedPreviousRenderChild.__vdom__.props, newVDom.props)
    ) {
      return updateFiberNodeWithPosition(
        currentMatchedPreviousRenderChild,
        parentFiber,
        newVDom,
        previousRenderChild
      );
    }

    if (
      currentMatchedPreviousRenderChild.__isMemo__ &&
      isNormalEqual(
        currentMatchedPreviousRenderChild.__vdom__.props,
        newVDom.props
      )
    ) {
      return updateFiberNodeWithPosition(
        currentMatchedPreviousRenderChild,
        parentFiber,
        newVDom,
        previousRenderChild
      );
    }

    if (
      currentMatchedPreviousRenderChild.__isContextProvider__ &&
      isNormalEqual(
        currentMatchedPreviousRenderChild.__vdom__.props.value,
        newVDom.props.value
      )
    ) {
      return updateFiberNodeWithPosition(
        currentMatchedPreviousRenderChild,
        parentFiber,
        newVDom,
        previousRenderChild
      );
    }

    return createUpdatedFiberNodeWithUpdateAndPosition(
      {
        deepIndex: parentFiber.deepIndex + 1,
        fiberParent: parentFiber,
        fiberAlternate: currentMatchedPreviousRenderChild,
        effect:
          currentMatchedPreviousRenderChild.__isTextNode__ ||
          currentMatchedPreviousRenderChild.__isPlainNode__
            ? "UPDATE"
            : null,
      },
      newVDom === false || newVDom === null ? "" : newVDom,
      previousRenderChild
    );
  }

  if (matchedPreviousRenderChild) {
    pushUnmount(matchedPreviousRenderChild);
  }

  if (newVDom === undefined) return null;

  if (Array.isArray(newVDom)) {
    return newVDom.map((v) => getNewFiberWithUpdate(v, parentFiber));
  }

  return createNewFiberNodeWithPosition(
    {
      deepIndex: parentFiber.deepIndex + 1,
      fiberParent: parentFiber,
      effect: "POSITION",
    },
    newVDom === false || newVDom === null ? "" : newVDom,
    previousRenderChild
  );
};

/**
 *
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactVDom | MyReactVDom[]} children
 */
const transformChildrenFiber = (parentFiber, children) => {
  let index = 0;

  const isNewChildren = Boolean(!parentFiber.fiberAlternate);

  const vdomChildren = Array.isArray(children) ? children : [children];

  const previousRenderChildren = isNewChildren
    ? []
    : parentFiber.__renderedChildren__;

  const assignPreviousRenderChildren = getMatchedRenderChildren(
    vdomChildren,
    previousRenderChildren
  );

  parentFiber.beforeTransform();

  while (index < vdomChildren.length || index < previousRenderChildren.length) {
    const newChild = vdomChildren[index];

    const previousRenderChild = previousRenderChildren[index];

    const assignPreviousRenderChild = assignPreviousRenderChildren[index];

    const newFiber = isNewChildren
      ? getNewFiberWithInitial(newChild, parentFiber)
      : getNewFiberWithUpdate(
          newChild,
          parentFiber,
          previousRenderChild,
          assignPreviousRenderChild
        );

    parentFiber.__renderedChildren__.push(newFiber);

    index++;
  }

  // parentFiber.afterTransform();

  return parentFiber.children;
};

export { transformChildrenFiber };
