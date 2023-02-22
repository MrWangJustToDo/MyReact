import { render, hydrate } from "./client";
import { renderToString } from "./server";
import { createPortal, findDOMNode, safeCall, unmountComponentAtNode } from "./shared";

const version = __VERSION__;

const flushSync = safeCall;

const unstable_batchedUpdates = safeCall;

// const ReactDOM = {
//   render,
//   hydrate,
//   findDOMNode,
//   createPortal,
//   renderToString,
//   flushSync,
//   unmountComponentAtNode,
//   unstable_batchedUpdates,
//   version,
// };

export {
  render,
  hydrate,
  findDOMNode,
  createPortal,
  renderToString,
  unmountComponentAtNode,
  flushSync,
  unstable_batchedUpdates,
  version,
};
