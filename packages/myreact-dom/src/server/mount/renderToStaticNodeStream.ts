import { isValidElement } from "@my-react/react";
import { MyReactFiberNode, initialFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { ServerStaticStreamDispatch } from "@my-react-dom-server/renderDispatch";
import { prepareRenderPlatform } from "@my-react-dom-server/renderPlatform";
import { checkRoot, startRender } from "@my-react-dom-shared";

import type { LikeJSX } from "@my-react/react";
import type { Readable } from "stream";

export const renderToStaticNodeStream = (element: LikeJSX): Readable => {
  if (isValidElement(element)) {
    prepareRenderPlatform();

    const temp = [];
    (temp as any).destroy = () => {
      void 0;
    };
    (temp as any).pipe = () => {
      return temp;
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-empty-function
    const stream = typeof window === "undefined" ? new (require("stream").Readable)({ read() {} }) : temp;

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new ServerStaticStreamDispatch(container, fiber);

    renderDispatch.stream = stream;

    renderDispatch.isServerRender = true;

    initialFiberNode(fiber, renderDispatch);

    startRender(fiber, renderDispatch);

    return stream;
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToStaticNodeStream' can only render a '@my-react' element`);
  }
};
