import { isValidElement } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { ServerDomDispatch } from "@my-react-dom-server/renderDispatch";
import { checkRoot, initServer, startRender, wrapperFunc } from "@my-react-dom-shared";

import type { LikeJSX } from "@my-react/react";

export const renderToString = wrapperFunc((element: LikeJSX) => {
  // checkValidElement
  if (isValidElement(element)) {
    initServer();

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new ServerDomDispatch(container, fiber, element);

    renderDispatch.isServerRender = true;

    initialFiberNode(renderDispatch, fiber);

    startRender(renderDispatch, fiber);

    return container.toString();
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToString' can only render a '@my-react' element`);
  }
});
