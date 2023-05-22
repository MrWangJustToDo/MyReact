import { __my_react_shared__ } from "@my-react/react";
import { checkIsSameType, getTypeFromElementNode, initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";
import { once, STATE_TYPE } from "@my-react/react-shared";

import { ClientDomDispatch } from "@my-react-dom-client";
import { prepareDevContainer, startRender, unmountComponentAtNode } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX } from "@my-react/react";

export type RenderContainer = Element & {
  __fiber__: MyReactFiberNode;
  __container__: ClientDomDispatch;
};

const { enableLegacyLifeCycle, enableConcurrentMode } = __my_react_shared__;

export const onceLog = once(() => {
  console.log(`you are using @my-react to render this site, version: '${__VERSION__}'. see https://github.com/MrWangJustToDo/MyReact`);
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

  if (containerFiber instanceof ClientDomDispatch) {
    const renderDispatch = container.__container__;

    renderDispatch.isAppCrashed = false;

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

  if (enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }

  if (enableConcurrentMode.current) {
    onceLogConcurrentMode();
  }

  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  Array.from(container.children).forEach((n) => n.remove?.());

  container.setAttribute?.("render", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.isClientRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch);

  delete renderDispatch.isClientRender;
};
