import { __my_react_shared__ } from "@my-react/react";
import { enableDebugUpdateQueue, enableFiberForLog, enableLogForCurrentFlowIsRunning, enableValidMyReactElement, safeCall, safeCallWithSync } from "@my-react/react-reconciler";

import { latestNoopRender, legacyNoopRender } from "@my-react-dom-noop/mount";

import {
  checkMyReactVersion,
  checkReconcilerVersion,
  enableControlComponent,
  enableDOMField,
  enableEventSystem,
  enableEventTrack,
  injectDevField,
} from "../shared";

import { render, hydrate, hydrateRoot, createRoot } from "./mount";
import { initGlobalRenderPlatform } from "./renderPlatform";
import { findDOMNode, createPortal, unmountComponentAtNode /* initGlobalHMR */ } from "./tools";

import type { ClientDomDispatch, ClientDomDispatchDev } from "./renderDispatch";

const { enableMockReact } = __my_react_shared__;

const version = enableMockReact.current ? "18.2.0" : __VERSION__;

const flushSync = safeCallWithSync;

const unstable_batchedUpdates = safeCall;

const noop = () => {};

initGlobalRenderPlatform();

// not need for new refresh runtime package
// initGlobalHMR();

injectDevField();

checkReconcilerVersion();

checkMyReactVersion();

const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {};

const __my_react_dom_shared__ = {
  enableFiberForLog,
  enableDebugUpdateQueue,
  enableValidMyReactElement,
  enableLogForCurrentFlowIsRunning,
  enableControlComponent,
  enableDOMField,
  enableEventSystem,
  enableEventTrack,
};

const __my_react_dom_internal__ = {
  legacyNoopRender: __DEV__ ? legacyNoopRender : noop,
  latestNoopRender: __DEV__ ? latestNoopRender : noop,
};

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
  __my_react_dom_shared__,
  __my_react_dom_internal__,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  version,
};

export type { ClientDomDispatch, ClientDomDispatchDev };
