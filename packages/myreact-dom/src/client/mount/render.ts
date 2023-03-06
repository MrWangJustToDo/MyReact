import { __my_react_internal__ } from "@my-react/react";
import { checkIsSameType, initialFiberNode } from "@my-react/react-reconciler";
import { once } from "@my-react/react-shared";

import { CustomRenderScope, CustomRenderDispatch, CustomRenderController } from "@my-react-dom-client/render";

import { DomPlatform, startRender, unmountComponentAtNode } from "../../shared";

import type { MyReactElement, MyReactFiberNode, FiberDispatch, RenderScope, MyReactFiberNodeRoot } from "@my-react/react";

export type RenderContainer = Element & {
  __scope__: RenderScope;
  __fiber__: MyReactFiberNode;
  __dispatch__: FiberDispatch;
};

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

const onceLog = once(() => {
  console.log("you are using @my-react to render this site, see https://github.com/MrWangJustToDo/MyReact");
});

export const render = (element: MyReactElement, container: RenderContainer) => {
  const containerFiber = container.__fiber__;

  if (containerFiber instanceof MyReactFiberNodeClass) {
    containerFiber.root.renderScope.isAppCrash = false;

    if (checkIsSameType(containerFiber, element)) {
      containerFiber.installElement(element);

      containerFiber.update();

      return;
    } else {
      unmountComponentAtNode(container);
    }
  }
  onceLog();

  const fiber = new MyReactFiberNodeClass(null, element);

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderDispatch = new CustomRenderDispatch();

  const renderScope = new CustomRenderScope(rootFiber, container);

  const renderController = new CustomRenderController(renderScope);

  const renderPlatform = new DomPlatform("myreact-dom");

  Array.from(container.children).forEach((n) => n.remove?.());

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  container.setAttribute?.("render", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__scope__ = renderScope;

  container.__dispatch__ = renderDispatch;

  initialFiberNode(fiber);

  startRender(fiber);
};
