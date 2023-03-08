import { __my_react_internal__ } from "@my-react/react";
import { checkIsSameType, initialFiberNode } from "@my-react/react-reconciler";
import { once } from "@my-react/react-shared";

import { ClientDomPlatform, ClientDomDispatch, CustomRenderController } from "@my-react-dom-client";
import { startRender, unmountComponentAtNode, DomScope } from "@my-react-dom-shared";

import type { MyReactElement, MyReactFiberNode, RenderScope, MyReactFiberNodeRoot } from "@my-react/react";
import type { RenderDispatch, RenderPlatform } from "@my-react/react-reconciler";

export type RenderContainer = Element & {
  __scope__: RenderScope;
  __fiber__: MyReactFiberNode;
  __dispatch__: RenderDispatch;
  __platform__: RenderPlatform;
};

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

export const onceLog = once(() => {
  console.log("you are using @my-react to render this site, see https://github.com/MrWangJustToDo/MyReact");
});

export const render = (element: MyReactElement, container: RenderContainer) => {
  const containerFiber = container.__fiber__;

  if (containerFiber instanceof MyReactFiberNodeClass) {
    containerFiber.root.renderScope.isAppCrash = false;

    if (checkIsSameType(containerFiber, element)) {
      containerFiber._installElement(element);

      containerFiber._update();

      return;
    } else {
      unmountComponentAtNode(container);
    }
  }
  onceLog();

  const fiber = new MyReactFiberNodeClass(null, element);

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderPlatform = new ClientDomPlatform();

  const renderDispatch = new ClientDomDispatch(renderPlatform);

  const renderScope = new DomScope(rootFiber, container);

  const renderController = new CustomRenderController(renderScope);

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

  container.__platform__ = renderPlatform;

  container.__dispatch__ = renderDispatch;

  initialFiberNode(fiber);

  startRender(fiber);
};
