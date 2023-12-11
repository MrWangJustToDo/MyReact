import { isValidElement } from "@my-react/react";
import { MyReactFiberNode, initialFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { checkRoot, startRender, startRenderAsync } from "@my-react-dom-shared";

import { NoopLegacyRenderDispatch, NoopLatestRenderDispatch } from "../renderDispatch/noopDispatch";
// import { beforeNoopRender } from "../renderPlatform";

import type { LikeJSX } from "@my-react/react";

// !only used for test

export const legacyNoopRender = (element: LikeJSX): ContainerElement | null => {
  if (isValidElement(element)) {
    // beforeNoopRender();

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new NoopLegacyRenderDispatch(container, fiber);

    renderDispatch.isServerRender = true;

    container.__fiber__ = fiber;

    container.__container__ = renderDispatch;

    initialFiberNode(fiber, renderDispatch);

    startRender(fiber, renderDispatch);

    return container;
  }
};

export const latestNoopRender = async (element: LikeJSX): Promise<ContainerElement | null> => {
  if (isValidElement(element)) {
    // beforeNoopRender();

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new NoopLatestRenderDispatch(container, fiber);

    renderDispatch.isServerRender = true;

    container.__fiber__ = fiber;

    container.__container__ = renderDispatch;

    initialFiberNode(fiber, renderDispatch);

    await startRenderAsync(fiber, renderDispatch);

    return container;
  }
};
