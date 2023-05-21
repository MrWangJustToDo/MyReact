import { __my_react_shared__ } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { PlainElement, ServerDomDispatch } from "@my-react-dom-server";
import { MyReactDomPlatform, startRender, startRenderAsync } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX } from "@my-react/react";

const { enableScopeTreeLog } = __my_react_shared__;

const renderToStringSync = (element: MyReactElement) => {
  const container = new PlainElement("");

  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ServerDomDispatch(container, fiber, MyReactDomPlatform);

  renderDispatch.isServerRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch);

  delete renderDispatch.isServerRender;

  return container.toString();
};

const renderToStringAsync = async (element: MyReactElement) => {
  const container = new PlainElement("");

  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ServerDomDispatch(container, fiber, MyReactDomPlatform);

  renderDispatch.isServerRender = true;

  initialFiberNode(fiber, renderDispatch);

  await startRenderAsync(fiber, renderDispatch);

  delete renderDispatch.isServerRender;

  return container.toString();
};

export function renderToString(_element: LikeJSX): string;
export function renderToString(_element: LikeJSX, asyncRender: true): Promise<string>;
export function renderToString(_element: LikeJSX, asyncRender?: boolean) {
  const element = _element as MyReactElement;

  enableScopeTreeLog.current = false;

  if (asyncRender) {
    return renderToStringAsync(element);
  } else {
    return renderToStringSync(element);
  }
}
