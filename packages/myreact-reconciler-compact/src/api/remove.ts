import { include, STATE_TYPE } from "@my-react/react-shared";

import { getValidParentFiberWithNode } from "../dispatchMap";

import type { ReconcilerDispatch } from "../dispatch";
import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

export const remove = (_dispatch: ReconcilerDispatch, _fiber: MyReactFiberNode, _config: any) => {
  if (include(_fiber.state, STATE_TYPE.__unmount__)) return;

  if (!_fiber.nativeNode) return;

  const parentFiberWithNode = getValidParentFiberWithNode(_dispatch, _fiber);

  const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

  // const parentNode = config.getPublicInstance(parentFiberWithNode?.nativeNode || mayFiberContainer?.containerNode);
  const parentNode = parentFiberWithNode?.nativeNode || maybeContainer?.containerNode;

  // const rootNode = config.getPublicInstance(this.rootNode);
  const rootNode = _dispatch.rootNode;

  // const currentNode = config.getPublicInstance(_fiber.nativeNode);
  const currentNode = _fiber.nativeNode;

  const isContainer = !parentNode || (parentNode && parentNode === maybeContainer?.containerNode);

  if (isContainer) {
    _config.removeChildFromContainer?.(rootNode, currentNode, _fiber);
  } else {
    _config.removeChild?.(parentNode, currentNode, _fiber);
  }
};
