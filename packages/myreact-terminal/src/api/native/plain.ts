import Yoga, { type Node as YogaNode } from "yoga-wasm-web/auto";

import { measureTextElement } from "./measure-element";
import { applyStyles, type Styles } from "./styles";

import type { DOMNode } from "./dom";

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

  internal_transform?: (s: string) => string;

  // Internal properties

  isStaticDirty?: boolean;

  staticNode?: PlainElement;

  onComputeLayout?: () => void;

  onRender?: () => void;

  onImmediateRender?: () => void;

  constructor(nodeName: PlainElement["type"]) {
    this.type = nodeName;

    this.style = {};

    this.attributes = {};

    this.childNodes = [];

    this.nodeName = nodeName;

    this.parentNode = undefined;

    this.yogaNode = nodeName === "terminal-virtual-text" ? undefined : Yoga.Node.create();

    if (nodeName === "terminal-text") {
      this.yogaNode?.setMeasureFunc(measureTextElement.bind(null, this));
    }
  }

  setStyle(style: Styles) {
    this.style = style;
  }

  setAttribute(key: string, value: string | boolean | number) {
    this.attributes[key] = value;
  }

  applyStyle() {
    if (this.yogaNode) {
      applyStyles(this.yogaNode, this.style);
    }
  }
}
