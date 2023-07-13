import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import {
  safeCall,
  safeCallWithSync,
  hmr,
  typeToFibersMap,
  setRefreshHandler,
  getCurrentFibersFromType,
  getCurrentDispatchFromType,
} from "@my-react/react-reconciler";

import { render, hydrate, hydrateRoot, createRoot } from "./client";
import { renderToString, renderToNodeStream, renderToStaticMarkup, renderToStaticNodeStream } from "./server";
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
    typeToFibersMap,
    setRefreshHandler,
    currentComponentFiber,
    getCurrentFibersFromType,
    getCurrentDispatchFromType,
  };
}

const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {};

export {
  render,
  hydrate,
  createRoot,
  hydrateRoot,
  findDOMNode,
  createPortal,
  renderToString,
  renderToNodeStream,
  renderToStaticMarkup,
  renderToStaticNodeStream,
  unmountComponentAtNode,
  flushSync,
  unstable_batchedUpdates,
  version,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
};
