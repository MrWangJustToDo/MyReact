import { checkMyReactVersion, checkReconcilerVersion } from "../shared";

import { renderToString, renderToNodeStream, renderToStaticMarkup, renderToStaticNodeStream, renderToPipeableStream } from "./mount";
import { initGlobalRenderPlatform } from "./renderPlatform";

const version = __VERSION__;

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
