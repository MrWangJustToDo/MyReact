/**
 * Background-thread deferred list-item content capture.
 *
 * MyReact's op stream is phase-separated (all CREATEs, then all INSERTs, then
 * all SET_*) so a single <list-item>'s subtree cannot be sliced out of the flat
 * buffer contiguously. Instead we post-process the buffer before flush:
 *
 *   1. Walk frames, building parent→child from INSERT frames and recording the
 *      <list-item> ids (from CREATE frames).
 *   2. For each list-item, compute its transitive descendant closure.
 *   3. Extract every descendant op frame into a per-item "template", and remove
 *      those frames from the main stream.
 *   4. Emit OP.SET_LIST_ITEM_TEMPLATE(itemId, reuseId, ops[]) in their place so
 *      the Main Thread stores the recipe instead of eagerly creating the cell.
 *
 * The wrapper's own CREATE/INSERT and its SET_* (including platform-info props)
 * are NOT descendants and thus remain in the main stream, so the native
 * <list-item> wrapper and its update-list-info bookkeeping stay eager.
 *
 * Runs only when the recycle feature is enabled (see listRecycleEnabled).
 */

import { getOpFrameLength } from "../../shared/op-arity.js";
import { OP } from "../../shared/op.js";

const listRecycleEnabled = (): boolean => {
  // Never defer under IFR — recorded MT stream would omit cell content and
  // diverge from BG hydrate batches.
  if (typeof __MY_REACT_LYNX_IFR__ !== "undefined" && __MY_REACT_LYNX_IFR__) {
    return false;
  }
  if (typeof __MY_REACT_LYNX_LIST_RECYCLE__ !== "undefined") {
    return __MY_REACT_LYNX_LIST_RECYCLE__;
  }
  return false;
};
/**
 * Extract each deferred list-item's descendant frames into templates and
 * rewrite `ops` in place, replacing descendant frames with SET_LIST_ITEM_TEMPLATE.
 * Returns the new op array (a fresh array is always returned).
 */
export function deferListItemContent(ops: unknown[]): unknown[] {
  if (!listRecycleEnabled() || ops.length === 0) {
    return ops;
  }

  // Pass 1: build parent map + list-item ids + reuse identifiers.
  const childrenOf = new Map<number, number[]>();
  const listItems = new Map<number, string>(); // itemId -> reuseIdentifier

  let i = 0;
  while (i < ops.length) {
    const code = ops[i] as number;
    const len = getOpFrameLength(ops, i);
    if (len === null) break;
    if (code === OP.CREATE) {
      const id = ops[i + 1] as number;
      const type = ops[i + 2] as string;
      if (type === "list-item") listItems.set(id, "");
    } else if (code === OP.INSERT) {
      const parentId = ops[i + 1] as number;
      const childId = ops[i + 2] as number;
      const arr = childrenOf.get(parentId) ?? (childrenOf.set(parentId, []), childrenOf.get(parentId)!)!;
      arr.push(childId);
    } else if (code === OP.SET_PROP) {
      const id = ops[i + 1] as number;
      if (listItems.has(id) && (ops[i + 2] as string) === "reuse-identifier") {
        listItems.set(id, ops[i + 3] as string);
      }
    }
    i += len;
  }

  if (listItems.size === 0) {
    return ops;
  }

  // Pass 2: BFS descendant closure per list-item, and a flat descendant→owner map.
  const ownerOf = new Map<number, number>(); // descendantId -> itemId
  for (const itemId of listItems.keys()) {
    const stack = [itemId];
    while (stack.length) {
      const cur = stack.pop()!;
      const kids = childrenOf.get(cur);
      if (kids) {
        for (const kid of kids) {
          if (!ownerOf.has(kid)) {
            ownerOf.set(kid, itemId);
            stack.push(kid);
          }
        }
      }
    }
  }

  // Pass 3: walk and rebuild, capturing descendant frames into templates.
  const out: unknown[] = [];
  const templates = new Map<number, unknown[]>();
  const captureSubject = (code: number): "self" | "other" | undefined => {
    switch (code) {
      case OP.CREATE:
      case OP.CREATE_TEXT:
      case OP.INSERT:
        return "self"; // create: the id; insert: the child id
      case OP.SET_PROP:
      case OP.SET_TEXT:
      case OP.SET_STYLE:
      case OP.SET_CLASS:
      case OP.SET_ID:
        return "other"; // the subject id is ops[i+1]
      default:
        // Events / gestures / worklets are intentionally NOT captured: they
        // reference BG shadow closures that cannot be re-materialized on the
        // Main Thread. They stay in the main stream and no-op on the deferred
        // (non-existent) descendant ids. Descendant interactivity is not yet
        // supported under listRecycle — see FEATURES.md.
        return undefined;
    }
  };

  i = 0;
  while (i < ops.length) {
    const code = ops[i] as number;
    const len = getOpFrameLength(ops, i);
    if (len === null) {
      out.push(ops[i++]);
      continue;
    }
    const captureMode = captureSubject(code);
    let subjectId: number | undefined;
    if (captureMode === "self") {
      subjectId = code === OP.INSERT ? (ops[i + 2] as number) : (ops[i + 1] as number);
    } else if (captureMode === "other") {
      subjectId = ops[i + 1] as number;
    }
    let owner: number | undefined;
    if (subjectId !== undefined) owner = ownerOf.get(subjectId);

    if (owner !== undefined) {
      // Descendant frame → route into the owner's template.
      const tpl = templates.get(owner) ?? (templates.set(owner, []), templates.get(owner)!)!;
      tpl.push(...ops.slice(i, i + len));
    } else {
      out.push(...ops.slice(i, i + len));
    }
    i += len;
  }

  // Pass 4: append SET_LIST_ITEM_TEMPLATE ops (order not critical for MT).
  for (const [itemId, reuseIdentifier] of listItems) {
    const tpl = templates.get(itemId);
    if (tpl && tpl.length > 0) {
      out.push(OP.SET_LIST_ITEM_TEMPLATE, itemId, reuseIdentifier, tpl);
    }
  }

  return out;
}
