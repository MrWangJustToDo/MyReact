import { My_React_Portal } from '../../share';
import { createElement } from '../../vdom';

import type { Children } from '../../vdom';

export const createPortal = (element: Children, container: HTMLElement) => {
  return createElement(
    { ['$$typeof']: My_React_Portal },
    { container },
    element
  );
};
