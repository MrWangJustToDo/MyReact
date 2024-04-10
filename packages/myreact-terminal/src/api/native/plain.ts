import Yoga, { type Node as YogaNode } from "yoga-layout";

import { measureTextElement } from "./measure-element";
import { applyStyles, type Styles } from "./styles";

import type { DOMNode } from "./dom";
import type { MyReactFiberNodeDev } from "@my-react/react-reconciler";

export const PlainTextType = "terminal-text";

export const PlainBoxType = "terminal-box";

export const PlainVirtualTextType = "terminal-virtual-text";

export type PlainElementType = typeof PlainTextType | typeof PlainBoxType | typeof PlainVirtualTextType;

export class PlainElement {
  type: PlainElementType;

  nodeName: PlainElementType;

  style: Styles;

  attributes: Record<string, string | boolean | number>;

  parentNode?: PlainElement;

  yogaNode?: YogaNode;

  internal_static?: boolean;

  childNodes: DOMNode[];

  internal_transform?: (s: string, index: number) => string;

  // Internal properties

  isStaticDirty?: boolean;

  staticNode?: PlainElement;

  onComputeLayout?: () => void;

  onRender?: () => void;

  onImmediateRender?: () => void;

  __fiber__?: MyReactFiberNodeDev;

  constructor(nodeName: PlainElement["type"]) {
    this.type = nodeName;

    this.style = {};

    this.attributes = {};

    this.childNodes = [];

    this.nodeName = nodeName;

    this.parentNode = undefined;

    this.yogaNode = nodeName === PlainVirtualTextType ? undefined : Yoga.Node.create();

    if (nodeName === PlainTextType) {
      this.yogaNode?.setMeasureFunc(measureTextElement.bind(null, this));
    }
  }

  addEventListener() {
    void 0;
  }

  removeEventListener() {
    void 0;
  }

  setStyle(style: Styles) {
    this.style = style;
  }

  setAttribute(key: string, value: string | boolean | number) {
    this.attributes[key] = value;
  }

  removeAttribute(key: string) {
    delete this.attributes[key];
  }

  applyStyle() {
    if (this.yogaNode) {
      applyStyles(this.yogaNode, this.style);
    }
  }
}
