import { MyReactFiberNode, createFiberNode, updateFiberNode } from '../fiber';
import {
  enableKeyDiff,
  globalDispatch,
  isAppMounted,
  isHydrateRender,
  isServerRender,
} from '../share';
import { isValidElement } from '../vdom';

import type {
  ArrayChildrenNode,
  MaybeArrayChildrenNode,
  Children,
  ChildrenNode,
} from '../vdom';

const getKeyMatchedChildren = (
  newChildren: ArrayChildrenNode,
  prevFiberChildren: Array<MyReactFiberNode | MyReactFiberNode[]>
) => {
  if (!isAppMounted.current) return prevFiberChildren;
  if (isServerRender.current) return prevFiberChildren;
  if (isHydrateRender.current) return prevFiberChildren;
  if (!enableKeyDiff.current) return prevFiberChildren;
  if (!prevFiberChildren) return prevFiberChildren;
  if (prevFiberChildren.length === 0) return prevFiberChildren;

  const tempChildren = prevFiberChildren.slice(0);
  const assignPrevChildren: Array<MyReactFiberNode | MyReactFiberNode[]> =
    Array(tempChildren.length).fill(null);

  newChildren.forEach((vDom, index) => {
    if (tempChildren.length) {
      if (
        isValidElement(vDom) &&
        typeof vDom === 'object' &&
        typeof vDom?.key === 'string'
      ) {
        const targetIndex = tempChildren.findIndex(
          (fiber) =>
            fiber instanceof MyReactFiberNode &&
            typeof fiber.element === 'object' &&
            fiber.element?.key === vDom.key
        );
        if (targetIndex !== -1) {
          assignPrevChildren[index] = tempChildren[targetIndex];
          tempChildren.splice(targetIndex, 1);
        }
      }
    }
  });

  return assignPrevChildren.map((v) => {
    if (v) return v;
    return tempChildren.shift();
  });
};

const getIsSameTypeNode = (
  newChild: MaybeArrayChildrenNode,
  prevFiberChild?: MyReactFiberNode | MyReactFiberNode[]
) => {
  if (!isAppMounted.current) return false;
  const newChildIsArray = Array.isArray(newChild);
  const prevRenderedChildIsArray = Array.isArray(prevFiberChild);
  if (newChildIsArray && prevRenderedChildIsArray) return true;
  if (newChildIsArray) return false;
  if (prevRenderedChildIsArray) return false;

  const typedPrevFiberChild = prevFiberChild as MyReactFiberNode;
  const typedNewChild = newChild as ChildrenNode;

  const prevRenderedChildVDom = typedPrevFiberChild?.element;
  const result = typedPrevFiberChild?.checkIsSameType(typedNewChild);
  if (result && enableKeyDiff.current && !typedPrevFiberChild.__isTextNode__) {
    return (
      (typedNewChild as Children).key ===
      (prevRenderedChildVDom as Children).key
    );
  } else {
    return result;
  }
};

const getNewFiberWithUpdate = (
  newChild: MaybeArrayChildrenNode,
  parentFiber: MyReactFiberNode,
  prevRenderedChild?: MyReactFiberNode | MyReactFiberNode[],
  assignPrevRenderedChild?: MyReactFiberNode | MyReactFiberNode[]
): MyReactFiberNode | MyReactFiberNode[] => {
  const isSameType = getIsSameTypeNode(newChild, assignPrevRenderedChild);
  if (isSameType) {
    if (
      Array.isArray(newChild) &&
      Array.isArray(prevRenderedChild) &&
      Array.isArray(assignPrevRenderedChild)
    ) {
      const assignPrevRenderedChildren = getKeyMatchedChildren(
        newChild,
        assignPrevRenderedChild
      ) as MyReactFiberNode[];
      if (newChild.length < assignPrevRenderedChildren.length) {
        globalDispatch.current.pendingUnmount(
          parentFiber,
          assignPrevRenderedChildren.slice(newChild.length)
        );
      }
      return newChild.map((v, index) =>
        getNewFiberWithUpdate(
          v,
          parentFiber,
          prevRenderedChild[index],
          assignPrevRenderedChildren[index]
        )
      ) as MyReactFiberNode[];
    }

    return updateFiberNode(
      {
        fiber: assignPrevRenderedChild as MyReactFiberNode,
        parent: parentFiber,
        prevFiber: prevRenderedChild as MyReactFiberNode,
      },
      newChild as ChildrenNode
    );
  } else {
    if (assignPrevRenderedChild) {
      globalDispatch.current.pendingUnmount(
        parentFiber,
        assignPrevRenderedChild
      );
    }

    if (Array.isArray(newChild)) {
      return newChild.map((v) =>
        getNewFiberWithUpdate(v, parentFiber)
      ) as MyReactFiberNode[];
    }

    return createFiberNode(
      {
        fiberIndex: parentFiber.fiberIndex + 1,
        parent: parentFiber,
        type: 'position',
      },
      newChild
    );
  }
};

const getNewFiberWithInitial = (
  newChild: MaybeArrayChildrenNode,
  parentFiber: MyReactFiberNode
): MyReactFiberNode | MyReactFiberNode[] => {
  if (Array.isArray(newChild)) {
    return newChild.map((v) =>
      getNewFiberWithInitial(v, parentFiber)
    ) as MyReactFiberNode[];
  }

  return createFiberNode(
    { fiberIndex: parentFiber.fiberIndex + 1, parent: parentFiber },
    newChild
  );
};

export const transformChildrenFiber = (
  parentFiber: MyReactFiberNode,
  children: MaybeArrayChildrenNode | null | undefined
) => {
  let index = 0;
  const isUpdate = parentFiber.__isUpdateRender__;
  const newChildren = Array.isArray(children)
    ? children
    : children === undefined
    ? []
    : [children];
  const prevFiberChildren = isUpdate ? parentFiber.__renderedChildren__ : [];
  const assignPrevFiberChildren = getKeyMatchedChildren(
    newChildren,
    prevFiberChildren
  );

  parentFiber.__renderedChildren__ = [];

  parentFiber.beforeUpdate();

  while (index < newChildren.length || index < assignPrevFiberChildren.length) {
    const newChild = newChildren[index];
    const prevFiberChild = prevFiberChildren[index];
    const assignPrevFiberChild = assignPrevFiberChildren[index];

    const newFiber = isUpdate
      ? getNewFiberWithUpdate(
          newChild,
          parentFiber,
          prevFiberChild,
          assignPrevFiberChild
        )
      : getNewFiberWithInitial(newChild, parentFiber);

    parentFiber.__renderedChildren__.push(newFiber);

    index++;
  }

  parentFiber.afterUpdate();

  return parentFiber.children;
};
