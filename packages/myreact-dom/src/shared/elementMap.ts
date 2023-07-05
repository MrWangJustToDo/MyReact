import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";
import type { ServerDomDispatch, ServerStreamDispatch } from "@my-react-dom-server";

/**
 * @internal
 */
export const patchToFiberInitial = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch | ServerDomDispatch | ServerStreamDispatch) => {
  let isSVG = _fiber.elementType === "svg";

  let parentFiberWithNode = null;

  if (!isSVG) {
    isSVG = _dispatch.runtimeDom.elementMap.get(_fiber.parent)?.isSVG || false;
  }

  if (_fiber.parent) {
    const mayFiberContainer = _fiber.parent as MyReactFiberContainer;
    if (mayFiberContainer.containerNode) {
      parentFiberWithNode = _fiber.parent;
    } else if (_fiber.parent.type & _dispatch.runtimeRef.typeForNativeNode) {
      parentFiberWithNode = _fiber.parent;
    } else {
      parentFiberWithNode = _dispatch.runtimeDom.elementMap.get(_fiber.parent)?.parentFiberWithNode;
    }
  }

  _dispatch.runtimeDom.elementMap.set(_fiber, { isSVG, parentFiberWithNode });
};

/**
 * @internal
 */
export const patchToFiberUnmount = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  _dispatch.runtimeDom.elementMap.delete(_fiber);
};
