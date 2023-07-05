import { unmountComponentAtNode } from "@my-react-dom-shared";

import { onceLogNewEntry } from "./createRoot";
import { hydrate } from "./hydrate";
import { render as originalRender } from "./render";

import type { Options } from "./createRoot";
import type { RenderContainer } from "./render";
import type { LikeJSX } from "@my-react/react";

export const hydrateRoot = (container: Partial<RenderContainer>, element: LikeJSX, _option?: Options) => {
  const render = (element: LikeJSX) => originalRender(element, container);

  const unmount = () => unmountComponentAtNode(container as RenderContainer);

  __DEV__ && onceLogNewEntry("hydrateRoot");

  hydrate(element, container);

  return {
    render,
    unmount,
  };
};
