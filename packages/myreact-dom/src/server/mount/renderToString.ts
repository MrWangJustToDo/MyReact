import { __my_react_internal__ } from "@my-react/react";
import { CustomRenderController, initialFiberNode, initialPropsFromELement, initialTypeFromElement } from "@my-react/react-reconciler";

import { PlainElement, ServerDomDispatch, ServerDomPlatform } from "@my-react-dom-server";
import { DomScope, startRender, startRenderAsync } from "@my-react-dom-shared";

import type { MyReactElement, MyReactFiberNodeRoot, LikeJSX } from "@my-react/react";

const { MyReactFiberNode } = __my_react_internal__;

const renderToStringSync = (element: MyReactElement) => {
  const fiber = new MyReactFiberNode(null);

  initialTypeFromElement(fiber, element);

  initialPropsFromELement(fiber, element);

  fiber._installElement(element);

  const container = new PlainElement("");

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderPlatform = new ServerDomPlatform();

  const renderDispatch = new ServerDomDispatch(renderPlatform);

  const renderScope = new DomScope(rootFiber, container);

  const renderController = new CustomRenderController(renderScope);

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  renderScope.isServerRender = true;

  initialFiberNode(fiber);

  startRender(fiber);

  renderScope.isServerRender = false;

  return container.toString();
};

const renderToStringAsync = async (element: MyReactElement) => {
  const fiber = new MyReactFiberNode(null);

  initialTypeFromElement(fiber, element);

  initialPropsFromELement(fiber, element);

  fiber._installElement(element);

  const container = new PlainElement("");

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderPlatform = new ServerDomPlatform();

  const renderDispatch = new ServerDomDispatch(renderPlatform);

  const renderScope = new DomScope(rootFiber, container);

  const renderController = new CustomRenderController(renderScope);

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  renderScope.isServerRender = true;

  initialFiberNode(fiber);

  await startRenderAsync(fiber);

  renderScope.isServerRender = false;

  return container.toString();
};

export function renderToString(_element: LikeJSX): string;
export function renderToString(_element: LikeJSX, asyncRender: true): Promise<string>;
export function renderToString(_element: LikeJSX, asyncRender?: boolean) {
  const element = _element as MyReactElement;

  if (asyncRender) {
    return renderToStringAsync(element);
  } else {
    return renderToStringSync(element);
  }
}
