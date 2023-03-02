import { IS_SINGLE_ELEMENT, kebabCase } from "@my-react-dom-shared";

import { CommentEndElement, CommentStartElement } from "./comment";
import { TextElement } from "./text";

export class PlainElement {
  type: string;
  className: string | null = null;
  // attrs
  style: Record<string, string | null | undefined> = {};
  attrs: Record<string, string | boolean | null | undefined> = {};
  children: Array<TextElement | PlainElement | CommentStartElement | CommentEndElement | string> = [];
  constructor(type: string) {
    this.type = type;
  }

  addEventListener() {
    void 0;
  }

  removeEventListener() {
    void 0;
  }

  removeAttribute(key: string) {
    delete this.attrs[key];
  }
  setAttribute(key: string, value: string | boolean | null | undefined | number) {
    if (value !== null && value !== undefined) {
      this.attrs[key] = value.toString();
    }
  }

  /**
   *
   * @param {Element} dom
   */
  append(...dom: Array<TextElement | PlainElement | CommentStartElement | CommentEndElement>) {
    dom.forEach((d) => this.appendChild(d));
  }

  appendChild(dom: PlainElement | TextElement | CommentStartElement | CommentEndElement | string) {
    if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type)) return;
    if (
      dom instanceof PlainElement ||
      dom instanceof TextElement ||
      dom instanceof CommentStartElement ||
      dom instanceof CommentEndElement ||
      typeof dom === "string"
    ) {
      this.children.push(dom);
      return dom;
    } else {
      throw new Error("element instance error");
    }
  }

  serializeStyle() {
    const styleKeys = Object.keys(this.style).filter((key) => this.style[key] !== null && this.style[key] !== undefined);
    if (styleKeys.length) return `style="${styleKeys.map((key) => `${kebabCase(key)}: ${this.style[key]?.toString()};`).reduce((p, c) => p + c)}"`;
    return "";
  }

  serializeAttrs() {
    const attrsKeys = Object.keys(this.attrs);
    if (attrsKeys.length) {
      // TODO
      return attrsKeys.map((key) => `${key}="${this.attrs[key]?.toString()}"`).reduce((p, c) => `${p} ${c}`);
    } else {
      return "";
    }
  }

  serializeProps() {
    if (this.className !== undefined && this.className !== null) return `class="${this.className}"`;
    return "";
  }

  serialize() {
    const arr = [this.serializeProps(), this.serializeStyle(), this.serializeAttrs()].filter((i) => i.length);
    if (arr.length) return " " + arr.reduce((p, c) => `${p} ${c}`) + " ";
    return "";
  }

  renderChildren() {
    return this.children
      .reduce<Array<PlainElement | TextElement | CommentStartElement | CommentEndElement | string>>((p, c) => {
        if (p.length && c instanceof TextElement && p[p.length - 1] instanceof TextElement) {
          p.push("<!-- -->");
          p.push(c);
        } else if (p.length && typeof c === "string" && typeof p[p.length - 1] === "string") {
          p.push("<!-- -->");
          p.push(c);
        } else {
          p.push(c);
        }
        return p;
      }, [])
      .map((dom) => dom.toString())
      .reduce((p, c) => p + c, "");
  }

  toString(): string {
    if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type)) {
      return `<${this.type}${this.serialize()}/>`;
    } else {
      if (this.type) {
        return `<${this.type}${this.serialize()}>${this.renderChildren()}</${this.type}>`;
      } else {
        return this.renderChildren();
      }
    }
  }
}
