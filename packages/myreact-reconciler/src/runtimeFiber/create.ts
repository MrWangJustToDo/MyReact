import { PATCH_TYPE } from "@my-react/react-shared";

import { currentRenderDispatch, debugWithNode, fiberToDispatchMap, setRefreshTypeMap } from "../share";

import { MyReactFiberNode } from "./instance";

import type { MyReactFiberNodeDev } from "./interface";
import type { MyReactElementNode } from "@my-react/react";

export const createFiberNode = (
  {
    parent,
    type = "append",
  }: {
    parent: MyReactFiberNode | null;
    type?: "append" | "position";
  },
  element: MyReactElementNode
) => {
  const renderDispatch = currentRenderDispatch.current;

  const newFiberNode = new MyReactFiberNode(element);

  fiberToDispatchMap.set(newFiberNode, renderDispatch);

  newFiberNode.parent = parent;

  parent.child = parent.child || newFiberNode;

  renderDispatch.pendingCreate(newFiberNode);

  renderDispatch.pendingUpdate(newFiberNode);

  if (type === "position") {
    renderDispatch.pendingPosition(newFiberNode);
  } else {
    renderDispatch.pendingAppend(newFiberNode);
  }

  renderDispatch.pendingRef(newFiberNode);

  renderDispatch.resolveUseIdMap(newFiberNode);

  renderDispatch.resolveScopeMap(newFiberNode);

  renderDispatch.resolveStrictMap(newFiberNode);

  renderDispatch.resolveContextMap(newFiberNode);

  renderDispatch.resolveSuspenseMap(newFiberNode);

  renderDispatch.resolveErrorBoundariesMap(newFiberNode);

  renderDispatch.patchToFiberInitial?.(newFiberNode);

  if (!(newFiberNode.patch & PATCH_TYPE.__update__)) {
    newFiberNode.memoizedProps = newFiberNode.pendingProps;
  }

  if (__DEV__) {
    setRefreshTypeMap(newFiberNode);

    const typedFiber = newFiberNode as MyReactFiberNodeDev;

    const timeNow = Date.now();

    typedFiber._debugRenderState = {
      renderCount: 1,
      mountTime: timeNow,
      prevUpdateTime: 0,
      currentUpdateTime: timeNow,
    };

    typedFiber._debugIsMount = true;

    if (typedFiber.type & renderDispatch.runtimeRef.typeForNativeNode) {
      renderDispatch.pendingLayoutEffect(typedFiber, () => debugWithNode(typedFiber));
    }
  }

  return newFiberNode;
};
