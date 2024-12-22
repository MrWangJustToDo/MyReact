import { STATE_TYPE, include } from "@my-react/react-shared";

import { getFiberWithNativeDom } from "./getFiberWithDom";

import type { TerminalDispatch } from "../renderDispatch";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

export const patchToFiberInitial = (_fiber: MyReactFiberNode, _dispatch: TerminalDispatch) => {
  let parentFiberWithNode = null;

  if (_fiber.parent) {
    const mayFiberContainer = _fiber.parent as MyReactFiberContainer;
    if (mayFiberContainer.containerNode) {
      parentFiberWithNode = _fiber.parent;
    } else if (include(_fiber.parent.type, _dispatch.runtimeRef.typeForNativeNode)) {
      parentFiberWithNode = _fiber.parent;
    } else {
      parentFiberWithNode = _dispatch.runtimeDom.elementMap.get(_fiber.parent);
    }
  }

  _dispatch.runtimeDom.elementMap.set(_fiber, parentFiberWithNode);
};

export const patchToFiberUnmount = (_fiber: MyReactFiberNode, _dispatch: TerminalDispatch) => {
  _dispatch.runtimeDom.elementMap.delete(_fiber);
};

export const getValidParentFiberWithNode = (_fiber: MyReactFiberNode, _dispatch: TerminalDispatch) => {
  let parentFiberWithNode = _dispatch.runtimeDom.elementMap.get(_fiber);

  if (!parentFiberWithNode || include(parentFiberWithNode.state, STATE_TYPE.__unmount__)) {
    parentFiberWithNode = getFiberWithNativeDom(_fiber.parent, (f) => f.parent) as MyReactFiberNode;

    _dispatch.runtimeDom.elementMap.set(_fiber, parentFiberWithNode);
  }

  return parentFiberWithNode;
};
