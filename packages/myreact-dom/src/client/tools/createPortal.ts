import { createElement } from "@my-react/react";
import { Portal } from "@my-react/react-shared";

import type { MyReactElement } from "@my-react/react";

const checkPortal = (element: MyReactElement) => {
  if (!element.props["container"]) throw new Error(`a portal element need a "container" props`);
};

export const createPortal = (element: MyReactElement, container: HTMLElement) => {
  const portal = createElement(Portal, { container }, element);

  if (__DEV__) checkPortal(portal);

  return portal;
};
