import { updateDom } from "./dom.js";
import { empty } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { singleElement } from "./share.js";

class Element {
  style = {};
  attrs = {};
  children = [];
  constructor(type) {
    this.type = type;
  }

  addEventListener() {}

  removeEventListener() {}

  removeAttribute(key) {
    delete this.attrs[key];
  }
  setAttribute(key, value) {
    this.attrs[key] = value;
  }

  /**
   *
   * @param {Element} dom
   */
  append(...dom) {
    this.children.push(...dom);
  }

  appendChild(dom) {
    if (dom instanceof Element || dom instanceof TextElement) {
      this.children.push(dom);
      return dom;
    } else {
      throw new Error("element instance error");
    }
  }

  serializeStyle() {
    const styleKeys = Object.keys(this.style);
    if (styleKeys.length) {
      return `style="${styleKeys
        .map((key) => `${key}: ${this.style[key].toString()};`)
        .reduce((p, c) => p + c, "")}"`;
    }
    return "";
  }

  serializeAttrs() {
    const attrsKeys = Object.keys(this.attrs);
    if (attrsKeys.length) {
      return attrsKeys
        .map((key) => {
          if (this.attrs[key] === null || this.attrs[key] === undefined) {
            return "";
          } else {
            return `${key}='${this.attrs[key].toString()}'`;
          }
        })
        .reduce((p, c) => `${p} ${c}`, "");
    } else {
      return "";
    }
  }

  serializeProps() {
    if (this.className) {
      return `class="${this.className}"`;
    } else {
      return "";
    }
  }

  toString() {
    if (singleElement[this.type]) {
      if (this.children.length)
        throw new Error(`can not add child to ${this.type} element`);
      return `<${
        this.type
      } ${this.serializeProps()} ${this.serializeStyle()} ${this.serializeAttrs()} />`;
    } else {
      if (this.type) {
        return `<${
          this.type
        } ${this.serializeProps()} ${this.serializeStyle()} ${this.serializeAttrs()} >${this.children
          .reduce((p, c) => {
            if (
              p.length &&
              c instanceof TextElement &&
              p[p.length - 1] instanceof TextElement
            ) {
              p.push("<!-- -->");
              p.push(c);
            } else {
              p.push(c);
            }
            return p;
          }, [])
          .map((dom) => dom.toString())
          .reduce((p, c) => p + c, "")}</${this.type}>`;
      } else {
        return this.children
          .map((dom) => dom.toString())
          .reduce((p, c) => p + c, "");
      }
    }
  }
}

class TextElement {
  constructor(content) {
    this.content = content;
  }

  toString() {
    return this.content.toString();
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function createServerDom(fiber) {
  const dom = fiber.__isTextNode__
    ? new TextElement(fiber.__vdom__)
    : new Element(fiber.__vdom__.type);

  fiber.dom = dom;

  updateDom(
    dom,
    empty,
    fiber.__isTextNode__ ? empty : fiber.__vdom__.props,
    fiber
  );

  return dom;
}

export { createServerDom, Element };
