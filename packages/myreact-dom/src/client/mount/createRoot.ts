import { once } from "@my-react/react-shared";

import { unmountComponentAtNode } from "@my-react-dom-client/tools";

import { render as originalRender } from "./render";

import type { RenderContainer } from "./render";
import type { LikeJSX } from "@my-react/react";
// import type { RenderDispatch } from "@my-react/react-reconciler";

export type Options = {
  onRecoverableError: () => void;
  identifierPrefix?: string;
};

/**
 * @internal
 */
export const onceLogNewEntry = once((entry) => {
  console.log(`[@my-react/react-dom] you are using new entry function '${entry}'`);
});

// TODO
// const map = new Map<RenderContainer, RenderDispatch>();

export const createRoot = (container: Partial<RenderContainer>, _option?: Options) => {
  if (__DEV__ && !container) {
    throw new Error('[@my-react/react-dom] the `createRoot` function must be called with a container element.')
  }

  const render = (element: LikeJSX) => originalRender(element, container);

  const unmount = () => unmountComponentAtNode(container as RenderContainer);

  __DEV__ && onceLogNewEntry("createRoot");

  return {
    render,
    unmount,
  };
};
