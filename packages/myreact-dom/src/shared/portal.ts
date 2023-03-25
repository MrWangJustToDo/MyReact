import { createElement } from "@my-react/react";
import { Portal, TYPEKEY } from "@my-react/react-shared";

import type { MyReactElement } from "@my-react/react";

export const createPortal = (element: MyReactElement, container: HTMLElement) => {
  return createElement({ [TYPEKEY]: Portal }, { container }, element);
};
