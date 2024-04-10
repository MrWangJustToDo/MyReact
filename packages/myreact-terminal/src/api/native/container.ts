import Yoga, { type Node as YogaNode } from "yoga-layout";

import { applyStyles, type Styles } from "./styles";

import type { DOMNode } from "./dom";
import type { MyReactFiberNodeDev } from "@my-react/react-reconciler";

const ContainerElementType = "terminal-root";

export class ContainerElement {
  type: typeof ContainerElementType;

  nodeName: typeof ContainerElementType;

  style: Styles;

  attributes: Record<string, string | boolean | number>;

  parentNode?: undefined;

  yogaNode?: YogaNode;

  internal_static?: boolean;

  childNodes: DOMNode[];

  internal_transform?: (s: string, index: number) => string;

  // Internal properties

  isStaticDirty?: boolean;

  staticNode?: ContainerElement;

  onComputeLayout?: () => void;

  onRender?: () => void;

  onImmediateRender?: () => void;

  __fiber__?: MyReactFiberNodeDev;

  constructor(nodeName: typeof ContainerElementType) {
    this.type = nodeName;

    this.style = {};

    this.attributes = {};

    this.childNodes = [];

    this.nodeName = nodeName;

    this.parentNode = undefined;

    this.yogaNode = Yoga.Node.create();
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
