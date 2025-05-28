import { isValidElement, __my_react_shared__, __my_react_internal__ } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { prepareDevContainer, checkRehydrate, getError, clearError } from "@my-react-dom-client/tools";
import { autoSetDevHMR, autoSetDevTools, checkRoot, enableNewEntry, initClient, startRender, startRenderAsync, wrapperFunc } from "@my-react-dom-shared";

import { onceLog, onceLogConcurrentMode, onceLogLegacyLifeCycleMode, onceLogPerformanceWarn } from "./render";

import type { RenderContainer } from "./render";
import type { MyReactElement, LikeJSX } from "@my-react/react";

const { currentScheduler } = __my_react_internal__;

const { enableLegacyLifeCycle, enableConcurrentMode, enablePerformanceLog } = __my_react_shared__;

const throwHydrateError = (renderDispatch: ClientDomDispatch) => {
  const errorArray = getError(renderDispatch);

  if (!errorArray) return;

  while (errorArray?.length > 0) {
    const error = errorArray.shift();
    window.dispatchEvent(
      new ErrorEvent("error", {
        error: error.value,
        message: error?.value?.message,
      })
    );
  }

  clearError(renderDispatch);
};

const hydrateSync = (element: MyReactElement, container: RenderContainer, cb?: () => void) => {
  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber, element);

  const renderScheduler = currentScheduler.current;

  renderScheduler.dispatchSet.uniPush(renderDispatch);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  cb && renderDispatch.pendingEffect(fiber, cb);

  container.setAttribute?.("hydrate", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.enableNewEntry = false;

  renderDispatch.renderMode = "hydrate";

  renderDispatch.isHydrateRender = true;

  autoSetDevTools(renderDispatch, renderScheduler);

  autoSetDevHMR(renderDispatch);

  initialFiberNode(renderDispatch, fiber);

  startRender(renderDispatch, fiber, true);

  throwHydrateError(renderDispatch);

  delete renderDispatch.isHydrateRender;
};

const hydrateAsync = async (element: MyReactElement, container: RenderContainer, cb?: () => void) => {
  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber, element);

  const renderScheduler = currentScheduler.current;

  renderScheduler.dispatchSet.uniPush(renderDispatch);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  cb && renderDispatch.pendingEffect(fiber, cb);

  container.setAttribute?.("hydrate", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.enableNewEntry = true;

  renderDispatch.renderMode = "hydrateRoot";

  renderDispatch.isHydrateRender = true;

  autoSetDevTools(renderDispatch, renderScheduler);

  autoSetDevHMR(renderDispatch);

  initialFiberNode(renderDispatch, fiber);

  await startRenderAsync(renderDispatch, fiber, true);

  throwHydrateError(renderDispatch);

  delete renderDispatch.isHydrateRender;
};

/**
 * @internal
 */
export const internalHydrate = (element: LikeJSX, container: Partial<RenderContainer>, cb?: () => void) => {
  if (!isValidElement(element)) throw new Error(`[@my-react/react-dom] 'hydrate' can only render a '@my-react' element`);

  initClient();

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

  if (__DEV__) {
    // check rehydrate
    checkRehydrate(container);
  }

  const newEntry = enableNewEntry.current;

  if (newEntry) {
    hydrateAsync(element, container as RenderContainer, cb);
  } else {
    hydrateSync(element, container as RenderContainer, cb);
  }
};

export const hydrate = wrapperFunc((element: LikeJSX, container: Partial<RenderContainer>, cb?: () => void) => {
  internalHydrate(element, container, cb);
});
