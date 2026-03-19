import { enableHydrateWarn, isUnitlessNumber, log, logOnce } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const prefixes = ["Webkit", "Moz", "ms", "O"];

/**
 * @internal
 */
export const setStyle = (fiber: MyReactFiberNode, el: HTMLElement, name: string, value?: string | boolean | number | null) => {
  const style = el.style;
  if (name.startsWith("-")) {
    style.setProperty(name, String(value));
  } else {
    if (__DEV__ && !(name in style) && prefixes.every((pre) => !name.startsWith(pre))) {
      logOnce(fiber, "warn", "unknown style name", `unknown style name '${name}' for current element`);
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

export const hydrateStyle = (fiber: MyReactFiberNode, el: HTMLElement, name: string, value?: string | boolean | number | null) => {
  const style = el.style;

  const ignoreWarn = fiber.pendingProps["suppressHydrationWarning"] || !enableHydrateWarn.current;

  if (name.startsWith("-")) {
    const v = style.getPropertyValue(name);
    if (v !== String(value)) {
      if (!ignoreWarn) {
        log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}`);
      }
      style.setProperty(name, String(value));
    }
  } else {
    if (typeof value === "number" && !isUnitlessNumber[name]) {
      const v = style[name];
      let hasMismatch = false;
      if (v !== `${value}px`) {
        /* if (!ignoreWarn) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}px`);
        } */
        hasMismatch = true;
        style[name] = `${value}px`;
      }
      if (hasMismatch && !ignoreWarn) {
        const _v = style[name];
        if (_v === `${value}px`) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}px`);
        }
      }
    } else if (value === undefined || value === null) {
      const v = style[name];
      if (v) {
        if (!ignoreWarn) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}`);
        }
        style[name] = "";
      }
    } else {
      const v = style[name];
      let hasMismatch = false;
      if (v !== String(value)) {
        /* if (!ignoreWarn) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}`);
        } */
        hasMismatch = true;
        style[name] = String(value);
      }
      if (hasMismatch && !ignoreWarn) {
        const _v = style[name];
        if (_v === String(value)) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}`);
        }
      }
    }
  }
};
