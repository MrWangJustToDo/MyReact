/**
 * Main Thread gesture detector application.
 *
 * Ported from @lynx-js/react snapshot/gesture/processGesture.ts for the
 * MyReact ops-based renderer.
 */

import { onWorkletCtxUpdate, retainWorkletCtx, type WorkletLike } from "../shared/worklet-bindings.js";

import { elements } from "./element-registry.js";
import { isFirstScreenPatch } from "./first-screen-patch.js";

const GestureTypeInner = {
  COMPOSED: -1,
} as const;

type GestureKind = {
  __isSerialized?: boolean;
  type?: number;
  gestures?: GestureKind[];
  id?: number;
  callbacks?: Record<string, WorkletLike>;
  config?: Record<string, unknown>;
  waitFor?: { id: number }[];
  simultaneousWith?: { id: number }[];
  continueWith?: { id: number }[];
};

type GestureConfig = {
  callbacks: { name: string; callback: WorkletLike }[];
  config?: Record<string, unknown>;
};

const elementGestures = new Map<number, GestureKind | undefined>();

function isSerializedGesture(gesture: GestureKind | undefined): boolean {
  return gesture?.__isSerialized === true;
}

function getSerializedBaseGesture(gesture: GestureKind | undefined): GestureKind | undefined {
  if (!gesture || !isSerializedGesture(gesture)) {
    return undefined;
  }
  if (gesture.type === GestureTypeInner.COMPOSED) {
    return undefined;
  }
  return gesture;
}

function appendUniqueSerializedBaseGestures(gesture: GestureKind | undefined, out: GestureKind[], seenIds: Set<number>): void {
  if (!gesture || !isSerializedGesture(gesture)) {
    return;
  }

  if (gesture.type === GestureTypeInner.COMPOSED) {
    for (const subGesture of gesture.gestures ?? []) {
      appendUniqueSerializedBaseGestures(subGesture, out, seenIds);
    }
    return;
  }

  const id = gesture.id;
  if (id == null || seenIds.has(id)) {
    return;
  }
  seenIds.add(id);
  out.push(gesture);
}

function appendOldGestureInfo(gesture: GestureKind | undefined, out: GestureKind[], byId: Map<number, GestureKind>): void {
  if (!gesture || !isSerializedGesture(gesture)) {
    return;
  }

  if (gesture.type === GestureTypeInner.COMPOSED) {
    for (const subGesture of gesture.gestures ?? []) {
      appendOldGestureInfo(subGesture, out, byId);
    }
    return;
  }

  const id = gesture.id;
  if (id == null || byId.has(id)) {
    return;
  }
  byId.set(id, gesture);
  out.push(gesture);
}

function collectOldGestureInfo(oldGesture: GestureKind | undefined): {
  uniqOldBaseGestures: GestureKind[];
  oldBaseGesturesById: Map<number, GestureKind>;
} {
  const uniqOldBaseGestures: GestureKind[] = [];
  const oldBaseGesturesById = new Map<number, GestureKind>();
  appendOldGestureInfo(oldGesture, uniqOldBaseGestures, oldBaseGesturesById);
  return { uniqOldBaseGestures, oldBaseGesturesById };
}

function consumeOldBaseGesture(
  baseGesture: GestureKind,
  uniqOldBaseGestures: GestureKind[],
  oldBaseGesturesById: Map<number, GestureKind>
): GestureKind | undefined {
  const id = baseGesture.id;
  if (id == null) {
    return undefined;
  }

  const idMatched = oldBaseGesturesById.get(id);
  if (idMatched) {
    oldBaseGesturesById.delete(id);
    return idMatched;
  }

  const fallback = uniqOldBaseGestures.find((old) => old.id != null && oldBaseGesturesById.has(old.id));
  if (!fallback?.id) {
    return undefined;
  }
  oldBaseGesturesById.delete(fallback.id);
  return fallback;
}

function retainGestureWorkletCtx(gesture: GestureKind | undefined): void {
  const retained: GestureKind[] = [];
  appendUniqueSerializedBaseGestures(gesture, retained, new Set());
  for (const baseGesture of retained) {
    const callbacks = baseGesture.callbacks;
    if (!callbacks) {
      continue;
    }
    for (const key of Object.keys(callbacks)) {
      const callback = callbacks[key];
      if (callback) {
        retainWorkletCtx(callback);
      }
    }
  }
}

function removeGestureDetector(dom: LynxElement, id: number): void {
  if (typeof __RemoveGestureDetector === "function") {
    __RemoveGestureDetector(dom, id);
  }
}

function clearLegacyGestureState(dom: LynxElement): void {
  __SetAttribute(dom, "has-react-gesture", null);
  if (typeof __RemoveGestureDetector !== "function") {
    __SetAttribute(dom, "gesture", null);
  }
}

