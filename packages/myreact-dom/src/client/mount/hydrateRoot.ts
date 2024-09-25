import { unmountComponentAtNode } from "@my-react-dom-client/tools";
import { enableASyncHydrate } from "@my-react-dom-shared";

import { onceLogNewEntry } from "./createRoot";
import { internalHydrate } from "./hydrate";
import { render as originalRender } from "./render";

import type { Options } from "./createRoot";
import type { RenderContainer } from "./render";
import type { LikeJSX } from "@my-react/react";

export const hydrateRoot = (container: Partial<RenderContainer>, element: LikeJSX, _option?: Options) => {
  const render = function hydrateRootRender(element: LikeJSX) {
    originalRender(element, container);
  };

  const unmount = function hydrateRootUnmount() {
    unmountComponentAtNode(container as RenderContainer);
  };

  __DEV__ && onceLogNewEntry("hydrateRoot");

  // TODO
  enableASyncHydrate.current = true;

  internalHydrate(element, container);

  return {
    render,
    unmount,
  };
};
