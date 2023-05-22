import { __my_react_shared__ } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ContainerElement, ServerStreamDispatch } from "@my-react-dom-server";
import { startRender, startRenderAsync } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX } from "@my-react/react";
import type { SimpleReadable } from "@my-react-dom-server";
import type { Readable } from "stream";

const { enableScopeTreeLog } = __my_react_shared__;

const renderToStreamSync = <T extends SimpleReadable>(element: MyReactElement, stream: T) => {
  const container = new ContainerElement();

  const fiber = new MyReactFiberNode(element);

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

  const renderDispatch = new ServerStreamDispatch(container, fiber);

  renderDispatch.stream = stream;

  renderDispatch.isServerRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRenderAsync(fiber, renderDispatch);

  delete renderDispatch.isServerRender;

  return stream;
};

export function renderToNodeStream(_element: LikeJSX): Readable;
export function renderToNodeStream(_element: LikeJSX, asyncRender: true): Readable;
export function renderToNodeStream(_element: LikeJSX, asyncRender?: boolean) {
  const temp = [];
  (temp as any).destroy = () => {
    void 0;
  };

  const element = _element as MyReactElement;

  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-empty-function
  const stream = typeof window === "undefined" ? new (require("stream").Readable)({ read() {} }) : temp;

  enableScopeTreeLog.current = false;

  if (asyncRender) {
    return renderToStreamSync(element, stream);
  } else {
    return renderToStreamAsync(element, stream);
  }
}
