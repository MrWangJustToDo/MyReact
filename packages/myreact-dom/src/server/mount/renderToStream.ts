import { initialFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

import { PlainElement, ServerStreamContainer, ServerStreamDispatch } from "@my-react-dom-server";
import { MyReactDomPlatform, startRender, startRenderAsync } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX } from "@my-react/react";
import type { SimpleReadable } from "@my-react-dom-server";
import type { Readable } from "stream";

const renderToStreamSync = <T extends SimpleReadable>(element: MyReactElement, stream: T) => {
  const container = new PlainElement("");

  const fiber = new MyReactFiberContainer(element, container);

  const renderDispatch = new ServerStreamDispatch();

  const renderContainer = new ServerStreamContainer(container, fiber, MyReactDomPlatform, renderDispatch);

  renderContainer.stream = stream;

  fiber.container = renderContainer;

  renderContainer.isServerRender = true;

  initialFiberNode(fiber);

  startRender(fiber);

  renderContainer.isServerRender = false;

  return stream;
};

const renderToStreamAsync = <T extends SimpleReadable>(element: MyReactElement, stream: T) => {
  const container = new PlainElement("");

  const fiber = new MyReactFiberContainer(element, container);

  const renderDispatch = new ServerStreamDispatch();

  const renderContainer = new ServerStreamContainer(container, fiber, MyReactDomPlatform, renderDispatch);

  renderContainer.stream = stream;

  fiber.container = renderContainer;

  renderContainer.isServerRender = true;

  initialFiberNode(fiber);

  startRenderAsync(fiber);

  renderContainer.isServerRender = false;

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

  if (asyncRender) {
    return renderToStreamSync(element, stream);
  } else {
    return renderToStreamAsync(element, stream);
  }
}
