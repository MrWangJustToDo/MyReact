import { __my_react_shared__ } from "@my-react/react";

import { render, hydrate } from "./client";
import { renderToString } from "./server";
import { createPortal, findDOMNode, unmountComponentAtNode } from "./shared";

const { safeCall } = __my_react_shared__;

const version = __VERSION__;

const unstable_batchedUpdates = safeCall;

const ReactDOM = {
  render,
  hydrate,
  findDOMNode,
  createPortal,
  renderToString,
  unmountComponentAtNode,
  unstable_batchedUpdates,

  version,
};

export {
  ReactDOM as default,
  render,
  hydrate,
  findDOMNode,
  createPortal,
  renderToString,
  unmountComponentAtNode,
  unstable_batchedUpdates,
};
