import { renderToString, renderToNodeStream, renderToStaticMarkup, renderToStaticNodeStream } from "./mount";
import { initGlobalRenderPlatform } from "./renderPlatform";

const version = __VERSION__;

const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {};

initGlobalRenderPlatform();

export { renderToString, renderToNodeStream, renderToStaticMarkup, renderToStaticNodeStream, version, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED };
