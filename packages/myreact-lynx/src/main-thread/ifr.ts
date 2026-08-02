/**
 * IFR hydration — VueLynx-style ops-stream reconcile.
 *
 * Phases: inactive → enabled (record) → rendered (sealed / hydrating) → hydrated.
 *
 * Flow:
 * 1. Sync MT mount records every applied ops batch (`recordAndApply`).
 * 2. `sealIfrSnapshot` after mount — later MT ops dropped (Suspense must not extend the stream).
 * 3. BG batches via `interceptPatchUpdate`: identical → skip; value diffs → patch;
 *    structural → teardown + apply BG (fallback only).
 *
 * Wired from `main-thread/entry.ts` (`renderPage` / `reactPatchUpdate`).
 * Full debug map: `packages/myreact-lynx/IFR.md`.
 */

import { getOpFrameLength } from "../shared/op-arity.js";
import { OP } from "../shared/op.js";

import { cleanupElementState } from "./element-cleanup.js";
import { clearElementParent, elementParent, elements } from "./element-registry.js";
import { resetGestureState } from "./gesture-apply.js";
import { isListParent, removeListItem, resetListState } from "./list-apply.js";
import { applyOps } from "./ops-apply.js";
import { resetWorkletState } from "./worklet-apply.js";

const PAGE_ROOT_ID = 1;

type Phase = "inactive" | "enabled" | "rendered" | "hydrated";

let phase: Phase = "inactive";
let recordedBatches: unknown[][] = [];
let batchCursor = 0;
let inSyncRender = false;
let warnedPostSeal = false;

/** Value ops: trailing arg may differ; identity args must match. */
const VALUE_OP: Record<number, "patch" | "always"> = {
  [OP.SET_PROP]: "patch",
  [OP.SET_TEXT]: "patch",
  [OP.SET_EVENT]: "patch",
  [OP.SET_STYLE]: "patch",
  [OP.SET_CLASS]: "patch",
  [OP.SET_ID]: "patch",
  [OP.SET_WORKLET_EVENT]: "always",
  [OP.SET_MT_REF]: "always",
  [OP.INIT_MT_REF]: "always",
  [OP.SET_GESTURE]: "always",
};

function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  const aArr = Array.isArray(a);
  if (aArr !== Array.isArray(b)) return false;
  if (aArr) {
    const aa = a as unknown[];
    const bb = b as unknown[];
    if (aa.length !== bb.length) return false;
    for (let i = 0; i < aa.length; i++) {
      if (!sameValue(aa[i], bb[i])) return false;
    }
    return true;
  }
  const ao = a as Record<string, unknown>;
  const bo = b as Record<string, unknown>;
  const keys = Object.keys(ao);
  if (keys.length !== Object.keys(bo).length) return false;
  for (const k of keys) {
    if (!sameValue(ao[k], bo[k])) return false;
  }
  return true;
}

function setDropMtOpsFlag(drop: boolean): void {
  globalThis.__MY_REACT_LYNX_IFR_DROP_MT_OPS__ = drop;
}

/** Activate recording for the upcoming sync mount inside renderPage. */
export function beginIfrSession(): void {
  phase = "enabled";
  recordedBatches = [];
  batchCursor = 0;
  warnedPostSeal = false;
  setDropMtOpsFlag(false);
}

/**
 * Apply ops during IFR sync mount (and record). After seal, drops MT ops so
 * Suspense resolves cannot extend the hydration stream.
 */
export function recordAndApply(ops: unknown[]): void {
  if (phase === "rendered" || phase === "hydrated") {
    if (__DEV__ && !warnedPostSeal) {
      warnedPostSeal = true;
      console.warn(
        "[@my-react/react-lynx][IFR] Dropping Main Thread ops after first-screen snapshot. " +
          "Keep first-screen render deterministic; side effects / Suspense updates belong on Background."
      );
    }
    return;
  }
  if (phase === "inactive" || ops.length === 0) {
    applyOps(ops);
    return;
  }
  recordedBatches.push(ops.slice());
  applyOps(ops);
}

/** Seal the recorded stream after sync mount returns. */
export function sealIfrSnapshot(): void {
  if (phase === "enabled") {
    phase = "rendered";
    setDropMtOpsFlag(true);
  }
}

export function isIfrHydrating(): boolean {
  return phase === "rendered";
}

export function markIfrSyncRender(active: boolean): void {
  inSyncRender = active;
}

export function isIfrSyncRender(): boolean {
  return inSyncRender;
}

/**
 * Hydrate one BG ops batch against the recorded IFR stream.
 * @returns true if the batch was consumed (caller must not applyOps again).
 */
