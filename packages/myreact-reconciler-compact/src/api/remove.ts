import { include, STATE_TYPE } from "@my-react/react-shared";

import { getHostContainer, getValidParentFiberWithNode } from "../dispatch-map";

import type { ReconcilerDispatch } from "../dispatch";
import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

export function remove(_dispatch: ReconcilerDispatch, _fiber: MyReactFiberNode, _config: any) {
  if (include(_fiber.state, STATE_TYPE.__unmount__)) return;

  if (!_fiber.nativeNode) return;

  const parentFiberWithNode = getValidParentFiberWithNode(_dispatch, _fiber);

  const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

  // const parentNode = config.getPublicInstance(parentFiberWithNode?.nativeNode || mayFiberContainer?.containerNode);
  const parentNode = parentFiberWithNode?.nativeNode || maybeContainer?.containerNode;

  // const currentNode = config.getPublicInstance(_fiber.nativeNode);
  const currentNode = _fiber.nativeNode;

  const isContainer = !parentNode || (parentNode && parentNode === maybeContainer?.containerNode);

  if (isContainer) {
    // The host container is determined by the portal hierarchy, even while the portal itself unmounts
    _config.removeChildFromContainer?.(getHostContainer(_dispatch, _fiber), currentNode);
  } else {
    _config.removeChild?.(parentNode, currentNode);
  }
}
