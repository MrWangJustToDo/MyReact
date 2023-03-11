import { isValidElement, __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { UPDATE_TYPE } from "@my-react/react-shared";

import { createFiberNode, updateFiberNode } from "../runtimeFiber";
import { checkIsSameType } from "../share";

import type { RenderDispatch } from "../renderDispatch";
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

  if ((newChild === null || newChild === undefined) && (prevFiberChild === null || prevFiberChild === undefined)) return false;

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
  const renderDispatch = parentFiber.root.renderDispatch as RenderDispatch;

  const isSameType = getIsSameTypeNode(newChild, assignPrevFiberChild);

  if (isSameType) {
    if (Array.isArray(newChild) && Array.isArray(prevFiberChild) && Array.isArray(assignPrevFiberChild)) {
      const assignPrevFiberChildren = getKeyMatchedChildren(newChild, assignPrevFiberChild);

      if (newChild.length < assignPrevFiberChildren.length) renderDispatch.pendingUnmount(parentFiber, assignPrevFiberChildren.slice(newChild.length));

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
    if (assignPrevFiberChild) renderDispatch.pendingUnmount(parentFiber, assignPrevFiberChild);

    if (Array.isArray(newChild)) return newChild.map((v) => getNewFiberWithUpdate(v, parentFiber)) as MyReactFiberNode[];

    return createFiberNode({ parent: parentFiber, type: "position" }, newChild as MyReactElementNode);
  }
};

const getNewFiberWithInitial = (newChild: MaybeArrayMyReactElementNode, parentFiber: MyReactFiberNode): MyReactFiberNode | MyReactFiberNode[] => {
  if (Array.isArray(newChild)) {
    return newChild.map((v) => getNewFiberWithInitial(v, parentFiber)) as MyReactFiberNode[];
  }

  return createFiberNode({ parent: parentFiber }, newChild as MyReactElementNode);
};

// TODO
/**
 * 目前这个步骤会在比较大的loop中成为性能瓶颈
 */
export const transformChildrenFiber = (parentFiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  const isUpdate = parentFiber.mode & UPDATE_TYPE.__needUpdate__;

  const renderDispatch = parentFiber.root.renderDispatch as RenderDispatch;

  if (isUpdate) {
    if (Array.isArray(children)) {
      const newChildren = children as ArrayMyReactElementChildren;

      const prevFiberReturn = parentFiber.return || [];

      const prevFiberChildren = Array.isArray(prevFiberReturn) ? prevFiberReturn : [prevFiberReturn];

      const assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);

      parentFiber._beforeUpdate();

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

      parentFiber._afterUpdate();
    } else {
      const prevFiberReturn = parentFiber.return || null;

      if (Array.isArray(prevFiberReturn)) {
        const newChildren = [children];

        const prevFiberChildren = prevFiberReturn;

        const assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);

        parentFiber._beforeUpdate();

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

        parentFiber._afterUpdate();
      } else if (prevFiberReturn) {
        parentFiber._beforeUpdate();

        const newFiber = getNewFiberWithUpdate(children, parentFiber, prevFiberReturn, prevFiberReturn);

        parentFiber.return = newFiber;

        parentFiber._afterUpdate();
      }
    }
  } else {
    if (parentFiber.return) {
      if (__DEV__) {
        parentFiber.root.renderPlatform.log({ message: `unmount for current fiber children, look like a bug`, level: "warn" });
      }
      renderDispatch.pendingUnmount(parentFiber, parentFiber.return);
    }
    if (Array.isArray(children)) {
      const newChildren = children as ArrayMyReactElementChildren;

      parentFiber._beforeUpdate();

      let index = 0;

      while (index < newChildren.length) {
        const newChild = newChildren[index];

        const newFiber = getNewFiberWithInitial(newChild, parentFiber);

        parentFiber.return = (parentFiber.return || []) as Array<MyReactFiberNode | MyReactFiberNode[]>;

        parentFiber.return.push(newFiber);

        index++;
      }

      parentFiber._afterUpdate();
    } else {
      parentFiber._beforeUpdate();

      const newFiber = getNewFiberWithInitial(children, parentFiber);

      parentFiber.return = newFiber;

      parentFiber._afterUpdate();
    }
  }

  return parentFiber.children;
};

// TODO
// export const transformKeepLiveChildrenFiber = (parentFiber: MyReactFiberNode, children: MyReactElementNode) => {
//   const isUpdate = parentFiber.mode & (UPDATE_TYPE.__update__ | UPDATE_TYPE.__trigger__);

//   if (__DEV__) {
//     const log = parentFiber.root.renderPlatform.log;

//     log({
//       message: `you are using internal <KeepLive /> component to render different component by toggle logic, pls note this is a experimental feature,
//     1. <KeepLive /> component will not clean rendered tree state when render a different component, so it will keep dom(like <input /> value and so on), hook, state.
//     2. <KeepLive /> component sometime will cause some bug, pls do not use on the production.
//     `,
//       fiber: parentFiber,
//       triggerOnce: true,
//     });
//   }

//   if (!isUpdate) return transformChildrenFiber(parentFiber, children);

//   const renderDispatch = parentFiber.root.renderDispatch as RenderDispatch;

//   const prevFiber = parentFiber.child;

//   const cachedFiber = renderDispatch.resolveKeepLive(parentFiber, children);

//   if (cachedFiber) {
//     parentFiber.beforeUpdate();

//     parentFiber.return = updateFiberNode({ fiber: cachedFiber, parent: parentFiber, prevFiber: prevFiber }, children);

//     parentFiber.afterUpdate();

//     // it is a cachedFiber, so should deactivate prevFiber
//     if (prevFiber !== cachedFiber) {
//       renderDispatch.pendingDeactivate(parentFiber);
//     }
//     return parentFiber.children;
//   } else {
//     // not have cachedFiber, maybe it is a first time to run
//     parentFiber.beforeUpdate();

//     parentFiber.return = createFiberNode({ parent: parentFiber, type: "position" }, children);

//     parentFiber.afterUpdate();

//     renderDispatch.pendingDeactivate(parentFiber);

//     return parentFiber.children;
//   }
// };
