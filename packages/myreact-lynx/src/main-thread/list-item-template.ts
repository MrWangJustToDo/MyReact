/**
 * List-item content templates — the deferred-content protocol.
 *
 * The Background Thread captures each <list-item>'s descendant ops into a
 * reusable "template" (a flat op recipe) and ships it to the Main Thread via
 * OP.SET_LIST_ITEM_TEMPLATE instead of eagerly creating the cell's native
 * subtree. This lets the Main Thread decide WHEN to materialize a cell's
 * content (at componentAtIndex time, driven by the native <list>) and reuse
 * materialized cells across scroll via the recycle pool.
 *
 * A template's ops reference the item's own descendant element ids. To replay
 * a template into any target cell we remap those ids to freshly-allocated
 * native elements, so the same template can be mounted many times.
 */

import { getOpFrameLength } from "../shared/op-arity.js";
import { OP } from "../shared/op.js";

import { elements, pageUniqueId } from "./element-registry.js";

/**
 * Replay ids live above normal ShadowElement ids (2+) but must stay within a
 * safe signed range. Previous start `0x80000000` was already past `0xfffffff`.
 */
const REPLAY_ID_START = 0x100000;
const MAX_REPLAY_ID = 0x7fffffff;

/** Next fresh element id for replay-created nodes. */
let nextReplayId = -1;

export interface ListItemTemplate {
  itemId: number;
  reuseIdentifier: string;
  /** Raw descendant op frames: CREATE / CREATE_TEXT / INSERT / SET_* */
  ops: unknown[];
}

const itemTemplates = new Map<number, ListItemTemplate>();

export function resetListItemTemplates(): void {
  itemTemplates.clear();
  nextReplayId = -1;
}

/** Allocate a globally-unique native element id for replay-created nodes. */
export function allocReplayId(): number {
  if (nextReplayId === -1) {
    nextReplayId = REPLAY_ID_START;
  }
  nextReplayId++;
  if (nextReplayId > MAX_REPLAY_ID) {
    throw new Error("[@my-react/react-lynx] list-item replay id space exhausted");
  }
  return nextReplayId;
}

/** Store (or replace) the deferred-content template for a list-item. */
export function setListItemTemplate(itemId: number, reuseIdentifier: string, ops: unknown[]): void {
  itemTemplates.set(itemId, {
    itemId,
    reuseIdentifier,
    ops: ops.map((o) => o),
  });
}

export function getListItemTemplate(itemId: number): ListItemTemplate | undefined {
  return itemTemplates.get(itemId);
}

export function clearListItemTemplate(itemId: number): void {
  itemTemplates.delete(itemId);
}

function createNative(type: string): LynxElement {
  const parentComponentUniqueId = pageUniqueId;
  switch (type) {
    case "view":
      return __CreateView(parentComponentUniqueId);
    case "text":
      return __CreateText(parentComponentUniqueId);
    case "image":
      return __CreateImage(parentComponentUniqueId);
    case "scroll-view":
      return __CreateScrollView(parentComponentUniqueId);
    case "__comment":
      return __CreateRawText("");
    default:
      return __CreateElement(type, parentComponentUniqueId);
  }
}

/**
 * Materialize a deferred-content template as a native subtree under `wrapper`.
 *
 * Template ops reference the item's original descendant ids; those are remapped
 * to freshly-allocated native elements so one template can be mounted into any
 * cell. Returns every top-level child appended under the wrapper (usually one).
 *
 * @param template The deferred-content template.
 * @param wrapper The native <list-item> element built from the item's CREATE.
 * @returns top-level content roots under the wrapper (empty if none).
 */
export function materializeTemplate(template: ListItemTemplate, wrapper: LynxElement): LynxElement[] {
  const created = new Map<number, { el: LynxElement; newId: number }>();
  const rootChildren: LynxElement[] = [];
  const ops = template.ops;
  let i = 0;

  while (i < ops.length) {
    const code = ops[i] as number;
    const len = getOpFrameLength(ops, i);
    if (len === null) {
      throw new Error(`[@my-react/react-lynx] malformed list-item template op ${code} at ${i}`);
    }

    switch (code) {
      case OP.CREATE: {
        const oldId = ops[i + 1] as number;
        const type = ops[i + 2] as string;
        const el = createNative(type);
        const newId = allocReplayId();
        created.set(oldId, { el, newId });
        elements.set(newId, el);
        if (type !== "__comment") {
          __SetAttribute(el, `react-ref-${newId}`, 1);
        }
        break;
      }
      case OP.CREATE_TEXT: {
        const oldId = ops[i + 1] as number;
        const el = __CreateText(pageUniqueId);
        const newId = allocReplayId();
        created.set(oldId, { el, newId });
        elements.set(newId, el);
        __SetAttribute(el, `react-ref-${newId}`, 1);
        break;
      }
      case OP.INSERT: {
        const parentOld = ops[i + 1] as number;
        const childOld = ops[i + 2] as number;
        const child = created.get(childOld);
        if (!child) throw new Error(`[@my-react/react-lynx] template INSERT references unmounted child ${childOld}`);
        if (parentOld === template.itemId) {
          // Top-level child → attach under the wrapper.
          __AppendElement(wrapper, child.el);
          rootChildren.push(child.el);
        } else {
          const parent = created.get(parentOld);
          if (parent) __AppendElement(parent.el, child.el);
        }
        break;
      }
      case OP.SET_TEXT: {
        const oldId = ops[i + 1] as number;
        const text = ops[i + 2] as string;
        const el = created.get(oldId)?.el;
        if (el) __SetAttribute(el, "text", text);
        break;
      }
      case OP.SET_PROP: {
        const oldId = ops[i + 1] as number;
        const key = ops[i + 2] as string;
        const value = ops[i + 3];
        const el = created.get(oldId)?.el;
        if (el) __SetAttribute(el, key, value);
        break;
      }
      case OP.SET_STYLE: {
        const oldId = ops[i + 1] as number;
        const value = ops[i + 2];
        const el = created.get(oldId)?.el;
        if (el) __SetInlineStyles(el, value as string | object);
        break;
      }
      case OP.SET_CLASS: {
        const oldId = ops[i + 1] as number;
        const cls = ops[i + 2] as string;
        const el = created.get(oldId)?.el;
        if (el) __SetClasses(el, cls);
        break;
      }
      case OP.SET_ID: {
        const oldId = ops[i + 1] as number;
        const idStr = ops[i + 2] as string | null | undefined;
        const el = created.get(oldId)?.el;
        if (el) __SetID(el, idStr ?? null);
        break;
      }
      default: {
        // Events / gesture / worklet etc. are not re-materialized on replay —
        // those remain bound via the eager path. Skip.
        break;
      }
    }
    i += len;
  }

  return rootChildren;
}

/** Dispose a materialized cell's native elements (registered during replay). */
export function disposeMaterializedSubtree(_root: LynxElement): void {
  // Native list will remove the wrapper; replay-created element ids in the
  // global `elements` map are cleaned lazily via reset/teardown. Nothing to
  // do here for correctness.
}
