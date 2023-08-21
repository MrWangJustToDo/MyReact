import { isValidElement } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { ServerStreamDispatch } from "@my-react-dom-server/renderDispatch";
import { prepareRenderPlatform } from "@my-react-dom-server/renderPlatform";
import { checkRoot, startRender, startRenderAsync } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX } from "@my-react/react";
import type { SimpleReadable } from "@my-react-dom-server/renderDispatch";
import type { Readable } from "stream";


const renderToStreamSync = <T extends SimpleReadable>(element: MyReactElement, stream: T) => {
  const container = new ContainerElement();

  const fiber = new MyReactFiberNode(element);

  __DEV__ && checkRoot(fiber);

  const renderDispatch = new ServerStreamDispatch(container, fiber);

  renderDispatch.stream = stream;

  renderDispatch.isServerRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch);

  delete renderDispatch.isServerRender;

  return stream;
};

const renderToStreamAsync = <T extends SimpleReadable>(element: MyReactElement, stream: T) => {
  const container = new ContainerElement();

  const fiber = new MyReactFiberNode(element);

  __DEV__ && checkRoot(fiber);

  const renderDispatch = new ServerStreamDispatch(container, fiber);

  renderDispatch.stream = stream;

  renderDispatch.isServerRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRenderAsync(fiber, renderDispatch);

  delete renderDispatch.isServerRender;

  return stream;
};

export function renderToNodeStream(element: LikeJSX): Readable;
export function renderToNodeStream(element: LikeJSX, asyncRender: true): Readable;
export function renderToNodeStream(element: LikeJSX, asyncRender?: boolean): Readable {
  if (isValidElement(element)) {
    const temp = [];
    (temp as any).destroy = () => {
      void 0;
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-empty-function
    const stream = typeof window === "undefined" ? new (require("stream").Readable)({ read() {} }) : temp;

    prepareRenderPlatform();

    if (asyncRender) {
      return renderToStreamSync(element, stream);
    } else {
      return renderToStreamAsync(element, stream);
    }
  } else {
    throw new Error(`[@my-react/react-dom-server] 'renderToNodeStream' can only render a '@my-react' element`);
  }
}
