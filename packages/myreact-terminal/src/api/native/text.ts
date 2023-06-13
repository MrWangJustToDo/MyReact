import { type Node as YogaNode } from "yoga-wasm-web/auto";

import type { PlainElement } from "./plain";
import type { Styles } from "./styles";

export const TextType = "#text";

export type TextElementType = typeof TextType;

export class TextElement {
  type: TextElementType;

  nodeName: TextElementType;

  nodeValue: string;

  style: Styles;

  parentNode?: PlainElement;

  yogaNode?: YogaNode;

  internal_static?: boolean;

  constructor(nodeValue: string) {
    this.type = TextType;

    this.style = {};

    this.nodeName = TextType;

    this.yogaNode = undefined;

    this.parentNode = undefined;

    this.nodeValue = String(nodeValue);
  }
}
