import { escapeHtml } from "@my-react-dom-shared";

/**
 * @internal
 */
export class TextElement {
  raw = false;
  content = "";
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
