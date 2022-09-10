import { isValidElement, __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import type {
  ArrayMyReactElementNode,
  MyReactElementNode,
  MyReactElement,
  MaybeArrayMyReactElementNode,
  MyReactFiberNode,
  MyReactFiberNodeDev,
} from "@my-react/react";

const { globalDispatch, MyReactFiberNode: MyReactFiberNodeClass, NODE_TYPE, UPDATE_TYPE } = __my_react_internal__;

const { updateFiberNode: _updateFiberNode, createFiberNode: _createFiberNode, enableKeyDiff } = __my_react_shared__;

const _updateFiberNodeWithDev = (...props: Parameters<typeof _updateFiberNode>) => {
  const [{ fiber, parent, prevFiber }, newElement] = props;

  const typedFiber = fiber as MyReactFiberNodeDev;

  const prevState = typedFiber._debugRenderState || {
    renderCount: 0,
    mountTimeStep: 0,
    prevUpdateTimeStep: 0,
    currentUpdateTimeStep: 0,
  };

  const timeNow = Date.now();

  typedFiber._debugRenderState = {
    renderCount: prevState.renderCount + 1,
    mountTime: prevState.mountTime,
    prevUpdateTime: prevState.currentUpdateTime,
    updateTimeStep: timeNow - prevState.currentUpdateTime,
    currentUpdateTime: timeNow,
  };

  const newFiber = _updateFiberNode({ fiber, parent, prevFiber }, newElement);

  return newFiber;
};

const createFiberNode = (...props: Parameters<typeof _createFiberNode>) => {
  const fiber = _createFiberNode(...props);

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const timeNow = Date.now();

    typedFiber._debugRenderState = {
      renderCount: 0,
      mountTime: timeNow,
      prevUpdateTime: timeNow,
      updateTimeStep: 0,
      currentUpdateTime: timeNow,
    };

    typedFiber._debugGlobalDispatch = globalDispatch.current;
  }

  return fiber;
};

const updateFiberNode = (...props: Parameters<typeof _updateFiberNode>) => {
  if (__DEV__) {
    return _updateFiberNodeWithDev(...props);
  } else {
    return _updateFiberNode(...props);
  }
};

const getKeyMatchedChildren = (
  newChildren: ArrayMyReactElementNode,
  prevFiberChildren: Array<MyReactFiberNode | MyReactFiberNode[]>
) => {
  const isAppMounted = globalDispatch.current.isAppMounted;
  if (!isAppMounted) return prevFiberChildren;
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

const getIsSameTypeNode = (
  newChild: MaybeArrayMyReactElementNode,
  prevFiberChild?: MyReactFiberNode | MyReactFiberNode[]
) => {
  const isAppMounted = globalDispatch.current.isAppMounted;
  if (!isAppMounted) return false;
  const newChildIsArray = Array.isArray(newChild);
  const prevElementChildIsArray = Array.isArray(prevFiberChild);
  if (newChildIsArray && prevElementChildIsArray) return true;
  if (newChildIsArray) return false;
  if (prevElementChildIsArray) return false;

  const typedPrevFiberChild = prevFiberChild as MyReactFiberNode;
  const typedNewChild = newChild as MyReactElementNode;

  const prevRenderedChild = typedPrevFiberChild?.element;
  const result = typedPrevFiberChild?.checkIsSameType(typedNewChild);
  if (
    result &&
    enableKeyDiff.current &&
    !(typedPrevFiberChild.type & NODE_TYPE.__isTextNode__) &&
    !(typedPrevFiberChild.type & NODE_TYPE.__isNullNode__)
  ) {
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
  newChild: MaybeArrayMyReactElementNode,
  parentFiber: MyReactFiberNode
): MyReactFiberNode | MyReactFiberNode[] => {
  if (Array.isArray(newChild)) {
    return newChild.map((v) => getNewFiberWithInitial(v, parentFiber)) as MyReactFiberNode[];
  }

  return createFiberNode({ fiberIndex: parentFiber.fiberIndex + 1, parent: parentFiber }, newChild);
};

export const transformChildrenFiber = (
  parentFiber: MyReactFiberNode,
  children: MaybeArrayMyReactElementNode | null | undefined
) => {
  let index = 0;

  const isUpdate = parentFiber.mode & UPDATE_TYPE.__update__;

  const newChildren = Array.isArray(children) ? children : [children];

  const prevFiberChildren = isUpdate ? parentFiber.renderedChildren : [];

  const assignPrevFiberChildren = getKeyMatchedChildren(newChildren, prevFiberChildren);

  parentFiber.beforeUpdate();

  while (index < newChildren.length || index < assignPrevFiberChildren.length) {
    const newChild = newChildren[index];
    const prevFiberChild = prevFiberChildren[index];
    const assignPrevFiberChild = assignPrevFiberChildren[index];

    const newFiber = isUpdate
      ? getNewFiberWithUpdate(newChild, parentFiber, prevFiberChild, assignPrevFiberChild)
      : getNewFiberWithInitial(newChild, parentFiber);

    parentFiber.renderedChildren.push(newFiber);

    index++;
  }

  parentFiber.afterUpdate();

  return parentFiber.children;
};
