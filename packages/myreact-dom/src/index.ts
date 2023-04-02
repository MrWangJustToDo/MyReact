import { __my_react_internal__ } from "@my-react/react";
import { safeCall, safeCallWithSync, replaceFiberNode } from "@my-react/react-reconciler";

import { render, hydrate } from "./client";
import { renderToString, renderToNodeStream } from "./server";
import { createPortal, findDOMNode, MyReactDomPlatform, unmountComponentAtNode } from "./shared";

const version = __VERSION__;

const flushSync = safeCallWithSync;

const unstable_batchedUpdates = safeCall;

const { setRenderPlatform, currentComponentFiber } = __my_react_internal__;

setRenderPlatform(MyReactDomPlatform);

if (__DEV__) {
  globalThis["__@my-react/runtime__"] = {
    replaceFiberNode,
    currentComponentFiber,
  };
}

export { render, hydrate, findDOMNode, createPortal, renderToString, renderToNodeStream, unmountComponentAtNode, flushSync, unstable_batchedUpdates, version };
