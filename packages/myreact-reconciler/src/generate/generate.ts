import { isValidElement, __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { UPDATE_TYPE } from "@my-react/react-shared";

import { checkIsSameType } from "../share";

import { createFiberNode, updateFiberNode } from "./tools";

import type {
  ArrayMyReactElementNode,
  MyReactElementNode,
  MyReactElement,
  MaybeArrayMyReactElementNode,
  MyReactFiberNode,
  ArrayMyReactElementChildren,
} from "@my-react/react";

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

const { enableKeyDiff } = __my_react_shared__;

const getKeyMatchedChildren = (
  newChildren: ArrayMyReactElementNode | ArrayMyReactElementChildren,
  prevFiberChildren: Array<MyReactFiberNode | MyReactFiberNode[]>
) => {
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
            (fiber) => fiber instanceof MyReactFiberNodeClass && typeof fiber.element === "object" && fiber.element?.key === element.key
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

const getIsSameTypeNode = (newChild: MaybeArrayMyReactElementNode, prevFiberChild?: MyReactFiberNode | MyReactFiberNode[]) => {
  const newChildIsArray = Array.isArray(newChild);

  const prevElementChildIsArray = Array.isArray(prevFiberChild);

  if (newChildIsArray && prevElementChildIsArray) return true;

  if (newChildIsArray) return false;

  if (prevElementChildIsArray) return false;

  const typedPrevFiberChild = prevFiberChild as MyReactFiberNode;

  const typedNewChild = newChild as MyReactElementNode;

  const prevRenderedChild = typedPrevFiberChild?.element;

  const result = checkIsSameType(typedPrevFiberChild, typedNewChild);

  if (result && enableKeyDiff.current && isValidElement(typedNewChild)) {
    return (typedNewChild as MyReactElement).key === (prevRenderedChild as MyReactElement).key;
  } else {
    return result;
  }
};

const getNewFiberWithUpdate = (
  newChild: MaybeArrayMyReactElementNode,
  parentFiber: MyReactFiberNode,
  prevFiberChild?: MyReactFiberNode | MyReactFiberNode[],
  assignPrevFiberChild?: MyReactFiberNode | MyReactFiberNode[]
): MyReactFiberNode | MyReactFiberNode[] => {
  const globalDispatch = parentFiber.root.globalDispatch;

  const isSameType = getIsSameTypeNode(newChild, assignPrevFiberChild);

  if (isSameType) {
    if (Array.isArray(newChild) && Array.isArray(prevFiberChild) && Array.isArray(assignPrevFiberChild)) {
      const assignPrevFiberChildren = getKeyMatchedChildren(newChild, assignPrevFiberChild) as MyReactFiberNode[];

      if (newChild.length < assignPrevFiberChildren.length) globalDispatch.pendingUnmount(parentFiber, assignPrevFiberChildren.slice(newChild.length));

      return newChild.map((v, index) => getNewFiberWithUpdate(v, parentFiber, prevFiberChild[index], assignPrevFiberChildren[index])) as MyReactFiberNode[];
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
    if (assignPrevFiberChild) globalDispatch.pendingUnmount(parentFiber, assignPrevFiberChild);

    if (Array.isArray(newChild)) return newChild.map((v) => getNewFiberWithUpdate(v, parentFiber)) as MyReactFiberNode[];

    return createFiberNode(
      {
        parent: parentFiber,
        type: "position",
      },
      newChild
    );
  }
};

const getNewFiberWithInitial = (newChild: MaybeArrayMyReactElementNode, parentFiber: MyReactFiberNode): MyReactFiberNode | MyReactFiberNode[] => {
  if (Array.isArray(newChild)) {
    return newChild.map((v) => getNewFiberWithInitial(v, parentFiber)) as MyReactFiberNode[];
  }

  return createFiberNode({ parent: parentFiber }, newChild);
};

export const transformChildrenFiber = (parentFiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  const isUpdate = parentFiber.mode & UPDATE_TYPE.__update__;

  const globalDispatch = parentFiber.root.globalDispatch;

  if (isUpdate) {
    if (Array.isArray(children)) {
      const newChildren = children as ArrayMyReactElementChildren;

      const prevFiberReturn = parentFiber.return || [];

      const prevFiberChildren = Array.isArray(prevFiberReturn) ? prevFiberReturn : [prevFiberReturn];

      const assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);

      parentFiber.beforeUpdate();

      let index = 0;

      while (index < newChildren.length || index < assignPrevFiberChildren.length) {
        const newChild = newChildren[index];

        const prevFiberChild = prevFiberChildren[index];

        const assignPrevFiberChild = assignPrevFiberChildren[index];

        const newFiber = getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild);

        parentFiber.return = (parentFiber.return || []) as Array<MyReactFiberNode | MyReactFiberNode[]>;

        parentFiber.return.push(newFiber);

        index++;
      }

      parentFiber.afterUpdate();
    } else {
      const prevFiberReturn = parentFiber.return || null;

      if (Array.isArray(prevFiberReturn)) {
        const newChildren = [children];

        const prevFiberChildren = prevFiberReturn;

        const assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);

        parentFiber.beforeUpdate();

        let index = 0;

        while (index < newChildren.length || index < assignPrevFiberChildren.length) {
          const newChild = newChildren[index];

          const prevFiberChild = prevFiberChildren[index];

          const assignPrevFiberChild = assignPrevFiberChildren[index];

          const newFiber = getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild);

          parentFiber.return = (parentFiber.return || []) as Array<MyReactFiberNode | MyReactFiberNode[]>;

          parentFiber.return.push(newFiber);

          index++;
        }

        parentFiber.afterUpdate();
      } else if (prevFiberReturn) {
        parentFiber.beforeUpdate();

        const newFiber = getNewFiberWithUpdate(children, parentFiber, prevFiberReturn, prevFiberReturn);

        parentFiber.return = newFiber;

        parentFiber.afterUpdate();
      }
    }
  } else {
    if (parentFiber.return) {
      if (__DEV__) {
        parentFiber.root.globalPlatform.log({ message: `unmount for current fiber children, look like a bug`, level: "warn" });
      }
      globalDispatch.pendingUnmount(parentFiber, parentFiber.return);
    }
    if (Array.isArray(children)) {
      const newChildren = children as ArrayMyReactElementChildren;

      parentFiber.beforeUpdate();

      let index = 0;

      while (index < newChildren.length) {
        const newChild = newChildren[index];

        const newFiber = getNewFiberWithInitial(newChild, parentFiber);

        parentFiber.return = (parentFiber.return || []) as Array<MyReactFiberNode | MyReactFiberNode[]>;

        parentFiber.return.push(newFiber);

        index++;
      }

      parentFiber.afterUpdate();
    } else {
      parentFiber.beforeUpdate();

      const newFiber = getNewFiberWithInitial(children, parentFiber);

      parentFiber.return = newFiber;

      parentFiber.afterUpdate();
    }
  }

  // const newChildren = children as ArrayMyReactElementChildren;

  // const prevFiberReturn = isUpdate ? parentFiber.return : [];

  // const prevFiberChildren = Array.isArray(prevFiberReturn) ? prevFiberReturn : [prevFiberReturn];

  // const assignPrevFiberChildren = getKeyMatchedChildren(children, prevFiberChildren, renderScope.isAppMounted);

  // parentFiber.beforeUpdate();

  // let index = 0;

  // while (index < newChildren.length || index < assignPrevFiberChildren.length) {
  //   const newChild = newChildren[index];
  //   const prevFiberChild = prevFiberChildren[index];
  //   const assignPrevFiberChild = assignPrevFiberChildren[index];

  //   const newFiber = isUpdate
  //     ? getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild)
  //     : getNewFiberWithInitial(newChild, parentFiber);

  //   parentFiber.return = (parentFiber.return || []) as Array<MyReactFiberNode | MyReactFiberNode[]>;

  //   parentFiber.return.push(newFiber);

  //   index++;
  // }

  // parentFiber.afterUpdate();

  return parentFiber.children;
};

