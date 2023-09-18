import { isValidElement, __my_react_shared__, __my_react_internal__ } from "@my-react/react";
import { checkIsSameType, initialFiberNode, MyReactFiberNode, triggerUpdate } from "@my-react/react-reconciler";
import { include, once, STATE_TYPE } from "@my-react/react-shared";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { prepareRenderPlatform } from "@my-react-dom-client/renderPlatform";
import { unmountComponentAtNode } from "@my-react-dom-client/tools";
import { checkRoot, prepareDevContainer, startRender } from "@my-react-dom-shared";

import type { LikeJSX } from "@my-react/react";
import type { CustomRenderPlatform} from "@my-react/react-reconciler";

export type RenderContainer = Element & {
  __fiber__: MyReactFiberNode;
  __container__: ClientDomDispatch;
};

const { currentRenderPlatform } = __my_react_internal__;

const { enableLegacyLifeCycle, enableConcurrentMode, enablePerformanceLog } = __my_react_shared__;

/**
 * @internal
 */
export const onceLog = once(() => {
  console.log(
    `you are using %c@my-react%c to render this site, version: '${__VERSION__}'. see https://github.com/MrWangJustToDo/MyReact`,
    "color: white;background-color: rgba(10, 190, 235, 0.8); border-radius: 2px; padding: 2px 5px",
    ""
  );
  if (__DEV__ && Math.random() > 0.5) {
    console.log(
      `try to set %cwindow.__highlight__ = true;%c to enable dev highlight!`,
      "color: white;background-color: rgba(10, 190, 235, 0.8); border-radius: 2px; padding: 2px 5px",
      ""
    );
  }
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
  console.log("[@my-react/react] legacy 'UNSAFE' lifeCycle have been enabled!");
});

export const render = (element: LikeJSX, _container: Partial<RenderContainer>, cb?: () => void) => {
  if (!isValidElement(element)) throw new Error(`[@my-react/react-dom] 'render' can only render a '@my-react' element`);

  prepareRenderPlatform();

  const container = _container as RenderContainer;

  const containerFiber = container.__fiber__;

  if (containerFiber instanceof MyReactFiberNode) {
    const renderDispatch = container.__container__;

    if (renderDispatch.isAppCrashed || include(containerFiber.state, STATE_TYPE.__unmount__)) {
      // is there are not a valid render tree, try do the pure rerender
      container.__fiber__ = null;

      container.__container__ = null;

      render(element, container);

      return;
    }

    if (checkIsSameType(containerFiber, element)) {
      containerFiber._installElement(element);

      triggerUpdate(containerFiber, STATE_TYPE.__triggerSync__, cb);

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

  const renderPlatform = currentRenderPlatform.current as CustomRenderPlatform;

  renderPlatform.dispatchSet.uniPush(renderDispatch);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  Array.from(container.children).forEach((n) => n.remove?.());

  cb && renderDispatch.pendingEffect(fiber, cb);

  container.removeAttribute?.("hydrate");

  container.setAttribute?.("render", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.isClientRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch);

  delete renderDispatch.isClientRender;
};
