import { __my_react_shared__ } from "@my-react/react";
import { checkIsSameType, getTypeFromElementNode, initialFiberNode, MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";
import { once, STATE_TYPE } from "@my-react/react-shared";

import { ClientDomContainer, ClientDomDispatch } from "@my-react-dom-client";
import { MyReactDomPlatform, startRender, unmountComponentAtNode } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX } from "@my-react/react";
import type { MyReactContainer } from "@my-react/react-reconciler";

export type RenderContainer = Element & {
  __fiber__: MyReactFiberNode;
  __container__: MyReactContainer;
};

const { enableStrictLifeCycle, enableLegacyLifeCycle, enableConcurrentMode } = __my_react_shared__;

export const onceLog = once(() => {
  console.log(`you are using @my-react to render this site, version: '${__VERSION__}'. see https://github.com/MrWangJustToDo/MyReact`);
});

export const onceLogNewStrictMode = once(() => {
  console.log("[@my-react/react] react-18 like lifecycle have been enabled!");
});

export const onceLogConcurrentMode = once(() => {
  console.log("[@my-react/react] concurrent mode have been enabled!");
});

export const onceLogLegacyLifeCycleMode = once(() => {
  console.log("[@my-react/react] legacy 'UNSAFE_' lifeCycle have been enabled!");
});

export const render = (_element: LikeJSX, _container: Partial<RenderContainer>) => {
  const container = _container as RenderContainer;

  const containerFiber = container.__fiber__;

  const element = _element as MyReactElement;

  if (containerFiber instanceof MyReactFiberNode) {
    const renderContainer = container.__container__;

    renderContainer.isAppCrashed = false;

    if (checkIsSameType(containerFiber, element)) {
      const { pendingProps, ref } = getTypeFromElementNode(element);

      containerFiber.ref = ref;

      containerFiber.element = element;

      containerFiber.pendingProps = pendingProps;

      containerFiber._update(STATE_TYPE.__triggerSync__);

      return;
    } else {
      unmountComponentAtNode(container);
    }
  }
  onceLog();

  if (enableStrictLifeCycle.current) {
    onceLogNewStrictMode();
  }

  if (enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }

  if (enableConcurrentMode.current) {
    onceLogConcurrentMode();
  }

  const fiber = new MyReactFiberContainer(element, container);

  const renderDispatch = new ClientDomDispatch();

  const renderContainer = new ClientDomContainer(container, fiber, MyReactDomPlatform, renderDispatch);

  fiber.renderContainer = renderContainer;

  Array.from(container.children).forEach((n) => n.remove?.());

  container.setAttribute?.("render", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderContainer;

  initialFiberNode(fiber);

  startRender(fiber);
};
