/**
 * ShadowElement: a lightweight doubly-linked tree node that lives entirely in
 * the Background Thread. It lets MyReact's renderer call parentNode() / nextSibling()
 * synchronously, while the real Lynx elements exist only on the Main Thread.
 *
 * id=1 is reserved for the page root (created via __CreatePage on Main Thread).
 * Regular elements start from id=2.
 */
import type { AnimationV2, NodesRef, SelectorQuery, uiMethodOptions } from "@lynx-js/types";

export type ShadowElementType = "root" | "text" | "comment" | string;

export class ShadowElement {
  static nextId = 2; // 1 is reserved for the page root

  id: number;
  type: ShadowElementType;
  text?: string;
  mtRefId?: number;
  props?: Record<string, unknown>;
  style?: Record<string, unknown>;
  class?: string;
  isText?: boolean;
  parent: ShadowElement | null = null;
  firstChild: ShadowElement | null = null;
  lastChild: ShadowElement | null = null;
  nextSibling: ShadowElement | null = null;
  prevSibling: ShadowElement | null = null;

  constructor(type: string, forceId?: number) {
    if (forceId === undefined) {
      this.id = ShadowElement.nextId++;
    } else {
      this.id = forceId;
    }
    this.type = type;
    if (this.type === "#text") {
      this.isText = true;
    }
  }

  // ---------------------------------------------------------------------------
  // NodesRef — delegates to the real NodesRef returned by
  // lynx.createSelectorQuery().select(), using types from @lynx-js/types.
  // Each method targets this element via its unique `react-ref-{id}` attribute
  // (set on the MT side during element creation).
  // ---------------------------------------------------------------------------

  /** CSS attribute selector that uniquely identifies this element on MT. */
  get _selector(): string {
    return `[react-ref-${this.id}]`;
  }

  private _select(): NodesRef {
    return lynx.createSelectorQuery().select(this._selector);
  }

  invoke(options: uiMethodOptions): SelectorQuery {
    return this._select().invoke(options);
  }

  setNativeProps(nativeProps: Record<string, unknown>): SelectorQuery {
    return this._select().setNativeProps(nativeProps);
  }

  fields(
    fieldsParam: Record<string, boolean>,
    callback: (data: Record<string, unknown> | null, status: { data: string; code: number }) => void
  ): SelectorQuery {
    return this._select().fields(fieldsParam, callback);
  }

  path(callback: (data: unknown, status: { data: string; code: number }) => void): SelectorQuery {
    return this._select().path(callback);
  }

  animate(animations: AnimationV2[] | AnimationV2): SelectorQuery {
    return this._select().animate(animations);
  }

  playAnimation(ids: string[] | string): SelectorQuery {
    return this._select().playAnimation(ids);
  }

  pauseAnimation(ids: string[] | string): SelectorQuery {
    return this._select().pauseAnimation(ids);
  }

  cancelAnimation(ids: string[] | string): SelectorQuery {
    return this._select().cancelAnimation(ids);
  }

  appendChild(child: ShadowElement) {
    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;

    if (!this.firstChild) {
      this.firstChild = child;
      this.lastChild = child;
      child.prevSibling = null;
      child.nextSibling = null;
      return;
    }

    const last = this.lastChild as ShadowElement;
    last.nextSibling = child;
    child.prevSibling = last;
    child.nextSibling = null;
    this.lastChild = child;
  }

  insertBefore(child: ShadowElement, before: ShadowElement | null) {
    if (!before) {
      this.appendChild(child);
      return;
    }

    if (before.parent !== this) {
      this.appendChild(child);
      return;
    }

    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;

    const prev = before.prevSibling;
    child.prevSibling = prev;
    child.nextSibling = before;
    before.prevSibling = child;

    if (prev) {
      prev.nextSibling = child;
    } else {
      this.firstChild = child;
    }
  }

  removeChild(child: ShadowElement) {
    if (child.parent !== this) {
      return;
    }

    const prev = child.prevSibling;
    const next = child.nextSibling;

    if (prev) {
      prev.nextSibling = next;
    } else {
      this.firstChild = next;
    }

    if (next) {
      next.prevSibling = prev;
    } else {
      this.lastChild = prev;
    }

    child.parent = null;
    child.prevSibling = null;
    child.nextSibling = null;
  }
}

export const PAGE_ROOT_ID = 1;

/** Create the page root shadow element with the reserved id=1. */
export function createPageRoot(): ShadowElement {
  return new ShadowElement("page", PAGE_ROOT_ID);
}
