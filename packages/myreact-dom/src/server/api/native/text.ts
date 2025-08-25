import type { PlainElement } from "./plain";
import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export class TextElement {
  content = "";
  parentElement: PlainElement | null = null;

  constructor(content: string) {
    this.content = content;
  }

  toString() {
    return this.content.toString();
  }
}

/**
 * @internal
 */
export class TextElementDev extends TextElement {
  _debugFiber: MyReactFiberNode;
  _debugElement: MyReactElementNode;
}
