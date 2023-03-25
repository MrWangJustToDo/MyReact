import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { initialPropsFromELement, initialTypeFromElement, initialFiberNode } from "@my-react/react-reconciler";

import { ClientDomPlatform, ClientDomDispatch, ClientDomController } from "@my-react-dom-client";
import { startRender, startRenderAsync, DomScope } from "@my-react-dom-shared";

import { onceLog, onceLogConcurrentMode, onceLogLegacyLifeCycleMode, onceLogNewStrictMode } from "./render";

import type { RenderContainer } from "./render";
import type { MyReactElement, MyReactFiberNodeRoot, LikeJSX } from "@my-react/react";

const { MyReactFiberNode } = __my_react_internal__;

const { enableStrictLifeCycle, enableLegacyLifeCycle, enableConcurrentMode } = __my_react_shared__;

const hydrateSync = (element: MyReactElement, container: RenderContainer) => {
  onceLog();

  if (enableConcurrentMode.current) {
    onceLogConcurrentMode();
  }

  if (enableStrictLifeCycle.current) {
    onceLogNewStrictMode();
  }

  if (enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }

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

  renderScope.isHydrateRender = true;

  container.setAttribute?.("hydrate", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__scope__ = renderScope;

  container.__platform__ = renderPlatform;

  container.__dispatch__ = renderDispatch;

  initialFiberNode(fiber);

  startRender(fiber, true);

  renderScope.isHydrateRender = false;
};

const hydrateAsync = async (element: MyReactElement, container: RenderContainer) => {
  onceLog();

  if (enableConcurrentMode.current) {
    onceLogConcurrentMode();
  }

  if (enableStrictLifeCycle.current) {
    onceLogNewStrictMode();
  }

  if (enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }

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

  renderScope.isHydrateRender = true;

  container.setAttribute?.("hydrate", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__scope__ = renderScope;

  container.__dispatch__ = renderDispatch;

  initialFiberNode(fiber);

  await startRenderAsync(fiber, true);

  renderScope.isHydrateRender = false;
};

export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>): void;
export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>, asyncRender: true): Promise<void>;
export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>, asyncRender?: boolean) {
  const element = _element as MyReactElement;
  if (asyncRender) {
    return hydrateAsync(element, container as RenderContainer);
  } else {
    return hydrateSync(element, container as RenderContainer);
  }
}
