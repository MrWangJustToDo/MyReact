import { createElement } from '../../element';
import { My_React_Portal } from '../../share';

import type { Children } from '../../element';

export const createPortal = (element: Children, container: HTMLElement) => {
  return createElement(
    { ['$$typeof']: My_React_Portal },
    { container },
    element
  );
};
