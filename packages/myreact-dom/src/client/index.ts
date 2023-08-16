import { safeCall, safeCallWithSync } from "@my-react/react-reconciler";

import { render, hydrate, hydrateRoot, createRoot } from "./mount";
import { initGlobalRenderPlatform } from "./renderPlatform";
import { findDOMNode, createPortal, unmountComponentAtNode, initGlobalHMR } from "./tools";

const version = __VERSION__;

const flushSync = safeCallWithSync;

const unstable_batchedUpdates = safeCall;

initGlobalRenderPlatform();

initGlobalHMR();

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
