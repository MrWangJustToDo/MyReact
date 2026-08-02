import { once } from "@my-react/react-shared";

import { unmountComponentAtNode } from "@my-react-dom-client/tools";
import { enableNewEntry, wrapperFunc } from "@my-react-dom-shared";

import { render as originalRender } from "./render";

import type { RenderContainer } from "./render";
import type { LikeJSX } from "@my-react/react/type";

export type Options = {
  onRecoverableError: () => void;
  identifierPrefix?: string;
};

/**
 * @internal
 */
function onceLogNewEntryImpl(entry: string) {
  console.log(`[@my-react/react-dom] you are using new entry function '${entry}'`);
}

export const onceLogNewEntry = once(onceLogNewEntryImpl);

function createRootImpl(container: Partial<RenderContainer>, _option?: Options) {
  if (__DEV__ && !container) {
    throw new Error("[@my-react/react-dom] the `createRoot` function must be called with a container element.");
  }

  const render = function createRootRender(element: LikeJSX) {
    enableNewEntry.current = true;
    originalRender(element, container);
    enableNewEntry.current = false;
  };

  const unmount = function createRootUnmount() {
    unmountComponentAtNode(container as RenderContainer);
  };

  __DEV__ && onceLogNewEntry("createRoot");

  return {
    render,
    unmount,
  };
}

export const createRoot = wrapperFunc(createRootImpl);
