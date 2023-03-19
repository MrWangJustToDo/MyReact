import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { checkIsSameType, initialPropsFromELement, initialTypeFromElement, initialFiberNode } from "@my-react/react-reconciler";
import { once } from "@my-react/react-shared";

import { ClientDomPlatform, ClientDomDispatch, ClientDomController } from "@my-react-dom-client";
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

const { enableStrictLifeCycle, enableLegacyLifeCycle, enableConcurrentMode } = __my_react_shared__;

export const onceLog = once(() => {
  console.log(`you are using @my-react to render this site, version: '${__VERSION__}'. see https://github.com/MrWangJustToDo/MyReact`);
});

export const onceLogConcurrentMode = once(() => {
  console.log("[@my-react] concurrent mode have been enabled!");
});

export const onceLogNewStrictMode = once(() => {
  console.log("[@my-react] react-18 like lifecycle have been enabled!");
});

export const onceLogLegacyLifeCycleMode = once(() => {
  console.log("[@my-react] legacy 'UNSAFE_' lifeCycle have been enabled!");
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

  if (enableConcurrentMode.current) {
    onceLogConcurrentMode();
  }

  if (enableStrictLifeCycle.current) {
    onceLogNewStrictMode();
  }

  if (enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }

  const fiber = new MyReactFiberNodeClass(null);

  initialTypeFromElement(fiber, element);

  initialPropsFromELement(fiber, element);

  fiber._installElement(element);

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderPlatform = new ClientDomPlatform();

  const renderDispatch = new ClientDomDispatch(renderPlatform);

  const renderScope = new DomScope(rootFiber, container);

  const renderController = new ClientDomController(renderScope);

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
