import { __my_react_shared__, createElement, isValidElement } from "@my-react/react";
import { Fragment, ListTree, STATE_TYPE, exclude, include } from "@my-react/react-shared";

import { createFiberNode, updateFiberNode } from "../runtimeFiber";
import { checkIsSameType, currentRenderDispatch, NODE_TYPE } from "../share";

import type { MyReactFiberNodeDev, MyReactFiberNode } from "../runtimeFiber";
import type { MyReactElementNode, MaybeArrayMyReactElementNode, ArrayMyReactElementChildren } from "@my-react/react";

const { enableDebugFiled } = __my_react_shared__;

const getIsSameTypeNode = (newChild: MyReactElementNode, draftFiber?: MyReactFiberNode) => {
  if (!draftFiber) return false;

  const result = checkIsSameType(draftFiber, newChild);

  return result;
};

const getExistingChildren = (parentFiber: MyReactFiberNode) => {
  const existingChildrenMap = new Map<string | number, ListTree<MyReactFiberNode>>();

  const existingChildrenArray: MyReactFiberNode[] = [];

  let child = parentFiber.child;

  let index = 0;

  while (child) {
    const key = typeof child.key === "string" ? child.key : index;

    const existingChild = existingChildrenMap.get(key) || new ListTree();

    existingChild.push(child);

    existingChildrenMap.set(key, existingChild);

    existingChildrenArray.push(child);

    child = child.sibling;

    index++;
  }

  return { existingChildrenMap, existingChildrenArray };
};

const dynamicFragmentProps = { wrap: true };

const createFragmentWithInitial = (newChild: ArrayMyReactElementChildren, parentFiber: MyReactFiberNode): MyReactFiberNode => {
  // TODO make there are not a element
  const newElement = createElement(Fragment, dynamicFragmentProps, newChild as MaybeArrayMyReactElementNode);

  const newFiber = createFiberNode({ parent: parentFiber }, newElement);

  return newFiber;
};

const createFragmentWithUpdate = (newChild: ArrayMyReactElementChildren, parentFiber: MyReactFiberNode): MyReactFiberNode => {
  const newElement = createElement(Fragment, dynamicFragmentProps, newChild as MaybeArrayMyReactElementNode);

  const newFiber = createFiberNode({ parent: parentFiber, type: "position" }, newElement);

  return newFiber;
};

const deleteIfNeed = (parentFiber: MyReactFiberNode, existingChildren: Map<string | number, ListTree<MyReactFiberNode>>) => {
  const renderDispatch = currentRenderDispatch.current;

  if (existingChildren.size) existingChildren.forEach((list) => list.listToFoot((f) => renderDispatch.pendingUnmount(parentFiber, f)));
};

const getNewFiberWithUpdate = (
  newChild: MaybeArrayMyReactElementNode,
  parentFiber: MyReactFiberNode,
  existingChildren: Map<string | number, ListTree<MyReactFiberNode>>,
  prevFiberChild: MyReactFiberNode | null,
  index: number
): MyReactFiberNode => {
  const renderDispatch = currentRenderDispatch.current;

  if (Array.isArray(newChild)) {
    const draftList = existingChildren.get(index);

    // TODO try to get the same type node?
    const draftFiber = draftList?.shift();

    if (draftList && !draftList.length) {
      existingChildren.delete(index);
    }

    // same type
    if (include(draftFiber?.type, NODE_TYPE.__fragment__)) {
      const newElement = createElement(Fragment, dynamicFragmentProps, newChild);

      return updateFiberNode({ fiber: draftFiber, parent: parentFiber, prevFiber: prevFiberChild }, newElement);
    } else {
      renderDispatch.pendingUnmount(parentFiber, draftFiber);

      return createFragmentWithUpdate(newChild, parentFiber);
    }
  }

  const keyToGet = isValidElement(newChild) && typeof newChild.key === "string" ? newChild.key : index;

  const draftList = existingChildren.get(keyToGet);

  const draftFiber = draftList?.shift();

  if (draftList && !draftList.length) {
    existingChildren.delete(keyToGet);
  }

  const isSameType = getIsSameTypeNode(newChild, draftFiber);

  if (isSameType) {
    return updateFiberNode({ fiber: draftFiber, parent: parentFiber, prevFiber: prevFiberChild }, newChild);
  } else {
    draftFiber && renderDispatch.pendingUnmount(parentFiber, draftFiber);

    return createFiberNode({ parent: parentFiber, type: "position" }, newChild);
  }
};

