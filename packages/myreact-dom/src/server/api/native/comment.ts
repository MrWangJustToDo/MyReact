import type { PlainElement } from "./plain";
import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export class CommentStartElement {
  parentElement: PlainElement | null = null;

  toString() {
    return `<!-- [ -->`;
  }
}

/**
 * @internal
 */
export class CommentEndElement {
  parentElement: PlainElement | null = null;

  toString() {
    return `<!-- ] -->`;
  }
}

/**
 * @internal
 */
export interface CommentElementDev extends CommentStartElement, CommentEndElement {
  _debugFiber: MyReactFiberNode;
  _debugElement: MyReactElementNode;
}
