import { isValidElement } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { ServerDomDispatch } from "@my-react-dom-server/renderDispatch";
import { prepareRenderPlatform } from "@my-react-dom-server/renderPlatform";
import { checkRoot, startRender, startRenderAsync } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX } from "@my-react/react";

const renderToStringSync = (element: MyReactElement) => {
  const container = new ContainerElement();

  const fiber = new MyReactFiberNode(element);

  __DEV__ && checkRoot(fiber);

  const renderDispatch = new ServerDomDispatch(container, fiber);

  renderDispatch.isServerRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch);

  delete renderDispatch.isServerRender;

  return container.toString();
};

const renderToStringAsync = async (element: MyReactElement) => {
  const container = new ContainerElement();

  const fiber = new MyReactFiberNode(element);

  __DEV__ && checkRoot(fiber);

  const renderDispatch = new ServerDomDispatch(container, fiber);

  renderDispatch.isServerRender = true;

  initialFiberNode(fiber, renderDispatch);

  await startRenderAsync(fiber, renderDispatch);

  delete renderDispatch.isServerRender;

  return container.toString();
};

export function renderToString(element: LikeJSX): string;
export function renderToString(element: LikeJSX, asyncRender: true): Promise<string>;
export function renderToString(element: LikeJSX, asyncRender?: boolean) {
  // checkValidElement
  if (isValidElement(element)) {
    prepareRenderPlatform();

    if (asyncRender) {
      return renderToStringAsync(element);
    } else {
      return renderToStringSync(element);
    }
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToString' can only render a '@my-react' element`);
  }
}
