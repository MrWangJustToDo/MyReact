import { NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";
import { include, PATCH_TYPE, remove } from "@my-react/react-shared";

import type { ReconcilerDispatch } from "../dispatch";

export const update = (_dispatch: ReconcilerDispatch, _fiber: MyReactFiberNode, _config: any) => {
  if (!include(_fiber.patch, PATCH_TYPE.__update__)) return;

  // const node = config.getPublicInstance(_fiber.nativeNode);
  const node = _fiber.nativeNode;

  const type = _fiber.elementType;

  const oldProps = _fiber.memoizedProps;

  const newProps = _fiber.pendingProps;

  // const rootContainerInstance = config.getPublicInstance(rootNode);
  const rootContainerInstance = _dispatch.rootNode;

  const hostContext = _dispatch.runtimeDom.hostContextMap.get(_fiber.parent || _fiber);

  if (include(_fiber.type, NODE_TYPE.__text__)) {
    _config.commitTextUpdate?.(node, _fiber.memoizedText, _fiber.pendingText);
  } else if (include(_fiber.type, NODE_TYPE.__plain__)) {
    if (typeof _config.prepareUpdate === "function") {
      const updatePayload = _config.prepareUpdate(node, type, oldProps, newProps, rootContainerInstance, hostContext, _fiber);

      if (updatePayload) {
        _config.commitUpdate(node, updatePayload, type, oldProps, newProps, _fiber);
      }
    } else {
      _config.commitUpdate(node, type, oldProps, newProps, _fiber);
    }
  }

  _fiber.memoizedProps = _fiber.pendingProps;

  _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__update__);
};
