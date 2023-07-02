import { isValidElement } from "@my-react/react";
import { MyReactFiberNode, initialFiberNode } from "@my-react/react-reconciler";

import { ContainerElement, ServerStaticDispatch } from "@my-react-dom-server";
import { checkRoot, startRender } from "@my-react-dom-shared";

import type { LikeJSX} from "@my-react/react";

export const renderToStaticMarkup = (element: LikeJSX) => {
  if (isValidElement(element)) {
    const container = new ContainerElement();

  const fiber = new MyReactFiberNode(element);

  __DEV__ && checkRoot(fiber);

  const renderDispatch = new ServerStaticDispatch(container, fiber);

  renderDispatch.isServerRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch);

  delete renderDispatch.isServerRender;

  return container.toString();
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToStaticMarkup' can only render a '@my-react' element`);
  }
}