import { __myreact_shared__ } from "@my-react/react";
import { render, hydrate } from "./client";
import { renderToString } from "./server";
import { createPortal, findDOMNode, unmountComponentAtNode } from "./shared";
var safeCall = __myreact_shared__.safeCall;
var version = __VERSION__;
var unstable_batchedUpdates = safeCall;
var ReactDOM = {
    render: render,
    hydrate: hydrate,
    findDOMNode: findDOMNode,
    createPortal: createPortal,
    renderToString: renderToString,
    unmountComponentAtNode: unmountComponentAtNode,
    unstable_batchedUpdates: unstable_batchedUpdates,
    version: version,
};
export { ReactDOM as default, render, hydrate, findDOMNode, createPortal, renderToString, unmountComponentAtNode, unstable_batchedUpdates, };
//# sourceMappingURL=index.js.map