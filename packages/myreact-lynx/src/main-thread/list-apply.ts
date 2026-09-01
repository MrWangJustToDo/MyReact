/* eslint-disable max-lines */
/**
 * List element management for the Main Thread ops executor.
 *
 * Native <list> elements must be created via __CreateList with callbacks.
 * Diffs are flushed via `update-list-info`.
 *
 * Diff strategy (aligned with VueLynx / ReactLynx ListUpdateInfoRecording):
 * - Mutate a live `listItems` array so `componentAtIndex` always sees current order.
 * - On flush, diff `lastFlushed` against `listItems` with LIS-based move detection:
 *   items that stay in increasing old-index order are kept; everything else is
 *   remove+insert. Avoids "duplicated item-key" (native error 2202) from naive
 *   append-only `listItemsReported` tracking.
 */

import { elements, pageUniqueId } from "./element-registry.js";
import { clearListItemTemplate, getListItemTemplate, materializeTemplate, resetListItemTemplates } from "./list-item-template.js";
import { dispatchListLifecycle } from "./list-lifecycle.js";

/**
 * Compile-time/runtime flag: when on, list-item content is materialized lazily
 * at componentAtIndex time (from the deferred template) instead of eagerly on
 * first flush, and materialized cells are re-used on scroll-back.
 */
const listRecycleEnabled = (): boolean => {
  // IFR sync mount records a deferred op stream that cannot hydrate cleanly
  // against BG batches and leaves first-screen list cells empty — refuse both.
  if (typeof __MY_REACT_LYNX_IFR__ !== "undefined" && __MY_REACT_LYNX_IFR__) {
    return false;
  }
  if (typeof __MY_REACT_LYNX_LIST_RECYCLE__ !== "undefined") {
    return __MY_REACT_LYNX_LIST_RECYCLE__;
  }
  return false;
};

/** Cache of materialized content roots (top-level children), keyed by list-item bgId. */
const materializedRoot = new Map<number, LynxElement[]>();

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** Per-list state: ordered list of child elements that the native list can request */
export interface ListItemEntry {
  el: LynxElement;
  bgId: number;
}
const listItems = new Map<number, ListItemEntry[]>();

/** Snapshot of listItems after the last successful flush (native's view). */
const lastFlushed = new Map<number, ListItemEntry[]>();

/** Set of BG-thread element IDs that are <list> elements */
const listElementIds = new Set<number>();

/** item-key values per bg element ID (for list-item children) */
const itemKeyMap = new Map<number, string>();

/**
 * Platform info attributes for list items — these must go ONLY into
 * update-list-info's insertAction / updateAction, NOT via __SetAttribute.
 * Setting them both ways causes the native list to count items twice.
 */
const PLATFORM_INFO_ATTRS = new Set([
  "item-key",
  "estimated-main-axis-size-px",
  "estimated-height-px",
  "estimated-height",
  "reuse-identifier",
  "full-span",
  "sticky-top",
  "sticky-bottom",
  "recyclable",
]);

/** Per list-item bg ID -> platform info attributes */
const listItemPlatformInfo = new Map<number, Record<string, unknown>>();

/** bgIds whose platform info changed since last flush */
const dirtyPlatformInfo = new Set<number>();

/**
 * Reverse map: native <list-item> `LynxElement` → Background element id.
 * Lets `enqueueComponent` (which receives only the native element from the
 * native list) resolve the bgId needed to dispatch the recycle callback.
 */
const mtElementToBgId = new Map<LynxElement, number>();

// ---------------------------------------------------------------------------
// Diff (exported for unit tests)
// ---------------------------------------------------------------------------

export interface ListDiffResult {
  removeAction: number[];
  insertAction: Array<{ position: number; bgId: number }>;
  /** bgIds that remained in place (LIS) — eligible for updateAction */
  stayedBgIds: Set<number>;
}

/**
 * Longest increasing subsequence of `seq` (values are old indices).
 * Returns the set of values (old indices) that are part of one LIS.
 */