function getGestureInfo(
  gesture: GestureKind,
  oldGesture: GestureKind | undefined,
  dom: LynxElement
): {
  config: GestureConfig;
  relationMap: { waitFor: number[]; simultaneous: number[]; continueWith: number[] };
} {
  const config: GestureConfig = { callbacks: [] };

  if (gesture.config) {
    config.config = gesture.config;
  }

  const callbacks = gesture.callbacks ?? {};
  for (const key of Object.keys(callbacks)) {
    const callback = callbacks[key]!;
    const oldCallback = oldGesture?.callbacks?.[key];
    onWorkletCtxUpdate(callback, oldCallback, isFirstScreenPatch(), dom);
    config.callbacks.push({ name: key, callback });
  }

  return {
    config,
    relationMap: {
      waitFor: gesture.waitFor?.map((g) => g.id) ?? [],
      simultaneous: gesture.simultaneousWith?.map((g) => g.id) ?? [],
      continueWith: gesture.continueWith?.map((g) => g.id) ?? [],
    },
  };
}

function processGesture(dom: LynxElement, gesture: GestureKind | undefined, oldGesture: GestureKind | undefined): void {
  if (gesture) {
    retainGestureWorkletCtx(gesture);
  }

  if (!gesture || !isSerializedGesture(gesture)) {
    const { oldBaseGesturesById } = collectOldGestureInfo(oldGesture);
    for (const oldBaseGesture of oldBaseGesturesById.values()) {
      if (oldBaseGesture.id != null) {
        removeGestureDetector(dom, oldBaseGesture.id);
      }
    }
    if (oldBaseGesturesById.size > 0) {
      clearLegacyGestureState(dom);
    }
    return;
  }

  const { uniqOldBaseGestures, oldBaseGesturesById } = collectOldGestureInfo(oldGesture);

  const singleBaseGesture = getSerializedBaseGesture(gesture);
  const singleOldBaseGesture = getSerializedBaseGesture(oldGesture);
  if (singleBaseGesture && (!oldGesture || singleOldBaseGesture)) {
    __SetAttribute(dom, "has-react-gesture", true);
    __SetAttribute(dom, "flatten", false);

    if (singleOldBaseGesture?.id != null) {
      removeGestureDetector(dom, singleOldBaseGesture.id);
    }

    const { config, relationMap } = getGestureInfo(singleBaseGesture, singleOldBaseGesture, dom);
    if (singleBaseGesture.id != null && singleBaseGesture.type != null) {
      __SetGestureDetector(dom, singleBaseGesture.id, singleBaseGesture.type, config, relationMap);
    }
    return;
  }

  const uniqBaseGestures: GestureKind[] = [];
  appendUniqueSerializedBaseGestures(gesture, uniqBaseGestures, new Set());

  if (uniqBaseGestures.length === 0) {
    for (const oldBaseGesture of oldBaseGesturesById.values()) {
      if (oldBaseGesture.id != null) {
        removeGestureDetector(dom, oldBaseGesture.id);
      }
    }
    if (oldBaseGesturesById.size > 0) {
      clearLegacyGestureState(dom);
    }
    return;
  }

  __SetAttribute(dom, "has-react-gesture", true);
  __SetAttribute(dom, "flatten", false);

  for (const oldBaseGesture of oldBaseGesturesById.values()) {
    if (oldBaseGesture.id != null) {
      removeGestureDetector(dom, oldBaseGesture.id);
    }
  }

  for (const baseGesture of uniqBaseGestures) {
    const oldBaseGesture = consumeOldBaseGesture(baseGesture, uniqOldBaseGestures, oldBaseGesturesById);
    const { config, relationMap } = getGestureInfo(baseGesture, oldBaseGesture, dom);
    if (baseGesture.id != null && baseGesture.type != null) {
      __SetGestureDetector(dom, baseGesture.id, baseGesture.type, config, relationMap);
    }
  }
}

/** SET_GESTURE: bind or update gesture detectors on a native element. */
export function applySetGesture(id: number, gesture: GestureKind | null | undefined): void {
  const el = elements.get(id);
  if (!el) {
    return;
  }

  const oldGesture = elementGestures.get(id);
  processGesture(el, gesture ?? undefined, oldGesture);

  if (gesture && isSerializedGesture(gesture)) {
    elementGestures.set(id, gesture);
  } else {
    elementGestures.delete(id);
  }
}

/** Remove gesture state for an element — called on OP.REMOVE. */
export function removeElementGesture(id: number): void {
  const el = elements.get(id);
  const oldGesture = elementGestures.get(id);
  if (el && oldGesture) {
    processGesture(el, undefined, oldGesture);
  }
  elementGestures.delete(id);
}

/** Reset gesture state — for testing only. */
export function resetGestureState(): void {
  elementGestures.clear();
}
