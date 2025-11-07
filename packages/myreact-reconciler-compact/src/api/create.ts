import { NODE_TYPE } from "@my-react/react-reconciler";
import { include, PATCH_TYPE, remove } from "@my-react/react-shared";

import type { ReconcilerDispatch } from "../dispatch";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

export const create = (_dispatch: ReconcilerDispatch, _fiber: MyReactFiberNode, _config: any) => {
  if (!include(_fiber.patch, PATCH_TYPE.__create__)) return;

  const type = _fiber.elementType;

  const props = _fiber.pendingProps;

  // const rootContainerInstance = config.getPublicInstance(rootNode);
  const rootContainerInstance = _dispatch.rootNode;

  const hostContext = _dispatch.runtimeDom.hostContextMap.get(_fiber.parent || _fiber);

  // TODO
  if (include(_fiber.type, NODE_TYPE.__text__)) {
    const parent = _fiber.parent as MyReactFiberNode;

    const shouldNotCreate = _config?.shouldSetTextContent(parent.elementType, parent.pendingProps) || false;

    if (!shouldNotCreate) {
      _fiber.nativeNode = _config.createTextInstance(type, rootContainerInstance, hostContext, _fiber);
    }
  } else if (include(_fiber.type, NODE_TYPE.__plain__)) {
    _fiber.nativeNode = _config.createInstance(type, props, rootContainerInstance, hostContext, _fiber);
  } else if (include(_fiber.type, NODE_TYPE.__portal__)) {
    const fiberContainer = _fiber as MyReactFiberContainer;

    const containerNode = _fiber.pendingProps["container"] as Element;

    _config.preparePortalMount?.(containerNode);

    fiberContainer.containerNode = containerNode;

    if (__DEV__) containerNode.setAttribute?.("portal", "@my-react");
  } else {
    throw new Error("current type node not supported");
  }

  _fiber.memoizedProps = _fiber.pendingProps;

  _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__update__);

  _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__create__);
};
