// eslint-disable-next-line import/no-named-as-default
import Yoga, { type Node as YogaNode } from "yoga-wasm-web/auto";

import type { DOMNodeAttribute } from "./dom";
import type { Styles } from "./styles";

export const TextType = "terminal-text";

export const BoxType = "terminal-box";

export const VirtualTextType = "terminal-virtual-text";

export class PlainElement {
  type: typeof TextType | typeof BoxType | typeof VirtualTextType;

  nodeName: PlainElement["type"];

  style: Styles;

  attributes: Record<string, DOMNodeAttribute>;

  parentNode?: PlainElement;

  yogaNode?: YogaNode;

  internal_static?: boolean;

  // TODO
  childNodes: PlainElement[];

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

    if (nodeName === 'terminal-text') {
      // this.yogaNode?.setMeasureFunc()
    }
  }
}
