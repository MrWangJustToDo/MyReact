import { isValidElement, __my_react_shared__, __my_react_internal__ } from "@my-react/react";
import { checkIsSameType, CustomRenderDispatch, initialFiberNode, MyReactFiberNode, triggerUpdateOnFiber } from "@my-react/react-reconciler";
import { include, once, STATE_TYPE } from "@my-react/react-shared";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { prepareDevContainer, unmountComponentAtNode } from "@my-react-dom-client/tools";
import { autoSetDevHMR, autoSetDevTools, checkRoot, delGlobalDispatch, enableNewEntry, initClient, startRender, wrapperFunc } from "@my-react-dom-shared";

import type { LikeJSX } from "@my-react/react";

export type RenderContainer = Element & {
  __fiber__: MyReactFiberNode;
  __container__: ClientDomDispatch;
};

const { currentScheduler } = __my_react_internal__;

const { enableLegacyLifeCycle, enablePerformanceLog } = __my_react_shared__;

/**
 * @internal
 */
export const onceLog = once(() => {
  if (window?.__MY_REACT_DEVTOOL_RUNTIME__ || window?.["__@my-react/react-devtool-inject__"]) return;

  console.log(
    `detector %c@my-react ${__VERSION__}%c on this page. see https://github.com/MrWangJustToDo/MyReact`,
    "color: white;background-color: rgba(10, 190, 235, 0.8); border-radius: 2px; padding: 2px 5px",
    ""
  );
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

/**
 * @internal
 */
export const internalRender = (element: LikeJSX, container: RenderContainer, cb?: () => void) => {
  initClient();

  onceLog();

  if (__DEV__ && enableLegacyLifeCycle.current) {
    onceLogLegacyLifeCycleMode();
  }

  if (__DEV__ && enableNewEntry.current) {
    onceLogConcurrentMode();
  }

  if (__DEV__ && enablePerformanceLog.current) {
    onceLogPerformanceWarn();
  }

  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber, element);

  const renderScheduler = currentScheduler.current;

  renderScheduler.dispatchSet.uniPush(renderDispatch);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  Array.from(container.children).forEach((n) => n.remove?.());

  cb && renderDispatch.pendingEffect(fiber, cb);

  container.removeAttribute?.("hydrate");

  container.setAttribute?.("render", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.enableNewEntry = enableNewEntry.current;

  renderDispatch.enableConcurrentMode = enableNewEntry.current;

  renderDispatch.renderMode = enableNewEntry.current ? "createRoot" : "render";

  renderDispatch.isClientRender = true;

  autoSetDevTools(renderDispatch, renderScheduler);

  autoSetDevHMR(renderDispatch);

  initialFiberNode(renderDispatch, fiber);

  startRender(renderDispatch, fiber);

  delete renderDispatch.isClientRender;

  return renderDispatch;
};

export const render = wrapperFunc((element: LikeJSX, _container: Partial<RenderContainer>, cb?: () => void) => {
  if (!isValidElement(element)) throw new Error(`[@my-react/react-dom] 'render' can only render a '@my-react' element`);

  const container = _container as RenderContainer;

  const renderContainer = container.__container__;

  if (renderContainer instanceof CustomRenderDispatch) {
    const containerFiber = renderContainer.rootFiber;

    if (renderContainer.isAppCrashed || include(containerFiber.state, STATE_TYPE.__unmount__)) {
      // is there are not a valid render tree, try do the pure rerender
      container.__fiber__ = null;

      container.__container__ = null;

      delGlobalDispatch(renderContainer);

      render(element, container, cb);

      return;
    }

    if (checkIsSameType(containerFiber, element)) {
      renderContainer.rootElement = element;

      containerFiber._installElement(element);

      triggerUpdateOnFiber(containerFiber, STATE_TYPE.__triggerSync__, cb);
      return;
    } else {
      unmountComponentAtNode(container);
    }
  }

  internalRender(element, container, cb);
});
