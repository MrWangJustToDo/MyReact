import { __my_react_shared__ } from "@my-react/react";

import { checkMyReactVersion, checkReconcilerVersion } from "../shared";

import { renderToString, renderToNodeStream, renderToStaticMarkup, renderToStaticNodeStream, renderToPipeableStream } from "./mount";
import { initGlobalRenderPlatform } from "./renderPlatform";

const { enableMockReact } = __my_react_shared__;

const version = enableMockReact.current ? "18.2.0" : __VERSION__;

const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {};

initGlobalRenderPlatform();

checkReconcilerVersion();

checkMyReactVersion();

export {
  renderToString,
  renderToNodeStream,
  renderToStaticMarkup,
  renderToPipeableStream,
  renderToStaticNodeStream,
  version,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
};
