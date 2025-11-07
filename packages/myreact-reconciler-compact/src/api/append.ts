import { type MyReactFiberNode, type MyReactFiberContainer, NODE_TYPE } from "@my-react/react-reconciler";
import { include, PATCH_TYPE, remove } from "@my-react/react-shared";

import { getValidParentFiberWithNode } from "../dispatchMap";

import type { ReconcilerDispatch } from "../dispatch";

export const append = (_dispatch: ReconcilerDispatch, _fiber: MyReactFiberNode, _config: any) => {
  if (!include(_fiber.patch, PATCH_TYPE.__append__)) return;

  const isRender = !_dispatch.isAppMounted;

  const parentFiberWithNode = getValidParentFiberWithNode(_dispatch, _fiber);

  const mayFiberContainer = parentFiberWithNode as MyReactFiberContainer;

  if (!_fiber.nativeNode) {
    if (include(_fiber.type, NODE_TYPE.__text__)) {
      _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__append__);
      return;
    }
    throw new Error(`append error, current render node not have a native node`);
  }

  // const parentNode = config.getPublicInstance(parentFiberWithNode?.nativeNode || mayFiberContainer?.containerNode);
  const parentNode = parentFiberWithNode?.nativeNode || mayFiberContainer?.containerNode;

  // const rootNode = config.getPublicInstance(this.rootNode);
  const rootNode = _dispatch.rootNode;

  const isContainer = !parentNode || (parentNode && parentNode === mayFiberContainer?.containerNode);

  // const currentNode = config.getPublicInstance(_fiber.nativeNode);
  const currentNode = _fiber.nativeNode;

  if (isRender) {
    if (isContainer) {
      if (_config.appendChildToContainer) {
        _config.appendChildToContainer?.(rootNode, currentNode, _fiber);
      } else {
        _config.appendInitialChild?.(rootNode, currentNode, _fiber);
      }
    } else {
      _config.appendInitialChild?.(parentNode, currentNode, _fiber);
    }
  } else {
    if (isContainer) {
      if (_config.appendChildToContainer) {
        _config.appendChildToContainer?.(rootNode, currentNode, _fiber);
      } else {
        _config.appendChild?.(rootNode, currentNode, _fiber);
      }
    } else {
      _config.appendChild?.(parentNode, currentNode, _fiber);
    }
  }

  _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__append__);
};
