import { isNoProps } from "@my-react-dom-client/api";
import { enableHydrateWarn, getHTMLAttrKey, getSVGAttrKey, log } from "@my-react-dom-shared";

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

/**
 * @internal
 */
export const hydrateAttribute = (fiber: MyReactFiberNode, el: HTMLElement, name: string, isSVG: boolean, value?: string | boolean | null): void => {
  const ignoreWarn = fiber.pendingProps["suppressHydrationWarning"] || !enableHydrateWarn.current;

  if (value !== null && value !== undefined) {
    if (name === "className") {
      if (isSVG) {
        const has = el.hasAttribute("class");
        if (!has) {
          if (!ignoreWarn) {
            log(fiber, "warn", `hydrate warning, dom '${name}' not match from server. no have this attr from server, client: ${value}`);
          }
          el.setAttribute("class", value as string);
          return;
        }
        const v = el.getAttribute("class")?.toString();

        if (v !== String(value)) {
          if (!ignoreWarn) {
            log(fiber, "warn", `hydrate warning, dom '${name}' not match from server. server: ${v}, client: ${value}`);
          }
          el.setAttribute("class", value as string);
        }
      } else {
        if (el[name].toString() !== String(value)) {
          if (!ignoreWarn) {
            log(fiber, "warn", `hydrate warning, dom '${name}' not match from server. server: ${el[name]}, client: ${value}`);
          }
          el[name] = value as string;
        }
      }
    } else if (isSVG && name.charCodeAt(0) === X_CHAR) {
      if (name.startsWith("xmlns")) {
        const serverAttr = el.getAttributeNS(XML_NS, name);
        if (String(serverAttr) !== String(value)) {
          if (!ignoreWarn) {
            log(fiber, "warn", `hydrate warning, dom '${name}' props not match from server. server: ${serverAttr}, client: ${value}`);
          }
          el.setAttributeNS(XML_NS, name, String(value));
        }
      } else if (name.startsWith("xlink")) {
        const serverAttr = el.getAttributeNS(XLINK_NS, "href");
        if (String(serverAttr) !== String(value)) {
          if (!ignoreWarn) {
            log(fiber, "warn", `hydrate warning, dom 'href' props not match from server. server: ${serverAttr}, client: ${value}`);
          }
          el.setAttributeNS(XLINK_NS, "href", String(value));
        }
      } else {
        const serverAttr = el.getAttribute(name);
        if (String(serverAttr) !== String(value)) {
          if (!ignoreWarn) {
            log(fiber, "warn", `hydrate warning, dom '${name}' attr not match from server. server: ${serverAttr}, client: ${value}`);
          }
        }
        el.setAttribute(name, String(value));
      }
    } else {
      if (name in el && !isSVG && !isNoProps(el, name)) {
        if (el[name].toString() !== String(value)) {
          if (!ignoreWarn) {
            log(fiber, "warn", `hydrate warning, dom '${name}' props not match from server. server: ${el[name]}, client: ${value}`);
          }
          try {
            el[name] = value === false ? "" : (value as string);
          } catch (e) {
            if (__DEV__) {
              log(fiber, "error", `${(e as Error).message}, key: ${name}, value: ${value}`);
            }
          }
        }
      } else {
        const attrKey = (isSVG ? getSVGAttrKey(name) : getHTMLAttrKey(name)) || name;

        const has = el.hasAttribute(attrKey);

        const v = el.getAttribute(attrKey);
        if (value === false) {
          if (attrKey.includes("-")) {
            if (v !== "false") {
              if (!ignoreWarn) {
                log(fiber, "warn", `hydrate warning, dom '${attrKey}' attr not match from server. server: ${v}, client: ${value}`);
              }
              el.setAttribute(attrKey, String(value));
            }
          } else if (v !== null && v !== undefined) {
            if (v === "false") return;
            if (!ignoreWarn) {
              log(fiber, "warn", `hydrate warning, dom '${attrKey}' attr not match from server. server: ${v}, client: ${value}`);
            }
            el.removeAttribute(attrKey);
          }
        } else if (v?.toString() !== String(value)) {
          if (!ignoreWarn) {
            if (has) {
              log(fiber, "warn", `hydrate warning, dom '${attrKey}' attr not match from server. server: ${v}, client: ${value}`);
            } else {
              log(fiber, "warn", `hydrate warning, dom '${attrKey}' attr not match from server. no have this attr from server, client: ${value}`);
            }
          }
          el.setAttribute(attrKey, String(value));
        }
      }
    }
  }
};
