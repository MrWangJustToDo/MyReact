/**
 * Worklet / MainThreadRef ops for the Main Thread executor.
 *
 * Handles SET_WORKLET_EVENT, SET_MT_REF, and INIT_MT_REF operations.
 */

import { onWorkletCtxUpdate, retainWorkletCtx, type WorkletLike } from "../shared/worklet-bindings.js";

import { elements } from "./element-registry.js";
import { isFirstScreenPatch } from "./first-screen-patch.js";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const elementWorkletEvents = new Map<number, Map<string, Record<string, unknown>>>();

function workletEventKey(eventType: string, eventName: string): string {
  return `${eventType}:${eventName}`;
}

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

interface WorkletRefImpl {
  _workletRefMap?: Record<number, { current: unknown; _wvid: number }>;
  updateWorkletRef(ref: unknown, el: LynxElement): void;
}

interface LynxWorkletImpl {
  _refImpl?: WorkletRefImpl;
}

/** Access globalThis.lynxWorkletImpl._refImpl, encapsulating the null check chain */
function getWorkletImpl(): LynxWorkletImpl | undefined {
  if (typeof globalThis !== "undefined" && "lynxWorkletImpl" in (globalThis as Record<string, unknown>)) {
    return (globalThis as Record<string, unknown>)["lynxWorkletImpl"] as LynxWorkletImpl;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Public API (called from ops-apply.ts switch cases)
// ---------------------------------------------------------------------------

/** SET_WORKLET_EVENT: bind a worklet event handler to a native element */
export function applySetWorkletEvent(id: number, eventType: string, eventName: string, ctx: Record<string, unknown>): void {
  const el = elements.get(id);
  if (!el) {
    return;
  }

  let byEvent = elementWorkletEvents.get(id);
  if (!byEvent) {
    byEvent = new Map();
    elementWorkletEvents.set(id, byEvent);
  }
  const key = workletEventKey(eventType, eventName);
  const oldCtx = byEvent.get(key);

  retainWorkletCtx(ctx as WorkletLike);
  onWorkletCtxUpdate(ctx as WorkletLike, oldCtx as WorkletLike | undefined, isFirstScreenPatch(), el);

  // Native Lynx requires _workletType on the value to route the event
  // to runWorklet() instead of publishEvent().
  ctx["_workletType"] = "main-thread";
  __AddEvent(el, eventType, eventName, {
    type: "worklet",
    value: ctx,
  });
  byEvent.set(key, ctx);
}

/** SET_MT_REF: bind a MainThreadRef to a native element via worklet-runtime */
export function applySetMtRef(id: number, refImpl: unknown): void {
  const el = elements.get(id);
  if (!el) {
    return;
  }

  if (refImpl == null) {
    __SetAttribute(el, "has-react-ref", null);
    return;
  }

  // Store in workletRefMap so worklet-runtime can resolve _wvid -> element.
  const impl = getWorkletImpl();
  if (impl?._refImpl) {
    const ref = refImpl as { _wvid?: number; _initValue?: unknown };
    if (ref._wvid != null) {
      const refMap = impl._refImpl._workletRefMap;
      if (refMap && !(ref._wvid in refMap)) {
        refMap[ref._wvid] = {
          current: ref._initValue ?? null,
          _wvid: ref._wvid,
        };
      }
      impl._refImpl.updateWorkletRef(refImpl, el);
    }
  }
}

/** INIT_MT_REF: register a value-only MainThreadRef in the worklet ref map */
export function applyInitMtRef(wvid: number, initValue: unknown): void {
  // Value-only refs (e.g. useMainThreadRef<number>(0)) are NOT bound to
  // elements, so they never go through SET_MT_REF. Without this, worklet
  // functions that access them get undefined from _workletRefMap lookup.
  const impl = getWorkletImpl();
  if (impl?._refImpl) {
    const refMap = impl._refImpl._workletRefMap;
    if (refMap && !(wvid in refMap)) {
      refMap[wvid] = { current: initValue, _wvid: wvid };
    }
  }
}

/** Remove worklet event tracking for an element — called on OP.REMOVE. */
export function removeElementWorkletEvents(id: number): void {
  elementWorkletEvents.delete(id);
}

/** Reset worklet state — for testing only. */
export function resetWorkletState(): void {
  elementWorkletEvents.clear();
}
