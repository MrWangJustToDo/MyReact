import { createElement, isValidElement } from "@my-react/react";
import { MyReactFiberNode, NODE_TYPE, initialFiberNode } from "@my-react/react-reconciler";
import { exclude } from "@my-react/react-shared";

import { ContainerElement } from "@my-react-dom-server/api";
import { startRender, startRenderAsync } from "@my-react-dom-shared";

import { NoopLegacyRenderDispatch, NoopLatestRenderDispatch } from "../renderDispatch/noopDispatch";

import type { LikeJSX } from "@my-react/react";

// !only used for test

export const legacyNoopRender = (element: LikeJSX): ContainerElement | null => {
  if (__DEV__ && isValidElement(element)) {
    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    if (exclude(fiber.type, NODE_TYPE.__function__) && exclude(fiber.type, NODE_TYPE.__class__)) {
      const Root = () => element;
      return legacyNoopRender(createElement(Root));
    }

    const renderDispatch = new NoopLegacyRenderDispatch(container, fiber, element);

    renderDispatch.isServerRender = true;

    container.__fiber__ = fiber;

    container.__container__ = renderDispatch;

    initialFiberNode(renderDispatch, fiber);

    startRender(renderDispatch, fiber);

    return container;
  }
};

export const latestNoopRender = async (element: LikeJSX): Promise<ContainerElement | null> => {
  if (__DEV__ && isValidElement(element)) {
    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    if (exclude(fiber.type, NODE_TYPE.__function__) && exclude(fiber.type, NODE_TYPE.__class__)) {
      const Root = () => element;
      return latestNoopRender(createElement(Root));
    }

    const renderDispatch = new NoopLatestRenderDispatch(container, fiber, element);

    renderDispatch.isServerRender = true;

    container.__fiber__ = fiber;

    container.__container__ = renderDispatch;

    initialFiberNode(renderDispatch, fiber);

    await startRenderAsync(renderDispatch, fiber);

    return container;
  }
};
