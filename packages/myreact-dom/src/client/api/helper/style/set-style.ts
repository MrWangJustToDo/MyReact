/* eslint-disable @typescript-eslint/ban-ts-comment */
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
      // @ts-ignore
      style[name] = `${value}px`;
    } else if (value === undefined || value === null) {
      // @ts-ignore
      style[name] = "";
    } else {
      // @ts-ignore
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
      // @ts-ignore
      const v = style[name];
      let hasMismatch = false;
      if (v !== `${value}px`) {
        /* if (!ignoreWarn) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}px`);
        } */
        hasMismatch = true;
        // @ts-ignore
        style[name] = `${value}px`;
      }
      if (hasMismatch && !ignoreWarn) {
        // @ts-ignore
        const _v = style[name];
        if (_v === `${value}px`) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}px`);
        }
      }
    } else if (value === undefined || value === null) {
      // @ts-ignore
      const v = style[name];
      if (v) {
        if (!ignoreWarn) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}`);
        }
        // @ts-ignore
        style[name] = "";
      }
    } else {
      // @ts-ignore
      const v = style[name];
      let hasMismatch = false;
      if (v !== String(value)) {
        /* if (!ignoreWarn) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}`);
        } */
        hasMismatch = true;
        // @ts-ignore
        style[name] = String(value);
      }
      if (hasMismatch && !ignoreWarn) {
        // @ts-ignore
        const _v = style[name];
        if (_v === String(value)) {
          log(fiber, "warn", `hydrate warning, style '${name}' not match from server. server: ${v}, client: ${value}`);
        }
      }
    }
  }
};
