import { isValidElement, __my_react_shared__ } from "@my-react/react";
import { checkIsSameType, getTypeFromElementNode, initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";
import { once, STATE_TYPE } from "@my-react/react-shared";

import { ClientDomDispatch } from "@my-react-dom-client";
import { checkRoot, prepareDevContainer, startRender, unmountComponentAtNode } from "@my-react-dom-shared";

import type { MyReactElement, LikeJSX } from "@my-react/react";

export type RenderContainer = Element & {
  __fiber__: MyReactFiberNode;
  __container__: ClientDomDispatch;
};

const { enableLegacyLifeCycle, enableConcurrentMode, enablePerformanceLog } = __my_react_shared__;

/**
 * @internal
 */
export const onceLog = once(() => {
  console.log(`you are using %c@my-react%c to render this site, version: '${__VERSION__}'. see https://github.com/MrWangJustToDo/MyReact`, 'color: white;background-color: rgba(10, 190, 235, 0.8); border-radius: 2px; padding: 2px 5px', '');
});

/**
 * @internal
 */
export const onceLogPerformanceWarn = once(() => {
  console.log("[@my-react/react] performance warning log have been enabled!");
});

/**
 * @internal
 */
export const onceLogConcurrentMode = once(() => {
  console.log("[@my-react/react] concurrent mode have been enabled!");
});

/**
 * @internal
 */
export const onceLogLegacyLifeCycleMode = once(() => {
  console.log("[@my-react/react] legacy 'UNSAFE_' lifeCycle have been enabled!");
});

export const render = (_element: LikeJSX, _container: Partial<RenderContainer>) => {
  if (!isValidElement(_element)) throw new Error(`[@my-react/react-dom] 'render' can only render a '@my-react' element`);

  const container = _container as RenderContainer;

  const containerFiber = container.__fiber__;

  const element = _element as MyReactElement;

  if (containerFiber instanceof MyReactFiberNode) {
    const renderDispatch = container.__container__;

    if (renderDispatch.isAppCrashed || containerFiber.state & STATE_TYPE.__unmount__) {
      // is there are not a valid render tree, try do the pure rerender
      container.__fiber__ = null;

      container.__container__ = null;

      render(element, container);

      return;
    }

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

  if (__DEV__ && enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }

  if (__DEV__ && enableConcurrentMode.current) {
    onceLogConcurrentMode();
  }

  if (__DEV__ && enablePerformanceLog.current) {
    onceLogPerformanceWarn();
  }

  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  Array.from(container.children).forEach((n) => n.remove?.());

  container.removeAttribute?.('hydrate');

  container.setAttribute?.("render", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.isClientRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch);

  delete renderDispatch.isClientRender;
};
