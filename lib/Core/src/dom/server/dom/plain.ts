import { IS_SINGLE_ELEMENT } from '../../../share';

import { TextElement } from './text';

export class PlainElement {
  type: string;
  className: string | null = null;
  // attrs
  style: Record<string, string | null | undefined> = {};
  attrs: Record<string, string | boolean | null | undefined> = {};
  children: Array<TextElement | PlainElement | string> = [];
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
  setAttribute(
    key: string,
    value: string | boolean | null | undefined | number
  ) {
    if (value !== false && value !== null && value !== undefined) {
      this.attrs[key] = value.toString();
    }
  }

  /**
   *
   * @param {Element} dom
   */
  append(...dom: Array<TextElement | PlainElement>) {
    dom.forEach((d) => this.appendChild(d));
  }

  appendChild(dom: PlainElement | TextElement | string) {
    if (
      dom instanceof PlainElement ||
      dom instanceof TextElement ||
      typeof dom === 'string'
    ) {
      this.children.push(dom);
      return dom;
    } else {
      throw new Error('element instance error');
    }
  }

  serializeStyle() {
    const styleKeys = Object.keys(this.style).filter(
      (key) => this.style[key] !== null && this.style[key] !== undefined
    );
    if (styleKeys.length) {
      return `style="${styleKeys
        .map((key) => `${key}: ${this.style[key]?.toString()};`)
        .reduce((p, c) => p + c, '')}"`;
    }
    return '';
  }

  serializeAttrs() {
    const attrsKeys = Object.keys(this.attrs);
    if (attrsKeys.length) {
      return attrsKeys
        .map((key) => `${key}='${this.attrs[key]?.toString()}'`)
        .reduce((p, c) => `${p} ${c}`, '');
    } else {
      return '';
    }
  }

  serializeProps() {
    let props = '';
    if (this.className !== undefined && this.className !== null) {
      props += ` class="${this.className}"`;
    }
    return props;
  }

  toString(): string {
    if (Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, this.type)) {
      if (this.children.length) {
        if (this.children.length > 1) {
          throw new Error(`can not add child to <${this.type} /> element`);
        } else if (this.children[0].toString() === ' ') {
          // ignore
        }
      }
      return `<${
        this.type
      } ${this.serializeProps()} ${this.serializeStyle()} ${this.serializeAttrs()} />`;
    } else {
      if (this.type) {
        return `<${
          this.type
        } ${this.serializeProps()} ${this.serializeStyle()} ${this.serializeAttrs()} >${this.children
          .reduce<Array<TextElement | string | PlainElement>>((p, c) => {
            if (
              p.length &&
              c instanceof TextElement &&
              p[p.length - 1] instanceof TextElement
            ) {
              p.push('<!-- -->');
              p.push(c);
            } else {
              p.push(c);
            }
            return p;
          }, [])
          .map((dom) => dom.toString())
          .reduce((p, c) => p + c, '')}</${this.type}>`;
      } else {
        return this.children
          .map((dom) => dom.toString())
          .reduce((p, c) => p + c, '');
      }
    }
  }
}