const getNewFiberWithInitial = (newChild: MaybeArrayMyReactElementNode, parentFiber: MyReactFiberNode): MyReactFiberNode => {
  // wrapper array child item as a Fragment fiber node, so all of the children will be a fiber node
  // and could be add to the child list
  if (Array.isArray(newChild)) return createFragmentWithInitial(newChild, parentFiber);

  return createFiberNode({ parent: parentFiber }, newChild as MyReactElementNode);
};

export const transformChildrenFiber = (parentFiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode): void => {
  const isUpdate = exclude(parentFiber.state, STATE_TYPE.__create__);

  if (isUpdate) {
    const { existingChildrenMap, existingChildrenArray } = getExistingChildren(parentFiber);

    parentFiber.child = null;

    const typedParentFiber = parentFiber as MyReactFiberNodeDev;

    if (__DEV__ && enableDebugFiled.current) {
      typedParentFiber._debugRenderChildrenCurrent && (typedParentFiber._debugRenderChildrenPrevious = typedParentFiber._debugRenderChildrenCurrent);
      typedParentFiber._debugRenderChildrenCurrent = [];
    }

    if (Array.isArray(children)) {
      const newChildren = children as ArrayMyReactElementChildren;

      let index = 0;

      let lastFiber: MyReactFiberNode | null = null;

      while (index < newChildren.length) {
        const newChild = newChildren[index];

        const newFiber = getNewFiberWithUpdate(newChild, parentFiber, existingChildrenMap, existingChildrenArray[index] || null, index);

        lastFiber && (lastFiber.sibling = newFiber);

        lastFiber = newFiber;

        if (__DEV__ && enableDebugFiled.current) typedParentFiber._debugRenderChildrenCurrent.push(newFiber);

        index++;
      }
    } else {
      const child = getNewFiberWithUpdate(children, parentFiber, existingChildrenMap, existingChildrenArray[0], 0);

      if (__DEV__ && enableDebugFiled.current) typedParentFiber._debugRenderChildrenCurrent.push(child);
    }

    deleteIfNeed(parentFiber, existingChildrenMap);
  } else {
    const { existingChildrenMap } = getExistingChildren(parentFiber);

    deleteIfNeed(parentFiber, existingChildrenMap);

    const typedParentFiber = parentFiber as MyReactFiberNodeDev;

    if (__DEV__ && enableDebugFiled.current) {
      typedParentFiber._debugRenderChildrenCurrent && (typedParentFiber._debugRenderChildrenPrevious = typedParentFiber._debugRenderChildrenCurrent);
      typedParentFiber._debugRenderChildrenCurrent = [];
    }

    parentFiber.child = null;

    if (Array.isArray(children)) {
      const newChildren = children as ArrayMyReactElementChildren;

      let lastFiber: MyReactFiberNode | null = null;

      let index = 0;

      while (index < newChildren.length) {
        const newChild = newChildren[index];

        const newFiber = getNewFiberWithInitial(newChild, parentFiber);

        lastFiber && (lastFiber.sibling = newFiber);

        lastFiber = newFiber;

        if (__DEV__ && enableDebugFiled.current) typedParentFiber._debugRenderChildrenCurrent.push(newFiber);

        index++;
      }
    } else {
      const child = getNewFiberWithInitial(children, parentFiber);

      if (__DEV__ && enableDebugFiled.current) typedParentFiber._debugRenderChildrenCurrent.push(child);
    }
  }
};
