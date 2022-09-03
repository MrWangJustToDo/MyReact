import { isValidElement, __myreact_internal__, __myreact_shared__ } from "@my-react/react";

import { enableKeyDiff } from "../share";

import type {
  ArrayElementNode,
  MyReactElementNode,
  MyReactElement,
  MaybeArrayElementNode,
  MyReactFiberNode,
} from "@my-react/react";

const { isAppMounted, globalDispatch, MyReactFiberNode: MyReactFiberNodeClass } = __myreact_internal__;

const { updateFiberNode, createFiberNode } = __myreact_shared__;

const getKeyMatchedChildren = (
  newChildren: ArrayElementNode,
  prevFiberChildren: Array<MyReactFiberNode | MyReactFiberNode[]>
) => {
  if (!isAppMounted.current) return prevFiberChildren;
  if (!enableKeyDiff.current) return prevFiberChildren;
  if (!prevFiberChildren) return prevFiberChildren;
  if (prevFiberChildren.length === 0) return prevFiberChildren;

  const tempChildren = prevFiberChildren.slice(0);
  const assignPrevChildren: Array<MyReactFiberNode | MyReactFiberNode[]> = Array(tempChildren.length).fill(null);

  newChildren.forEach((element, index) => {
    if (tempChildren.length) {
      if (isValidElement(element)) {
        if (typeof element.key === "string") {
          const targetIndex = tempChildren.findIndex(
            (fiber) =>
              fiber instanceof MyReactFiberNodeClass &&
              typeof fiber.element === "object" &&
              fiber.element?.key === element.key
          );
          if (targetIndex !== -1) {
            assignPrevChildren[index] = tempChildren[targetIndex];
            tempChildren.splice(targetIndex, 1);
          }
        } else {
          // TODO
        }
      }
    }
  });

  return assignPrevChildren.map((v) => {
    if (v) return v;
    return tempChildren.shift();
  });
};

const getIsSameTypeNode = (newChild: MaybeArrayElementNode, prevFiberChild?: MyReactFiberNode | MyReactFiberNode[]) => {
  if (!isAppMounted.current) return false;
  const newChildIsArray = Array.isArray(newChild);
  const prevElementChildIsArray = Array.isArray(prevFiberChild);
  if (newChildIsArray && prevElementChildIsArray) return true;
  if (newChildIsArray) return false;
  if (prevElementChildIsArray) return false;

  const typedPrevFiberChild = prevFiberChild as MyReactFiberNode;
  const typedNewChild = newChild as MyReactElementNode;

  const prevRenderedChild = typedPrevFiberChild?.element;
  const result = typedPrevFiberChild?.checkIsSameType(typedNewChild);
  if (result && enableKeyDiff.current && !typedPrevFiberChild.__isTextNode__ && !typedPrevFiberChild.__isNullNode__) {
    return (typedNewChild as MyReactElement).key === (prevRenderedChild as MyReactElement).key;
  } else {
    return result;
  }
};

const getNewFiberWithUpdate = (
  newChild: MaybeArrayElementNode,
  parentFiber: MyReactFiberNode,
  prevFiberChild?: MyReactFiberNode | MyReactFiberNode[],
  assignPrevFiberChild?: MyReactFiberNode | MyReactFiberNode[]
): MyReactFiberNode | MyReactFiberNode[] => {
  const isSameType = getIsSameTypeNode(newChild, assignPrevFiberChild);
  if (isSameType) {
    if (Array.isArray(newChild) && Array.isArray(prevFiberChild) && Array.isArray(assignPrevFiberChild)) {
      const assignPrevFiberChildren = getKeyMatchedChildren(newChild, assignPrevFiberChild) as MyReactFiberNode[];
      if (newChild.length < assignPrevFiberChildren.length) {
        globalDispatch.current.pendingUnmount(parentFiber, assignPrevFiberChildren.slice(newChild.length));
      }
      return newChild.map((v, index) =>
        getNewFiberWithUpdate(v, parentFiber, prevFiberChild[index], assignPrevFiberChildren[index])
      ) as MyReactFiberNode[];
    }

    return updateFiberNode(
      {
        fiber: assignPrevFiberChild as MyReactFiberNode,
        parent: parentFiber,
        prevFiber: prevFiberChild as MyReactFiberNode,
      },
      newChild as MyReactElementNode
    );
  } else {
    if (assignPrevFiberChild) {
      globalDispatch.current.pendingUnmount(parentFiber, assignPrevFiberChild);
    }

    if (Array.isArray(newChild)) {
      return newChild.map((v) => getNewFiberWithUpdate(v, parentFiber)) as MyReactFiberNode[];
    }

    return createFiberNode(
      {
        fiberIndex: parentFiber.fiberIndex + 1,
        parent: parentFiber,
        type: "position",
      },
      newChild
    );
  }
};

const getNewFiberWithInitial = (
  newChild: MaybeArrayElementNode,
  parentFiber: MyReactFiberNode
): MyReactFiberNode | MyReactFiberNode[] => {
  if (Array.isArray(newChild)) {
    return newChild.map((v) => getNewFiberWithInitial(v, parentFiber)) as MyReactFiberNode[];
  }

  return createFiberNode({ fiberIndex: parentFiber.fiberIndex + 1, parent: parentFiber }, newChild);
};

export const transformChildrenFiber = (
  parentFiber: MyReactFiberNode,
  children: MaybeArrayElementNode | null | undefined
) => {
  let index = 0;

  const isUpdate = parentFiber.__isUpdateRender__;

  const newChildren = Array.isArray(children) ? children : [children];

  const prevFiberChildren = isUpdate ? parentFiber.__renderedChildren__ : [];

  const assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);

  parentFiber.__renderedChildren__ = [];

  parentFiber.beforeUpdate();

  while (index < newChildren.length || index < assignPrevFiberChildren.length) {
    const newChild = newChildren[index];
    const prevFiberChild = prevFiberChildren[index];
    const assignPrevFiberChild = assignPrevFiberChildren[index];

    const newFiber = isUpdate
      ? getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild)
      : getNewFiberWithInitial(newChild, parentFiber);

    parentFiber.__renderedChildren__.push(newFiber);

    index++;
  }

  parentFiber.afterUpdate();

  return parentFiber.children;
};
