import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { safeCall, safeCallWithSync, hmr, setRefreshHandler } from "@my-react/react-reconciler";

import { render, hydrate, hydrateRoot, createRoot } from "./client";
import { renderToString, renderToNodeStream } from "./server";
import { createPortal, findDOMNode, MyReactDomPlatform, unmountComponentAtNode } from "./shared";

const version = __VERSION__;

const flushSync = safeCallWithSync;

const unstable_batchedUpdates = safeCall;

const { enableHMRForDev } = __my_react_shared__;

const { setRenderPlatform, currentComponentFiber } = __my_react_internal__;

setRenderPlatform(MyReactDomPlatform);

if (__DEV__ && enableHMRForDev.current) {
  globalThis["__@my-react/hmr__"] = {
    hmr,
    setRefreshHandler,
    currentComponentFiber,
  };
}

export {
  render,
  hydrate,
  createRoot,
  hydrateRoot,
  findDOMNode,
  createPortal,
  renderToString,
  renderToNodeStream,
  unmountComponentAtNode,
  flushSync,
  unstable_batchedUpdates,
  version,
};