export function longestIncreasingSubsequence(seq: number[]): Set<number> {
  const n = seq.length;
  if (n === 0) return new Set();
  const tails: number[] = [];
  const prev: number[] = Array.from({ length: n }, () => -1);

  for (let i = 0; i < n; i++) {
    const v = seq[i]!;
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (seq[tails[mid]!]! < v) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0) prev[i] = tails[lo - 1]!;
    if (lo === tails.length) tails.push(i);
    else tails[lo] = i;
  }

  const lisIdx = new Set<number>();
  let k = tails[tails.length - 1]!;
  while (k >= 0) {
    lisIdx.add(seq[k]!);
    k = prev[k]!;
  }
  return lisIdx;
}

/**
 * Diff old (last flushed) vs new (live listItems) by bgId.
 * Stayers = LIS of old indices among items present in both, in new order.
 * Removals = old indices not in stayers. Insertions = new items not in stayers.
 */
export function diffListItems(oldItems: ListItemEntry[], newItems: ListItemEntry[]): ListDiffResult {
  const oldIndex = new Map<number, number>();
  for (let i = 0; i < oldItems.length; i++) {
    oldIndex.set(oldItems[i]!.bgId, i);
  }

  const commonNewOrder: number[] = [];
  for (const entry of newItems) {
    const oi = oldIndex.get(entry.bgId);
    if (oi !== undefined) commonNewOrder.push(oi);
  }
  const stayedOldIndices = longestIncreasingSubsequence(commonNewOrder);

  const removeAction: number[] = [];
  for (let i = 0; i < oldItems.length; i++) {
    if (!stayedOldIndices.has(i)) removeAction.push(i);
  }

  const insertAction: Array<{ position: number; bgId: number }> = [];
  const stayedBgIds = new Set<number>();
  for (const oi of stayedOldIndices) {
    stayedBgIds.add(oldItems[oi]!.bgId);
  }

  for (let pos = 0; pos < newItems.length; pos++) {
    const bgId = newItems[pos]!.bgId;
    if (!stayedBgIds.has(bgId)) {
      insertAction.push({ position: pos, bgId });
    }
  }

  return { removeAction, insertAction, stayedBgIds };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function createListCallbacks(bgId: number): {
  componentAtIndex: (list: LynxElement, listID: number, cellIndex: number, operationID: number) => number | undefined;
  enqueueComponent: (element?: LynxElement) => void;
  componentAtIndexes: (list: LynxElement, listID: number, cellIndexes: number[], operationIDs: number[]) => void;
} {
  const componentAtIndex = (list: LynxElement, listID: number, cellIndex: number, operationID: number): number | undefined => {
    const items = listItems.get(bgId);
    if (!items || cellIndex < 0 || cellIndex >= items.length) return undefined;
    const entry = items[cellIndex]!;
    const item = entry.el;
    const itemId = entry.bgId;

    if (listRecycleEnabled()) {
      // Lazy: only materialize the deferred content the first time this cell
      // is requested, then reuse it on scroll-back.
      const template = getListItemTemplate(itemId);
      if (template && !materializedRoot.has(itemId)) {
        const roots = materializeTemplate(template, item);
        if (roots.length > 0) materializedRoot.set(itemId, roots);
      }
    }

    __AppendElement(list, item);
    const sign = __GetElementUniqueID(item);
    // Notify the Background Thread that this cell is about to be mounted, so
    // an `onComponentAtIndex` prop handler can run.
    dispatchListLifecycle(itemId, "onComponentAtIndex", {
      listID,
      cellIndex,
      operationID,
      sign,
    });
    __FlushElementTree(item, {
      triggerLayout: true,
      operationID,
      elementID: sign,
      listID,
    });
    return sign;
  };

  const enqueueComponent = (element?: LynxElement) => {
    // Native called us because `element` scrolled out of the viewport and can
    // be recycled. Forward to the Background Thread so an `onRecycleComponent`
    // prop handler can run on the owning <list-item>.
    if (!element) return;
    const itemBgId = mtElementToBgId.get(element);
    if (itemBgId === undefined) return;
    dispatchListLifecycle(itemBgId, "onRecycleComponent", {
      listID: bgId,
      sign: __GetElementUniqueID(element),
    });
  };

  const componentAtIndexes = (list: LynxElement, listID: number, cellIndexes: number[], operationIDs: number[]): void => {
    const items = listItems.get(bgId);
    if (!items) return;
    const elementIDs: number[] = [];
    for (let j = 0; j < cellIndexes.length; j++) {
      const cellIndex = cellIndexes[j]!;
      if (cellIndex < 0 || cellIndex >= items.length) {
        elementIDs.push(-1);
        continue;
      }
      const entry = items[cellIndex]!;
      const item = entry.el;
      const itemId = entry.bgId;

      if (listRecycleEnabled()) {
        const template = getListItemTemplate(itemId);
        if (template && !materializedRoot.has(itemId)) {
          const roots = materializeTemplate(template, item);
          if (roots.length > 0) materializedRoot.set(itemId, roots);
        }
      }

      __AppendElement(list, item);
      const sign = __GetElementUniqueID(item);
      dispatchListLifecycle(itemId, "onComponentAtIndex", {
        listID: bgId,
        cellIndex,
        operationID: operationIDs[j],
        sign,
      });
      elementIDs.push(sign);
    }
    __FlushElementTree(list, {
      triggerLayout: true,
      operationIDs,
      elementIDs,
      listID,
    });
  };

  return { componentAtIndex, enqueueComponent, componentAtIndexes };
}

function buildPlatformAction(itemBgId: number, position: number): Record<string, unknown> {
  const action: Record<string, unknown> = {
    position,
    type: "list-item",
    "item-key": itemKeyMap.get(itemBgId) ?? String(position),
  };
  const pInfo = listItemPlatformInfo.get(itemBgId);
  if (pInfo) Object.assign(action, pInfo);
  return action;
}

// ---------------------------------------------------------------------------
// Public API (called from ops-apply.ts switch cases)
// ---------------------------------------------------------------------------

/** Check if a parent element ID is a <list> element */
export function isListParent(parentId: number): boolean {
  return listElementIds.has(parentId);
}

/** Check if a prop key is a platform-info attribute for list items */
export function isPlatformInfoAttr(key: string): boolean {
  return PLATFORM_INFO_ATTRS.has(key);
}

/** CREATE case: create a native <list> element and set up tracking state */
export function createListElement(id: number): LynxElement {
  listElementIds.add(id);
  listItems.set(id, []);
  lastFlushed.set(id, []);
  const cbs = createListCallbacks(id);
  const el = __CreateList(pageUniqueId, cbs.componentAtIndex, cbs.enqueueComponent, {}, cbs.componentAtIndexes);
  __SetCSSId([el], 0);
  return el;
}

/**
 * Place a child into the live list array.
 * `anchorId === -1` → append; otherwise insert before anchor.
 * If the child is already in this list, splice it out first (same-list move).
 */
export function insertListItem(parentId: number, child: LynxElement, childId: number, anchorId = -1): void {
  const items = listItems.get(parentId);
  if (!items) return;

  const existingIdx = items.findIndex((e) => e.bgId === childId);
  if (existingIdx !== -1) {
    items.splice(existingIdx, 1);
  }

  const entry: ListItemEntry = { el: child, bgId: childId };
  mtElementToBgId.set(child, childId);
  if (anchorId === -1) {
    items.push(entry);
  } else {
    const anchorIdx = items.findIndex((e) => e.bgId === anchorId);
    if (anchorIdx === -1) items.push(entry);
    else items.splice(anchorIdx, 0, entry);
  }
}

/** Drop a child from the live list array (hard remove). Diff emits removeAction on flush. */
export function removeListItem(parentId: number, childId: number): void {
  const items = listItems.get(parentId);
  if (!items) return;
  const idx = items.findIndex((entry) => entry.bgId === childId);
  if (idx === -1) return;
  const entry = items[idx]!;
  items.splice(idx, 1);
  mtElementToBgId.delete(entry.el);
  materializedRoot.delete(childId);
  clearListItemTemplate(childId);
  itemKeyMap.delete(childId);
  listItemPlatformInfo.delete(childId);
  dirtyPlatformInfo.delete(childId);
}

/** REMOVE case: drop tracking state when a <list> element itself is removed */
export function removeListElement(id: number): void {
  listElementIds.delete(id);
  const items = listItems.get(id);
  if (items) {
    for (const entry of items) mtElementToBgId.delete(entry.el);
  }
  listItems.delete(id);
  lastFlushed.delete(id);
}

/** SET_PROP case: store a platform-info attribute; mark dirty for updateAction if already flushed */
export function setPlatformInfoProp(id: number, key: string, value: unknown): void {
  const info = listItemPlatformInfo.get(id);
  if (info) {
    info[key] = value;
  } else {
    listItemPlatformInfo.set(id, { [key]: value });
  }
  if (key === "item-key") itemKeyMap.set(id, String(value));
  dirtyPlatformInfo.add(id);
}

/**
 * Diff lastFlushed → listItems and set `update-list-info`.
 */
export function flushListUpdates(): void {
  for (const [bgId, items] of listItems) {
    const prev = lastFlushed.get(bgId) ?? [];
    const { removeAction, insertAction, stayedBgIds } = diffListItems(prev, items);

    const updateAction: Record<string, unknown>[] = [];
    for (const stayedId of stayedBgIds) {
      if (!dirtyPlatformInfo.has(stayedId)) continue;
      const idx = items.findIndex((e) => e.bgId === stayedId);
      if (idx === -1) continue;
      const pInfo = listItemPlatformInfo.get(stayedId) ?? {};
      updateAction.push({
        ...pInfo,
        from: idx,
        to: idx,
        flush: false,
        type: "list-item",
      });
      dirtyPlatformInfo.delete(stayedId);
    }

    for (const { bgId: itemBgId } of insertAction) {
      dirtyPlatformInfo.delete(itemBgId);
    }

    if (removeAction.length === 0 && insertAction.length === 0 && updateAction.length === 0) {
      continue;
    }

    const listEl = elements.get(bgId);
    if (!listEl) continue;

    __SetAttribute(listEl, "update-list-info", {
      insertAction: insertAction.map(({ position, bgId: itemBgId }) => buildPlatformAction(itemBgId, position)),
      removeAction,
      updateAction,
    });

    lastFlushed.set(
      bgId,
      items.map((e) => ({ el: e.el, bgId: e.bgId }))
    );
  }
}

/**
 * Drop previously materialized content for a list-item (e.g. after a template
 * update). Removes native children from the wrapper and clears the cache so the
 * next componentAtIndex rematerializes. If the cell is already on-screen, also
 * rematerialize immediately so the UI does not stay stale until scroll.
 */
export function invalidateListItemContent(itemId: number): void {
  const roots = materializedRoot.get(itemId);
  const wasMaterialized = roots != null && roots.length > 0;
  const wrapper = elements.get(itemId);
  if (wrapper && roots) {
    for (const root of roots) {
      try {
        __RemoveElement(wrapper, root);
      } catch {
        /* ignore — wrapper may already have been detached */
      }
    }
  }
  materializedRoot.delete(itemId);

  // Only rebuild immediately when the cell was already on-screen / materialized.
  // Otherwise keep deferred until the next componentAtIndex.
  if (!wasMaterialized || !listRecycleEnabled() || !wrapper) return;
  const template = getListItemTemplate(itemId);
  if (!template) return;
  const next = materializeTemplate(template, wrapper);
  if (next.length > 0) materializedRoot.set(itemId, next);
}

/** Reset all list state — for testing only. */
export function resetListState(): void {
  listItems.clear();
  lastFlushed.clear();
  listElementIds.clear();
  itemKeyMap.clear();
  listItemPlatformInfo.clear();
  dirtyPlatformInfo.clear();
  mtElementToBgId.clear();
  materializedRoot.clear();
  resetListItemTemplates();
}
