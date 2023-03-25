import { __my_react_internal__ } from "@my-react/react";
import { CustomRenderController, initialFiberNode, initialPropsFromELement, initialTypeFromElement } from "@my-react/react-reconciler";

import { ServerStreamDispatch, ServerStreamPlatform } from "@my-react-dom-server";
import { DomScope, startRender, startRenderAsync } from "@my-react-dom-shared";

import type { MyReactElement, MyReactFiberNodeRoot , LikeJSX} from "@my-react/react";
import type { SimpleReadable } from "@my-react-dom-server";
import type { Readable } from "stream";

const { MyReactFiberNode } = __my_react_internal__;

const renderToStreamSync = <T extends SimpleReadable>(element: MyReactElement, stream: T) => {
  const fiber = new MyReactFiberNode(null);

  initialTypeFromElement(fiber, element);

  initialPropsFromELement(fiber, element);

  fiber._installElement(element);

  const container = {};

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderPlatform = new ServerStreamPlatform(stream);

  const renderDispatch = new ServerStreamDispatch(renderPlatform);

  const renderScope = new DomScope(rootFiber, container);

  const renderController = new CustomRenderController(renderScope);

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  renderScope.isServerRender = true;

  initialFiberNode(fiber);

  startRender(fiber);

  return stream;
};

const renderToStreamAsync = <T extends SimpleReadable>(element: MyReactElement, stream: T) => {
  const fiber = new MyReactFiberNode(null);

  initialTypeFromElement(fiber, element);

  initialPropsFromELement(fiber, element);

  fiber._installElement(element);

  const container = {};

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderPlatform = new ServerStreamPlatform(stream);

  const renderDispatch = new ServerStreamDispatch(renderPlatform);

  const renderScope = new DomScope(rootFiber, container);

  const renderController = new CustomRenderController(renderScope);

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  renderScope.isServerRender = true;

  initialFiberNode(fiber);

  startRenderAsync(fiber);

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
