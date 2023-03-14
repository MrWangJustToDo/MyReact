import { __my_react_internal__ } from "@my-react/react";
import { initialPropsFromELement, initialTypeFromElement, initialFiberNode } from "@my-react/react-reconciler";

import { ClientDomPlatform, ClientDomDispatch, ClientDomController } from "@my-react-dom-client";
import { startRender, startRenderAsync, DomScope } from "@my-react-dom-shared";

import { onceLog } from "./render";

import type { RenderContainer } from "./render";
import type { MyReactElement, MyReactFiberNodeRoot } from "@my-react/react";

const { MyReactFiberNode } = __my_react_internal__;

const hydrateSync = (element: MyReactElement, container: RenderContainer) => {
  onceLog();

  const fiber = new MyReactFiberNode(null);

  initialTypeFromElement(fiber, element);

  initialPropsFromELement(fiber, element);

  fiber._installElement(element);

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderPlatform = new ClientDomPlatform();

  const renderDispatch = new ClientDomDispatch(renderPlatform);

  const renderScope = new DomScope(rootFiber, container);

  const renderController = new ClientDomController(renderScope);

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  renderScope.isPending = true;

  renderScope.isHydrateRender = true;

  container.setAttribute?.("hydrate", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__scope__ = renderScope;

  container.__platform__ = renderPlatform;

  container.__dispatch__ = renderDispatch;

  initialFiberNode(fiber);

  startRender(fiber, true);

  renderScope.isPending = false;

  renderScope.isHydrateRender = false;
};

const hydrateAsync = async (element: MyReactElement, container: RenderContainer) => {
  onceLog();

  const fiber = new MyReactFiberNode(null);

  initialTypeFromElement(fiber, element);

  initialPropsFromELement(fiber, element);

  fiber._installElement(element);

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderPlatform = new ClientDomPlatform();

  const renderDispatch = new ClientDomDispatch(renderPlatform);

  const renderScope = new DomScope(rootFiber, container);

  const renderController = new ClientDomController(renderScope);

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  renderScope.isPending = true;

  renderScope.isHydrateRender = true;

  container.setAttribute?.("hydrate", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__scope__ = renderScope;

  container.__dispatch__ = renderDispatch;

  initialFiberNode(fiber);

  await startRenderAsync(fiber, true);

  renderScope.isPending = false;

  renderScope.isHydrateRender = false;
};

export function hydrate(element: MyReactElement, container: Partial<RenderContainer>): void;
export function hydrate(element: MyReactElement, container: Partial<RenderContainer>, asyncRender: true): Promise<void>;
export function hydrate(element: MyReactElement, container: Partial<RenderContainer>, asyncRender?: boolean) {
  if (asyncRender) {
    return hydrateAsync(element, container as RenderContainer);
  } else {
    return hydrateSync(element, container as RenderContainer);
  }
}
