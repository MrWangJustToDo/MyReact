import { isValidElement, __my_react_shared__, __my_react_internal__ } from "@my-react/react";
import { checkIsSameType, CustomRenderDispatch, initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";
import { include, once, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { prepareRenderPlatform } from "@my-react-dom-client/renderPlatform";
import { prepareDevContainer, unmountComponentAtNode } from "@my-react-dom-client/tools";
import { autoSetDevTools, checkRoot, delGlobalDispatch, enableAsyncRender, startRender } from "@my-react-dom-shared";

import type { LikeJSX, TriggerUpdateQueue } from "@my-react/react";
import type { CustomRenderPlatform } from "@my-react/react-reconciler";

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
    `current site using %c@my-react%c to render, version: '${__VERSION__}'. see https://github.com/MrWangJustToDo/MyReact`,
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
  // TODO! remove
  prepareRenderPlatform();

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

  renderDispatch.enableAsyncRender = enableAsyncRender.current;

  renderDispatch.renderMode = enableAsyncRender.current ? "createRoot" : "render";

  renderDispatch.isClientRender = true;

  autoSetDevTools(renderDispatch, renderPlatform);

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch);

  delete renderDispatch.isClientRender;

  return renderDispatch;
};

export const render = (element: LikeJSX, _container: Partial<RenderContainer>, cb?: () => void) => {
  if (!isValidElement(element)) throw new Error(`[@my-react/react-dom] 'render' can only render a '@my-react' element`);

  prepareRenderPlatform();

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
      containerFiber._installElement(element);

      const updater: TriggerUpdateQueue = {
        type: UpdateQueueType.trigger,
        trigger: containerFiber,
        isSync: true,
        isForce: false,
        isSkip: false,
        isImmediate: true,
        isRetrigger: false,
        callback: cb,
      };

      currentRenderPlatform.current.dispatchState(updater);
      return;
    } else {
      unmountComponentAtNode(container);
    }
  }

  internalRender(element, container, cb);
};
