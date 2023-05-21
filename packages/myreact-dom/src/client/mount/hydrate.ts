import { __my_react_shared__ } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client";
import { MyReactDomPlatform, prepareDevContainer, startRender, startRenderAsync } from "@my-react-dom-shared";

import { onceLog, onceLogConcurrentMode, onceLogLegacyLifeCycleMode } from "./render";

import type { RenderContainer } from "./render";
import type { MyReactElement, LikeJSX } from "@my-react/react";

const { enableLegacyLifeCycle, enableConcurrentMode } = __my_react_shared__;

const hydrateSync = (element: MyReactElement, container: RenderContainer) => {
  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber, MyReactDomPlatform);

  __DEV__ && prepareDevContainer(renderDispatch);

  container.setAttribute?.("hydrate", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.isHydrateRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch, true);

  delete renderDispatch.isHydrateRender;
};

const hydrateAsync = async (element: MyReactElement, container: RenderContainer) => {
  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber, MyReactDomPlatform);

  __DEV__ && prepareDevContainer(renderDispatch);

  container.setAttribute?.("hydrate", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.isHydrateRender = true;

  initialFiberNode(fiber, renderDispatch);

  await startRenderAsync(fiber, renderDispatch, true);

  delete renderDispatch.isHydrateRender;
};

export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>): void;
export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>, asyncRender: true): Promise<void>;
export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>, asyncRender?: boolean) {
  onceLog();

  if (enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }

  if (enableConcurrentMode.current) {
    onceLogConcurrentMode();
  }

  const element = _element as MyReactElement;

  if (asyncRender) {
    return hydrateAsync(element, container as RenderContainer);
  } else {
    return hydrateSync(element, container as RenderContainer);
  }
}
