import { __my_react_shared__ } from "@my-react/react";
import { safeCall, safeCallWithSync } from "@my-react/react-reconciler";

import { checkMyReactVersion, checkReconcilerVersion } from "../shared";

import { render, hydrate, hydrateRoot, createRoot } from "./mount";
import { initGlobalRenderPlatform } from "./renderPlatform";
import { findDOMNode, createPortal, unmountComponentAtNode, initGlobalHMR } from "./tools";

const { enableMockReact } = __my_react_shared__;

const version = enableMockReact.current ? "18.2.0" : __VERSION__;

const flushSync = safeCallWithSync;

const unstable_batchedUpdates = safeCall;

initGlobalRenderPlatform();

initGlobalHMR();

checkReconcilerVersion();

checkMyReactVersion();

const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {};

export {
  render,
  hydrate,
  createRoot,
  hydrateRoot,
  findDOMNode,
  createPortal,
  unmountComponentAtNode,
  flushSync,
  unstable_batchedUpdates,
  version,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
};
