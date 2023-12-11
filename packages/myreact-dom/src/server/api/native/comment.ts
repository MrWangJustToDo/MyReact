import type { PlainElement } from "./plain";

/**
 * @internal
 */
export class CommentStartElement {
  parentElement: PlainElement | null = null;

  toString() {
    return `<!-- [ -->`;
  }
}

/**
 * @internal
 */
export class CommentEndElement {
  parentElement: PlainElement | null = null;

  toString() {
    return `<!-- ] -->`;
  }
}
