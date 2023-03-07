import { PATCH_TYPE } from "@my-react/react-shared";

import { generateFiberToList } from "./fiberToList";
import { unsetRef } from "./ref";

import type { RenderDispatch } from "../runtimeDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

export const unmountList = (list: ListTree<MyReactFiberNode>, renderDispatch: RenderDispatch, renderPlatform: RenderPlatform) => {
  list.listToHead((f) => f._unmount());

  list.listToHead((f) => unsetRef(f));

  if (list.head.value) renderPlatform.unmount(list.head.value);

  list.listToHead((f) => renderDispatch.processFiberUnmount(f));
};

export const unmountFiber = (fiber: MyReactFiberNode) => {
  const list = generateFiberToList(fiber);

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

  unmountList(list, renderDispatch, renderPlatform);
};

export const unmount = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingUnmount__) {
    const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

    const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

    const unmountMap = renderDispatch.unmountMap;

    const allUnmountFiber = unmountMap.get(fiber) || [];

    if (allUnmountFiber.length) allUnmountFiber.forEach((l) => unmountList(l, renderDispatch, renderPlatform));

    if (fiber.patch & PATCH_TYPE.__pendingUnmount__) fiber.patch ^= PATCH_TYPE.__pendingUnmount__;
  }
};
