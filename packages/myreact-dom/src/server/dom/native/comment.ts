import { PlainElement } from "./plain";
import { TextElement } from "./text";

export class CommentElement {
  content = "";

  children: Array<PlainElement | TextElement | CommentElement | string> = [];

  constructor(content: string) {
    this.content = content === "" ? " " : content;
  }

  /**
   *
   * @param {Element} dom
   */
  append(...dom: Array<TextElement | PlainElement | CommentElement>) {
    dom.forEach((d) => this.appendChild(d));
  }

  appendChild(dom: PlainElement | TextElement | CommentElement | string) {
    if (dom instanceof PlainElement || dom instanceof TextElement || dom instanceof CommentElement || typeof dom === "string") {
      this.children.push(dom);
      return dom;
    } else {
      throw new Error("element instance error");
    }
  }

  renderChildren() {
    return this.children
      .reduce<Array<PlainElement | TextElement | CommentElement | string>>((p, c) => {
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

  toString() {
    return `<!-- [ -->${this.renderChildren()}<!-- ] -->`;
  }
}
