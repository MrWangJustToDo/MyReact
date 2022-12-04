import { render, hydrate, renderAsync, hydrateAsync } from "./client";
import { renderToString, renderToStringAsync } from "./server";
import { createPortal, findDOMNode, safeCall, unmountComponentAtNode } from "./shared";

const version = __VERSION__;

const flushSync = safeCall;

const unstable_batchedUpdates = safeCall;

const ReactDOM = {
  render,
  hydrate,
  renderAsync,
  hydrateAsync,
  findDOMNode,
  createPortal,
  renderToString,
  renderToStringAsync,
  flushSync,
  unmountComponentAtNode,
  unstable_batchedUpdates,
  version,
};

export {
  render,
  hydrate,
  renderAsync,
  hydrateAsync,
  findDOMNode,
  createPortal,
  renderToString,
  renderToStringAsync,
  unmountComponentAtNode,
  flushSync,
  unstable_batchedUpdates,
  version,
  ReactDOM as default,
};