export function interceptPatchUpdate(ops: unknown[]): boolean {
  if (phase !== "rendered") return false;

  if (batchCursor >= recordedBatches.length) {
    phase = "hydrated";
    setDropMtOpsFlag(true);
    recordedBatches = [];
    batchCursor = 0;
    return false;
  }

  // Empty ops (e.g. endFirstScreen-only flush) — not a hydrate batch.
  if (ops.length === 0) {
    return false;
  }

  const recorded = recordedBatches[batchCursor]!;
  const patchOps = reconcileBatch(recorded, ops);
  if (patchOps) {
    if (patchOps.length > 0) {
      applyOps(patchOps);
    } else if (__DEV__) {
      console.log(`[@my-react/react-lynx][IFR] hydrate skip identical batch ${batchCursor}`);
    }
    advanceCursor();
    return true;
  }

  if (__DEV__) {
    console.warn(
      "[@my-react/react-lynx][IFR] hydration structural mismatch — tearing down IFR tree and applying Background batch. " +
        "First-screen code should be deterministic and the same on both threads (initial route/data)."
    );
  }
  teardownIfrTree();
  phase = "hydrated";
  setDropMtOpsFlag(true);
  recordedBatches = [];
  batchCursor = 0;
  applyOps(ops);
  return true;
}

function advanceCursor(): void {
  batchCursor++;
  if (batchCursor >= recordedBatches.length) {
    phase = "hydrated";
    setDropMtOpsFlag(true);
    recordedBatches = [];
    batchCursor = 0;
    if (__DEV__) {
      console.log("[@my-react/react-lynx][IFR] hydration complete");
    }
  }
}

function reconcileBatch(recorded: unknown[], incoming: unknown[]): unknown[] | null {
  const patchOps: unknown[] = [];
  let ri = 0;
  let ii = 0;

  while (ri < recorded.length && ii < incoming.length) {
    const rCode = recorded[ri] as number;
    const iCode = incoming[ii] as number;
    if (rCode !== iCode) return null;

    const rLen = getOpFrameLength(recorded, ri);
    const iLen = getOpFrameLength(incoming, ii);
    if (rLen == null || iLen == null || rLen !== iLen) return null;

    const valueMode = VALUE_OP[rCode];
    const arity = rLen - 1;
    const strictArgs = valueMode === undefined ? arity : arity - 1;

    for (let k = 1; k <= strictArgs; k++) {
      if (!sameValue(recorded[ri + k], incoming[ii + k])) return null;
    }

    if (valueMode !== undefined) {
      const rVal = recorded[ri + arity];
      const iVal = incoming[ii + arity];
      if (valueMode === "always" || !sameValue(rVal, iVal)) {
        for (let k = 0; k < rLen; k++) patchOps.push(incoming[ii + k]);
      }
    }

    ri += rLen;
    ii += iLen;
  }

  if (ri < recorded.length) return null;

  for (; ii < incoming.length; ii++) {
    patchOps.push(incoming[ii]);
  }
  return patchOps;
}

/** Remove IFR-created elements; leave page root. */
export function teardownIfrTree(): void {
  const page = elements.get(PAGE_ROOT_ID);
  const createdIds = new Set<number>();
  const rootChildIds = new Set<number>();

  for (const batch of recordedBatches) {
    let i = 0;
    while (i < batch.length) {
      const len = getOpFrameLength(batch, i);
      if (len == null) break;
      const code = batch[i] as number;
      if (code === OP.CREATE || code === OP.CREATE_TEXT) {
        createdIds.add(batch[i + 1] as number);
      } else if (code === OP.INSERT) {
        const parentId = batch[i + 1] as number;
        const childId = batch[i + 2] as number;
        if (parentId === PAGE_ROOT_ID) rootChildIds.add(childId);
        else rootChildIds.delete(childId);
      } else if (code === OP.REMOVE) {
        const parentId = batch[i + 1] as number;
        if (parentId === PAGE_ROOT_ID) {
          rootChildIds.delete(batch[i + 2] as number);
        }
      }
      i += len;
    }
  }

  if (page) {
    for (const id of rootChildIds) {
      const el = elements.get(id);
      if (!el) continue;
      try {
        __RemoveElement(page, el);
      } catch {
        /* ignore */
      }
    }
    __FlushElementTree(page);
  }

  for (const id of createdIds) {
    clearElementParent(id);
    if (elements.has(id)) cleanupElementState(id);
  }

  // Any leftover non-page nodes (defensive).
  for (const id of [...elements.keys()]) {
    if (id === PAGE_ROOT_ID) continue;
    const child = elements.get(id);
    const parentId = elementParent.get(id) ?? PAGE_ROOT_ID;
    const parent = elements.get(parentId) ?? page;
    if (parent && child) {
      try {
        if (isListParent(parentId)) removeListItem(parentId, id);
        else __RemoveElement(parent, child);
      } catch {
        /* ignore */
      }
    }
    clearElementParent(id);
    cleanupElementState(id);
  }

  resetListState();
  resetWorkletState();
  resetGestureState();
  elementParent.clear();
}

/** Reset — testing / renderPage re-entry. */
export function resetIfrState(): void {
  phase = "inactive";
  recordedBatches = [];
  batchCursor = 0;
  inSyncRender = false;
  warnedPostSeal = false;
  setDropMtOpsFlag(false);
}
