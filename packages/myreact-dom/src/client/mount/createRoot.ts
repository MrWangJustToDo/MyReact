import { unmountComponentAtNode } from "@my-react-dom-shared";

import { render as originalRender } from "./render";

import type { RenderContainer } from "./render";
import type { LikeJSX } from "@my-react/react";

export type Options = {
  onRecoverableError: () => void;
  identifierPrefix?: string;
};

export const createRoot = (container: Partial<RenderContainer>, _option?: Options) => {
  const render = (element: LikeJSX) => originalRender(element, container);

  const unmount = () => unmountComponentAtNode(container as RenderContainer);

  return {
    render,
    unmount,
  };
};
