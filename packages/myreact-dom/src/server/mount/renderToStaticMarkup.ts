import { isValidElement } from "@my-react/react";
import { MyReactFiberNode, initialFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { ServerDomDispatch } from "@my-react-dom-server/renderDispatch";
import { checkRoot, initServer, startRender, wrapperFunc } from "@my-react-dom-shared";

import type { LikeJSX } from "@my-react/react";

export const renderToStaticMarkup = wrapperFunc((element: LikeJSX) => {
  if (isValidElement(element)) {
    initServer();

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new ServerDomDispatch(container, fiber, element);

    renderDispatch.isServerRender = true;

    initialFiberNode(fiber, renderDispatch);

    startRender(fiber, renderDispatch);

    return container.toString();
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToStaticMarkup' can only render a '@my-react' element`);
  }
});
