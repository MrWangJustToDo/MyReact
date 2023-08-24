import { escapeHtml } from "@my-react-dom-shared";

/**
 * @internal
 */
export class TextElement {
  content = "";
  constructor(content: string) {
    this.content = content === "" ? " " : content;
  }

  toString() {
    return escapeHtml(this.content.toString());
  }
}
