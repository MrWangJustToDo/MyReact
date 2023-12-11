import { escapeHtml } from "@my-react-dom-shared";

import type { PlainElement } from "./plain";

/**
 * @internal
 */
export class TextElement {
  raw = false;
  content = "";
  parentElement: PlainElement | null = null;

  constructor(content: string, raw = false) {
    this.raw = raw;
    this.content = content === "" ? " " : content;
  }

  toString() {
    if (this.raw) {
      return this.content.toString();
    } else {
      return escapeHtml(this.content.toString());
    }
  }
}
