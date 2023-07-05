import { __my_react_shared__, isValidElement } from "@my-react/react";
import { MyReactFiberNode, initialFiberNode } from "@my-react/react-reconciler";


import { ContainerElement, ServerStaticStreamDispatch } from "@my-react-dom-server";
import { checkRoot, startRender } from "@my-react-dom-shared";

import type { LikeJSX } from "@my-react/react";
import type { Readable } from "stream";

const { enableScopeTreeLog } = __my_react_shared__;

export const renderToStaticNodeStream = (element: LikeJSX): Readable => {
  if (isValidElement(element)) {
    const temp = [];
    (temp as any).destroy = () => {
      void 0;
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-empty-function
    const stream = typeof window === "undefined" ? new (require("stream").Readable)({ read() {} }) : temp;

    enableScopeTreeLog.current = false;

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new ServerStaticStreamDispatch(container, fiber);

    renderDispatch.stream = stream;

    renderDispatch.isServerRender = true;

    initialFiberNode(fiber, renderDispatch);

    startRender(fiber, renderDispatch);

    delete renderDispatch.isServerRender;

    return stream;
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToStaticNodeStream' can only render a '@my-react' element`);
  }
};
