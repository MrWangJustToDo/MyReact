import { escapeHtml, isBoolAttrKey, isSingleTag, kebabCase } from "@my-react-dom-shared";

import { CommentEndElement, CommentStartElement } from "./comment";
import { TextElement } from "./text";

import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export class PlainElement {
  type: string;
  style: Record<string, string | null | undefined> = {};
  attrs: Record<string, string | boolean | null | undefined> = {};
  children: Array<TextElement | PlainElement | CommentStartElement | CommentEndElement | string> = [];
  parentElement: PlainElement | null = null;

  constructor(type: string) {
    this.type = type;

    if (type === "html") {
      this.attrs = { ...this.attrs, "data-server": "@my-react" };
    }
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
    this.attrs[key] = value.toString();
  }

  /**
   *
   * @param {Element} dom
   */
  append(...dom: Array<TextElement | PlainElement | CommentStartElement | CommentEndElement>) {
    dom.forEach((d) => this.appendChild(d));
  }

  appendChild(dom: PlainElement | TextElement | CommentStartElement | CommentEndElement | string) {
    if (isSingleTag[this.type]) return;
    if (
      dom instanceof PlainElement ||
      dom instanceof TextElement ||
      dom instanceof CommentStartElement ||
      dom instanceof CommentEndElement ||
      typeof dom === "string"
    ) {
      this.children.push(dom);

      if (dom instanceof PlainElement || dom instanceof TextElement || dom instanceof CommentStartElement || dom instanceof CommentEndElement) {
        if (dom.parentElement) throw new Error("unexpected error: dom.parentElement is not null");

        dom.parentElement = this;
      }

      return dom;
    } else {
      throw new Error("element instance error");
    }
  }

  serializeStyle() {
    const styleKeys = Object.keys(this.style);
    if (styleKeys.length) return `style="${escapeHtml(styleKeys.map((key) => `${kebabCase(key)}:${this.style[key]?.toString()};`).reduce((p, c) => p + c))}"`;
    return "";
  }

  serializeAttrs() {
    const attrsKeys = Object.keys(this.attrs);
    if (attrsKeys.length) {
      // TODO
      return attrsKeys
        .map((key) => {
          const value = this.attrs[key];
          if (isBoolAttrKey(key)) {
            return !!value || value === "" ? key : "";
          } else {
            return `${key}="${escapeHtml(this.attrs[key]?.toString())}"`;
          }
        })
        .reduce((p, c) => `${p} ${c}`);
    } else {
      return "";
    }
  }

  serialize() {
    const arr = [this.serializeStyle(), this.serializeAttrs()].filter((i) => i.length);
    if (arr.length) return " " + arr.reduce((p, c) => `${p} ${c}`);
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
    if (isSingleTag[this.type]) {
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

/**
 * @internal
 */
export interface PlainElementDev extends PlainElement {
  _debugFiber: MyReactFiberNode;
  _debugElement: MyReactElementNode;
}
