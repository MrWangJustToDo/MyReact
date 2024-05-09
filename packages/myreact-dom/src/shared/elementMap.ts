import { STATE_TYPE, include } from "@my-react/react-shared";

import { getFiberWithNativeDom } from "./getFiberWithDom";

import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { ServerDomDispatch, LegacyServerStreamDispatch } from "@my-react-dom-server/renderDispatch";

/**
 * @internal
 * TODO
 */
export const initialElementMap = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch | ServerDomDispatch | LegacyServerStreamDispatch) => {
  let parentFiberWithNode: MyReactFiberNode | null = null;

  let parentFiberWithSVG: MyReactFiberNode | null = null;

  if (_fiber.elementType === "svg") {
    parentFiberWithSVG = _fiber;
  }

  if (_fiber.parent) {
    const mayFiberContainer = _fiber.parent as MyReactFiberContainer;
    if (mayFiberContainer.containerNode) {
      parentFiberWithNode = _fiber.parent;
    } else if (include(_fiber.parent.type, _dispatch.runtimeRef.typeForNativeNode)) {
      parentFiberWithNode = _fiber.parent;
    } else {
      parentFiberWithNode = _dispatch.runtimeDom.elementMap.get(_fiber.parent);
    }
    parentFiberWithSVG = parentFiberWithSVG || _dispatch.runtimeDom.svgMap.get(_fiber.parent);
  }

  if (parentFiberWithNode) {
    _dispatch.runtimeDom.elementMap.set(_fiber, parentFiberWithNode);
  }

  if (parentFiberWithSVG) {
    _dispatch.runtimeDom.svgMap.set(_fiber, parentFiberWithSVG);
  }
};

/**
 * @internal
 */
export const unmountElementMap = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  _dispatch.runtimeDom.svgMap.delete(_fiber);
  _dispatch.runtimeDom.elementMap.delete(_fiber);
};

/**
 * @internal
 */
export const getValidParentFiberWithNode = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  let parentFiberWithNode = _dispatch.runtimeDom.elementMap.get(_fiber);

  if (!parentFiberWithNode || include(parentFiberWithNode.state, STATE_TYPE.__unmount__)) {
    parentFiberWithNode = getFiberWithNativeDom(_fiber.parent, (f) => f.parent) as MyReactFiberNode;

    _dispatch.runtimeDom.elementMap.set(_fiber, parentFiberWithNode);
  }

  return parentFiberWithNode;
};

/**
 * @internal
 */
export const getValidParentFiberWithSVG = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  let parentFiberWithSVG = _dispatch.runtimeDom.svgMap.get(_fiber);

  if (!parentFiberWithSVG || include(parentFiberWithSVG.state, STATE_TYPE.__unmount__)) {
    const parentFiberWithNode = getFiberWithNativeDom(_fiber.parent, (f) => f.parent) as MyReactFiberNode;

    if (parentFiberWithNode) {
      if (parentFiberWithNode.elementType === "svg") {
        parentFiberWithSVG = parentFiberWithNode;
      } else {
        parentFiberWithSVG = _dispatch.runtimeDom.svgMap.get(parentFiberWithNode);
      }
    }

    if (parentFiberWithSVG) {
      _dispatch.runtimeDom.svgMap.set(_fiber, parentFiberWithSVG);
    }
  }

  return parentFiberWithSVG;
};
