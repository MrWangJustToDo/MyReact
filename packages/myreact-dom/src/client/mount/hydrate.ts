import { isValidElement, __my_react_shared__, __my_react_internal__ } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { prepareRenderPlatform } from "@my-react-dom-client/renderPlatform";
import { autoSetDevTools, checkRehydrate, checkRoot, enableASyncHydrate, prepareDevContainer, startRender, startRenderAsync } from "@my-react-dom-shared";

import { onceLog, onceLogConcurrentMode, onceLogLegacyLifeCycleMode, onceLogPerformanceWarn } from "./render";

import type { RenderContainer } from "./render";
import type { MyReactElement, LikeJSX } from "@my-react/react";
import type { CustomRenderPlatform } from "@my-react/react-reconciler";

const { currentRenderPlatform } = __my_react_internal__;

const { enableLegacyLifeCycle, enableConcurrentMode, enablePerformanceLog } = __my_react_shared__;

const throwHydrateError = (renderDispatch: ClientDomDispatch) => {
  if (renderDispatch?._runtimeError) {
    while (renderDispatch._runtimeError.length > 0) {
      const error = renderDispatch._runtimeError.shift();
      window.dispatchEvent(
        new ErrorEvent("error", {
          error: Error(error?.value?.message + error.stack),
          message: error?.value?.message,
        })
      );
    }
    delete renderDispatch._runtimeError;
  }
};

const hydrateSync = (element: MyReactElement, container: RenderContainer, cb?: () => void) => {
  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber);

  const renderPlatform = currentRenderPlatform.current as CustomRenderPlatform;

  renderPlatform.dispatchSet.uniPush(renderDispatch);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  cb && renderDispatch.pendingEffect(fiber, cb);

  container.setAttribute?.("hydrate", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.enableASyncHydrate = false;

  renderDispatch.isHydrateRender = true;

  autoSetDevTools(renderDispatch, renderPlatform);

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch, true);

  throwHydrateError(renderDispatch);

  delete renderDispatch.isHydrateRender;
};

const hydrateAsync = async (element: MyReactElement, container: RenderContainer, cb?: () => void) => {
  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber);

  const renderPlatform = currentRenderPlatform.current as CustomRenderPlatform;

  renderPlatform.dispatchSet.uniPush(renderDispatch);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  cb && renderDispatch.pendingEffect(fiber, cb);

  container.setAttribute?.("hydrate", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.enableASyncHydrate = true;

  renderDispatch.isHydrateRender = true;

  autoSetDevTools(renderDispatch, renderPlatform);

  initialFiberNode(fiber, renderDispatch);

  await startRenderAsync(fiber, renderDispatch, true);

  throwHydrateError(renderDispatch);

  delete renderDispatch.isHydrateRender;
};

/**
 * @internal
 */
export const internalHydrate = (element: LikeJSX, container: Partial<RenderContainer>, cb?: () => void) => {
  if (!isValidElement(element)) throw new Error(`[@my-react/react-dom] 'hydrate' can only render a '@my-react' element`);

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

  if (__DEV__) {
    // check rehydrate
    checkRehydrate(container);
  }

  const asyncHydrate = enableASyncHydrate.current;

  if (asyncHydrate) {
    hydrateAsync(element, container as RenderContainer, cb);
  } else {
    hydrateSync(element, container as RenderContainer, cb);
  }
};

export const hydrate = (element: LikeJSX, container: Partial<RenderContainer>, cb?: () => void) => {
  enableASyncHydrate.current = false;

  internalHydrate(element, container, cb);
};
