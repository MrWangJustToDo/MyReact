/**
 * @internal
 */
export class CommentStartElement {
  toString() {
    return `<!-- [ -->`;
  }
}

/**
 * @internal
 */
export class CommentEndElement {
  toString() {
    return `<!-- ] -->`;
  }
}
