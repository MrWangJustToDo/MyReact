import { __my_react_internal__ } from "@my-react/react";
import { initialFiberNode } from "@my-react/react-reconciler";
import { once } from "@my-react/react-shared";

import { CustomRenderController, CustomRenderDispatch, CustomRenderScope } from "@my-react-dom-client/render";
import { startRender, startRenderAsync } from "@my-react-dom-shared";

import { DomPlatform } from "../../shared/platform";

import type { RenderContainer } from "./render";
import type { MyReactElement, MyReactFiberNodeRoot } from "@my-react/react";

const { MyReactFiberNode } = __my_react_internal__;

const onceLog = once(() => {
  console.log("you are using @my-react to render this site, see https://github.com/MrWangJustToDo/MyReact");
});

const hydrateSync = (element: MyReactElement, container: RenderContainer) => {
  onceLog();

  const fiber = new MyReactFiberNode(null, element);

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderDispatch = new CustomRenderDispatch();

  const renderScope = new CustomRenderScope(rootFiber, container);

  const renderController = new CustomRenderController(renderScope);

  const renderPlatform = new DomPlatform("myreact-dom");

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  renderScope.isHydrateRender = true;

  container.setAttribute?.("hydrate", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__scope__ = renderScope;

  container.__dispatch__ = renderDispatch;

  initialFiberNode(fiber);

  startRender(fiber, true);

  renderScope.isHydrateRender = false;
};

const hydrateAsync = async (element: MyReactElement, container: RenderContainer) => {
  onceLog();

  const fiber = new MyReactFiberNode(null, element);

  const rootFiber = fiber as MyReactFiberNodeRoot;

  const renderDispatch = new CustomRenderDispatch();

  const renderScope = new CustomRenderScope(rootFiber, container);

  const renderController = new CustomRenderController(renderScope);

  const renderPlatform = new DomPlatform("myreact-dom");

  rootFiber.node = container;

  rootFiber.renderScope = renderScope;

  rootFiber.renderPlatform = renderPlatform;

  rootFiber.renderDispatch = renderDispatch;

  rootFiber.renderController = renderController;

  renderScope.isHydrateRender = true;

  container.setAttribute?.("hydrate", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__scope__ = renderScope;

  container.__dispatch__ = renderDispatch;

  initialFiberNode(fiber);

  await startRenderAsync(fiber, true);

  renderScope.isHydrateRender = false;
};

export function hydrate(element: MyReactElement, container: Partial<RenderContainer>): void;
export function hydrate(element: MyReactElement, container: Partial<RenderContainer>, asyncRender: true): Promise<void>;
export function hydrate(element: MyReactElement, container: Partial<RenderContainer>, asyncRender?: boolean) {
  if (asyncRender) {
    return hydrateAsync(element, container as RenderContainer);
  } else {
    return hydrateSync(element, container as RenderContainer);
  }
}
