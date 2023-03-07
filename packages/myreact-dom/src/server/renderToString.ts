// import { __my_react_internal__ } from "@my-react/react";
// import { initialFiberNode } from "@my-react/react-reconciler";

// import { DomPlatform, startRender, startRenderAsync } from "../shared";

// import { PlainElement } from "./api";
// import { CustomRenderController, CustomRenderScope, ServerRenderDispatch } from "./render";

// import type { MyReactElement, MyReactFiberNodeRoot } from "@my-react/react";

// const { MyReactFiberNode } = __my_react_internal__;

// const renderToStringSync = (element: MyReactElement) => {
//   const fiber = new MyReactFiberNode(null, element);

//   const container = new PlainElement("");

//   const rootFiber = fiber as MyReactFiberNodeRoot;

//   const renderDispatch = new ServerRenderDispatch();

//   const renderScope = new CustomRenderScope(rootFiber, container);

//   const renderController = new CustomRenderController(renderScope);

//   const renderPlatform = new DomPlatform("myreact-dom/server");

//   rootFiber.node = container;

//   rootFiber.renderScope = renderScope;

//   rootFiber.renderPlatform = renderPlatform;

//   rootFiber.renderDispatch = renderDispatch;

//   rootFiber.renderController = renderController;

//   renderScope.isServerRender = true;

//   initialFiberNode(fiber);

//   startRender(fiber);

//   renderScope.isServerRender = false;

//   return container.toString();
// };

// const renderToStringAsync = async (element: MyReactElement) => {
//   const fiber = new MyReactFiberNode(null, element);

//   const container = new PlainElement("");

//   const rootFiber = fiber as MyReactFiberNodeRoot;

//   const renderDispatch = new ServerRenderDispatch();

//   const renderScope = new CustomRenderScope(rootFiber, container);

//   const renderController = new CustomRenderController(renderScope);

//   const renderPlatform = new DomPlatform("myreact-dom/server");

//   rootFiber.node = container;

//   rootFiber.renderScope = renderScope;

//   rootFiber.renderPlatform = renderPlatform;

//   rootFiber.renderDispatch = renderDispatch;

//   rootFiber.renderController = renderController;

//   renderScope.isServerRender = true;

//   initialFiberNode(fiber);

//   await startRenderAsync(fiber);

//   renderScope.isServerRender = false;

//   return container.toString();
// };

// export function renderToString(element: MyReactElement): string;
// export function renderToString(element: MyReactElement, asyncRender: true): Promise<string>;
// export function renderToString(element: MyReactElement, asyncRender?: boolean) {
//   if (asyncRender) {
//     return renderToStringAsync(element);
//   } else {
//     return renderToStringSync(element);
//   }
// }
