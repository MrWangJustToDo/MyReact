import { createElement, Portal } from "@my-react/react";

import type { MyReactElement } from "@my-react/react";

export const createPortal = (element: MyReactElement, container: HTMLElement) => {
  return createElement({ ["$$typeof"]: Portal }, { container }, element);
};
