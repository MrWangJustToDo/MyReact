import { __my_react_internal__ } from "@my-react/react";
import { safeCall, safeCallWithSync } from "@my-react/react-reconciler";

import { render, hydrate } from "./client";
import { renderToString, renderToNodeStream } from "./server";
import { createPortal, findDOMNode, MyReactDomPlatform, unmountComponentAtNode } from "./shared";

const version = __VERSION__;

const flushSync = safeCallWithSync;

const unstable_batchedUpdates = safeCall;

const { setRenderPlatform } = __my_react_internal__;

setRenderPlatform(MyReactDomPlatform);

export { render, hydrate, findDOMNode, createPortal, renderToString, renderToNodeStream, unmountComponentAtNode, flushSync, unstable_batchedUpdates, version };
