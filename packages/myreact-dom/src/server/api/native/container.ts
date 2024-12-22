import { CommentEndElement, CommentStartElement } from "./comment";
import { PlainElement } from "./plain";
import { TextElement } from "./text";

import type { CustomRenderDispatch, MyReactFiberNode } from "@my-react/react-reconciler";

// server container node
/**
 * @internal
 */
export class ContainerElement {
  __fiber__: MyReactFiberNode;

  __container__: CustomRenderDispatch;

  children: Array<TextElement | PlainElement | CommentStartElement | CommentEndElement | string> = [];

  append(...dom: Array<TextElement | PlainElement | CommentStartElement | CommentEndElement>) {
    dom.forEach((d) => this.appendChild(d));
  }

  appendChild(dom: PlainElement | TextElement | CommentStartElement | CommentEndElement | string) {
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

  toString(): string {
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
}
