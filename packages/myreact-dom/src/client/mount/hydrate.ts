import { __my_react_shared__ } from "@my-react/react";
import { initialFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

import { ClientDomContainer, ClientDomDispatch } from "@my-react-dom-client";
import { MyReactDomPlatform, startRender, startRenderAsync } from "@my-react-dom-shared";

import { onceLog, onceLogLegacyLifeCycleMode, onceLogNewStrictMode } from "./render";

import type { RenderContainer } from "./render";
import type { MyReactElement, LikeJSX } from "@my-react/react";

const { enableStrictLifeCycle, enableLegacyLifeCycle } = __my_react_shared__;

const hydrateSync = (element: MyReactElement, container: RenderContainer) => {
  const fiber = new MyReactFiberContainer(element, container);

  const renderDispatch = new ClientDomDispatch();

  const renderContainer = new ClientDomContainer(container, fiber, MyReactDomPlatform, renderDispatch);

  fiber.container = renderContainer;

  container.setAttribute?.("hydrate", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__container__ = renderContainer;

  renderContainer.isHydrateRender = true;

  initialFiberNode(fiber);

  startRender(fiber, true);

  renderContainer.isHydrateRender = false;
};

const hydrateAsync = async (element: MyReactElement, container: RenderContainer) => {
  const fiber = new MyReactFiberContainer(element, container);

  const renderDispatch = new ClientDomDispatch();

  const renderContainer = new ClientDomContainer(container, fiber, MyReactDomPlatform, renderDispatch);

  fiber.container = renderContainer;

  container.setAttribute?.("hydrate", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__container__ = renderContainer;

  renderContainer.isHydrateRender = true;

  initialFiberNode(fiber);

  await startRenderAsync(fiber, true);

  renderContainer.isHydrateRender = false;
};

export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>): void;
export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>, asyncRender: true): Promise<void>;
export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>, asyncRender?: boolean) {
  onceLog();

  if (enableStrictLifeCycle.current) {
    onceLogNewStrictMode();
  }

  if (enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }
  const element = _element as MyReactElement;
  if (asyncRender) {
    return hydrateAsync(element, container as RenderContainer);
  } else {
    return hydrateSync(element, container as RenderContainer);
  }
}
