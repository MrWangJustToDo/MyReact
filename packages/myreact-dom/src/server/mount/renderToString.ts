import { __my_react_shared__ } from "@my-react/react";
import { initialFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

import { PlainElement, ServerDomContainer, ServerDomDispatch } from "@my-react-dom-server";
import { MyReactDomPlatform, startRender, startRenderAsync } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX} from "@my-react/react";


const { enableScopeTreeLog } = __my_react_shared__;

const renderToStringSync = (element: MyReactElement) => {
  const container = new PlainElement("");

  const fiber = new MyReactFiberContainer(element, container);

  const renderDispatch = new ServerDomDispatch();

  const renderContainer = new ServerDomContainer(container, fiber, MyReactDomPlatform, renderDispatch);

  fiber.renderContainer = renderContainer;

  renderContainer.isServerRender = true;

  initialFiberNode(fiber);

  startRender(fiber);

  delete renderContainer.isServerRender;

  return container.toString();
};

const renderToStringAsync = async (element: MyReactElement) => {
  const container = new PlainElement("");

  const fiber = new MyReactFiberContainer(element, container);

  const renderDispatch = new ServerDomDispatch();

  const renderContainer = new ServerDomContainer(container, fiber, MyReactDomPlatform, renderDispatch);

  fiber.renderContainer = renderContainer;

  renderContainer.isServerRender = true;

  initialFiberNode(fiber);

  await startRenderAsync(fiber);

  delete renderContainer.isServerRender;

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
