import { type Node as YogaNode } from "yoga-layout";

import type { PlainElement } from "./plain";
import type { Styles } from "./styles";
import type { MyReactFiberNodeDev } from "@my-react/react-reconciler";

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

  __fiber__?: MyReactFiberNodeDev;

  constructor(nodeValue: string) {
    this.type = TextType;

    this.style = {};

    this.nodeName = TextType;

    this.yogaNode = undefined;

    this.parentNode = undefined;

    this.nodeValue = String(nodeValue);
  }
}
