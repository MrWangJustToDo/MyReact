import { isNoProps } from "@my-react-dom-client/api/update/tool";
import { getHTMLAttrKey, getSVGAttrKey, log } from "@my-react-dom-shared";

import { XLINK_NS, XML_NS, X_CHAR } from "./namespace";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const setAttribute = (fiber: MyReactFiberNode, el: HTMLElement, name: string, isSVG: boolean, value?: string | boolean | null): void => {
  if (isSVG && name.charCodeAt(0) === X_CHAR) {
    if (name.startsWith("xmlns")) {
      if (value === null || value === undefined) {
        el.removeAttributeNS(XML_NS, name);
      } else {
        el.setAttributeNS(XML_NS, name, String(value));
      }
    } else if (name.startsWith("xlink")) {
      if (value === null || value === undefined) {
        el.removeAttributeNS(XLINK_NS, "href");
      } else {
        el.setAttributeNS(XLINK_NS, "href", String(value));
      }
    } else {
      if (value === null || value === undefined) {
        el.removeAttribute(name);
      } else {
        el.setAttribute(name, String(value));
      }
    }
    return;
  }

  if (name === "className") {
    if (isSVG) {
      if (value === null || value === undefined) {
        el.removeAttribute("class");
      } else {
        el.setAttribute("class", String(value));
      }
    } else {
      if (value === null || value === undefined) {
        el[name] = "";
      } else {
        el[name] = String(value);
      }
    }
    return;
  }

  if (name in el && !isSVG && !isNoProps(el, name)) {
    try {
      if (value === null || value === undefined || value === false) {
        el[name] = "";
      } else {
        el[name] = String(value);
      }
    } catch (e) {
      if (__DEV__) {
        log(fiber, "error", "setProps", `${(e as Error).message}, key: ${name}, value: ${value}`);
      }
    }
  } else {
    try {
      const attrKey = (isSVG ? getSVGAttrKey(name) : getHTMLAttrKey(name)) || name;
      if (value === null || value === undefined) {
        el.removeAttribute(attrKey);
      } else {
        if (value === false) {
          if (attrKey.includes("-")) {
            el.setAttribute(attrKey, String(value));
          } else {
            el.removeAttribute(attrKey);
          }
        } else {
          el.setAttribute(attrKey, String(value));
          if (el.nodeName === "INPUT" && attrKey === "autofocus") {
            requestAnimationFrame(() => el.focus());
          }
          if (el.nodeName === "TEXTAREA" && attrKey === "autofocus") {
            requestAnimationFrame(() => el.focus());
          }
        }
      }
    } catch (e) {
      if (__DEV__) {
        log(fiber, "error", "setAttribute", `${(e as Error).message}, key: ${name}, value: ${value}`);
      }
    }
  }
};
