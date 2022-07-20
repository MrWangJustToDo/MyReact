export class TextElement {
  content = '';
  constructor(content: string) {
    this.content = content === '' ? ' ' : content;
  }

  toString() {
    return this.content.toString();
  }
}
