import { __my_react_shared__, createElement, isValidElement } from "@my-react/react";
import { Fragment, ListTree, STATE_TYPE, exclude, include } from "@my-react/react-shared";

import { createFiberNode, updateFiberNode } from "../runtimeFiber";
import { checkIsSameType, NODE_TYPE } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
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

const createFragmentWithInitial = (
  renderDispatch: CustomRenderDispatch,
  newChild: ArrayMyReactElementChildren,
  parentFiber: MyReactFiberNode
): MyReactFiberNode => {
  // TODO make there are not a element
  const newElement = createElement(Fragment, dynamicFragmentProps, newChild as MaybeArrayMyReactElementNode);

  const newFiber = createFiberNode(renderDispatch, { parent: parentFiber }, newElement);

  return newFiber;
};

const createFragmentWithUpdate = (
  renderDispatch: CustomRenderDispatch,
  newChild: ArrayMyReactElementChildren,
  parentFiber: MyReactFiberNode
): MyReactFiberNode => {
  const newElement = createElement(Fragment, dynamicFragmentProps, newChild as MaybeArrayMyReactElementNode);

  const newFiber = createFiberNode(renderDispatch, { parent: parentFiber, type: "position" }, newElement);

  return newFiber;
};

const deleteIfNeed = (
  renderDispatch: CustomRenderDispatch,
  parentFiber: MyReactFiberNode,
  existingChildren: Map<string | number, ListTree<MyReactFiberNode>>
) => {
  if (existingChildren.size) {
    existingChildren.forEach(function forEachInvokePendingUnmountList(list) {
      list.listToFoot(function invokePendingUnmountList(f) {
        renderDispatch.pendingUnmount(parentFiber, f);
      });
    });

    renderDispatch.generateChangedList(parentFiber, true);
  }
};

const getNewFiberWithUpdate = (
  renderDispatch: CustomRenderDispatch,
  newChild: MaybeArrayMyReactElementNode,
  parentFiber: MyReactFiberNode,
  existingChildren: Map<string | number, ListTree<MyReactFiberNode>>,
  prevFiberChild: MyReactFiberNode | null,
  index: number
): MyReactFiberNode => {
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

      draftFiber !== prevFiberChild && renderDispatch.generateChangedList(parentFiber);

      return updateFiberNode(renderDispatch, { fiber: draftFiber, parent: parentFiber, prevFiber: prevFiberChild }, newElement);
    } else {
      draftFiber && renderDispatch.generateChangedList(parentFiber);

      draftFiber && renderDispatch.pendingUnmount(parentFiber, draftFiber);

      return createFragmentWithUpdate(renderDispatch, newChild, parentFiber);
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
    draftFiber !== prevFiberChild && renderDispatch.generateChangedList(parentFiber);

    return updateFiberNode(renderDispatch, { fiber: draftFiber, parent: parentFiber, prevFiber: prevFiberChild }, newChild);
  } else {
    draftFiber && renderDispatch.pendingUnmount(parentFiber, draftFiber);

    draftFiber && renderDispatch.generateChangedList(parentFiber);

    return createFiberNode(renderDispatch, { parent: parentFiber, type: "position" }, newChild);
  }
};

const getNewFiberWithInitial = (
  renderDispatch: CustomRenderDispatch,
  newChild: MaybeArrayMyReactElementNode,
  parentFiber: MyReactFiberNode
): MyReactFiberNode => {
  // wrapper array child item as a Fragment fiber node, so all of the children will be a fiber node
  // and could be add to the child list
  if (Array.isArray(newChild)) return createFragmentWithInitial(renderDispatch, newChild, parentFiber);

  return createFiberNode(renderDispatch, { parent: parentFiber }, newChild as MyReactElementNode);
};

export const transformChildrenFiber = (renderDispatch: CustomRenderDispatch, parentFiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode): void => {
  const isUpdate = exclude(parentFiber.state, STATE_TYPE.__create__);

  const isHMR = include(parentFiber.state, STATE_TYPE.__hmr__);

  const isRetrigger = include(parentFiber.state, STATE_TYPE.__retrigger__);

  const isSuspense = include(parentFiber.state, STATE_TYPE.__suspense__);

  // is current is retrigger update, skip update children
  if (isRetrigger) return;

  // if is suspense, skip update children
  if (isSuspense) return;

  if (isUpdate || isHMR) {
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

        const newFiber = getNewFiberWithUpdate(renderDispatch, newChild, parentFiber, existingChildrenMap, existingChildrenArray[index] || null, index);

        lastFiber && (lastFiber.sibling = newFiber);

        lastFiber = newFiber;

        if (__DEV__ && enableDebugFiled.current) typedParentFiber._debugRenderChildrenCurrent.push(newChild);

        index++;
      }
    } else {
      getNewFiberWithUpdate(renderDispatch, children, parentFiber, existingChildrenMap, existingChildrenArray[0], 0);

      if (__DEV__ && enableDebugFiled.current) typedParentFiber._debugRenderChildrenCurrent.push(children);
    }

    deleteIfNeed(renderDispatch, parentFiber, existingChildrenMap);
  } else {
    renderDispatch.generateChangedList(parentFiber);

    const { existingChildrenMap } = getExistingChildren(parentFiber);

    deleteIfNeed(renderDispatch, parentFiber, existingChildrenMap);

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

        const newFiber = getNewFiberWithInitial(renderDispatch, newChild, parentFiber);

        lastFiber && (lastFiber.sibling = newFiber);

        lastFiber = newFiber;

        if (__DEV__ && enableDebugFiled.current) typedParentFiber._debugRenderChildrenCurrent.push(newChild);

        index++;
      }
    } else {
      getNewFiberWithInitial(renderDispatch, children, parentFiber);

      if (__DEV__ && enableDebugFiled.current) typedParentFiber._debugRenderChildrenCurrent.push(children);
    }
  }
};
