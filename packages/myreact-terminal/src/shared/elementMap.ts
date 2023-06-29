import type { TerminalDispatch } from "../renderDispatch";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

export const patchToFiberInitial = (_fiber: MyReactFiberNode, _dispatch: TerminalDispatch) => {
  let parentFiberWithNode = null;

  if (_fiber.parent) {
    const mayFiberContainer = _fiber.parent as MyReactFiberContainer;
    if (mayFiberContainer.containerNode) {
      parentFiberWithNode = _fiber.parent;
    } else if (_fiber.parent.type & _dispatch.runtimeRef.typeForNativeNode) {
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