export const transformKeepLiveChildrenFiber = (parentFiber: MyReactFiberNode, children: MyReactElementNode) => {
  const isUpdate = parentFiber.mode & UPDATE_TYPE.__update__;

  if (__DEV__) {
    const log = parentFiber.root.globalPlatform.log;

    log({
      message: `you are using internal <KeepLive /> component to render different component by toggle logic, pls note this is a experimental feature, 
    1. <KeepLive /> component will not clean rendered tree state when render a different component, so it will keep dom(like <input /> value and soon), hook, state.
    2. <KeepLive /> component currently can not contain any <Portal /> component, will cause some bug
    `,
      fiber: parentFiber,
      triggerOnce: true,
    });
  }

  if (!isUpdate) return transformChildrenFiber(parentFiber, children);

  const globalDispatch = parentFiber.root.globalDispatch;

  const prevFiber = parentFiber.child;

  const cachedFiber = globalDispatch.resolveKeepLive(parentFiber, children);

  if (cachedFiber) {
    parentFiber.beforeUpdate();

    const newChildFiber = updateFiberNode({ fiber: cachedFiber, parent: parentFiber, prevFiber: prevFiber }, children);

    parentFiber.return = newChildFiber;

    parentFiber.afterUpdate();

    // it is a cachedFiber, so should deactivate prevFiber
    if (prevFiber !== cachedFiber) {
      globalDispatch.pendingDeactivate(parentFiber);
    }
    return parentFiber.children;
  } else {
    // not have cachedFiber, maybe it is a first time to run
    parentFiber.beforeUpdate();

    const newChildFiber = createFiberNode({ parent: parentFiber, type: "position" }, children);

    parentFiber.return = newChildFiber;

    parentFiber.afterUpdate();

    globalDispatch.pendingDeactivate(parentFiber);

    return parentFiber.children;
  }
};
