import { isValidElement, __my_react_shared__ } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { prepareRenderPlatform } from "@my-react-dom-client/renderPlatform";
import { checkRehydrate, checkRoot, prepareDevContainer, startRender, startRenderAsync } from "@my-react-dom-shared";

import { onceLog, onceLogConcurrentMode, onceLogLegacyLifeCycleMode, onceLogPerformanceWarn } from "./render";

import type { RenderContainer } from "./render";
import type { MyReactElement, LikeJSX } from "@my-react/react";

const { enableLegacyLifeCycle, enableConcurrentMode, enablePerformanceLog } = __my_react_shared__;

const hydrateSync = (element: MyReactElement, container: RenderContainer) => {
  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  container.setAttribute?.("hydrate", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.isHydrateRender = true;

  initialFiberNode(fiber, renderDispatch);

  startRender(fiber, renderDispatch, true);

  delete renderDispatch.isHydrateRender;
};

const hydrateAsync = async (element: MyReactElement, container: RenderContainer) => {
  const fiber = new MyReactFiberNode(element);

  const renderDispatch = new ClientDomDispatch(container, fiber);

  __DEV__ && checkRoot(fiber);

  __DEV__ && prepareDevContainer(renderDispatch);

  container.setAttribute?.("hydrate", "@my-react");

  container.__fiber__ = fiber;

  container.__container__ = renderDispatch;

  renderDispatch.isHydrateRender = true;

  initialFiberNode(fiber, renderDispatch);

  await startRenderAsync(fiber, renderDispatch, true);

  delete renderDispatch.isHydrateRender;
};

export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>): void;
export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>, asyncRender: true): Promise<void>;
export function hydrate(_element: LikeJSX, container: Partial<RenderContainer>, asyncRender?: boolean) {
  if (!isValidElement(_element)) throw new Error(`[@my-react/react-dom] 'hydrate' can only render a '@my-react' element`);

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

  const element = _element as MyReactElement;

  if (asyncRender) {
    return hydrateAsync(element, container as RenderContainer);
  } else {
    return hydrateSync(element, container as RenderContainer);
  }
}
