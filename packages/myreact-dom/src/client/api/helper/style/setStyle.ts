import { isUnitlessNumber, log } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const setStyle = (fiber: MyReactFiberNode, el: HTMLElement, name: string, value?: string | boolean | number | null) => {
  const style = el.style;
  if (name.startsWith("-")) {
    style.setProperty(name, String(value));
  } else {
    if (__DEV__ && !(name in style)) {
      log(fiber, "warn", `unknown style name '${name}' for current element`);
    }
    if (typeof value === "number" && !isUnitlessNumber[name]) {
      style[name] = `${value}px`;
    } else if (value === undefined || value === null) {
      style[name] = "";
    } else {
      style[name] = String(value);
    }
  }
};
