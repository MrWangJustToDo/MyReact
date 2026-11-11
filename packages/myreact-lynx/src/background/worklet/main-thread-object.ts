/**
 * Typed MainThreadObject handles (ReactLynx 0.127+).
 *
 * A handle is an opaque, serializable reference. The background thread stores
 * the initialization payload; the worklet runtime realizes the target object
 * with the capture-free `create` Main Thread Function registered by
 * `defineMainThreadObjectType`.
 *
 * The wire format (`_wvid`, `_initValue`, `_type`) matches the upstream
 * `@lynx-js/react` runtime so `updateWorkletRefInitValueChanges` and worklet
 * captures resolve handles created here.
 */

import { registerMainThreadObjectType } from "@lynx-js/react/worklet-runtime/bindings";
import { useMemo } from "@my-react/react";

import { allocateWorkletRefId } from "./worklet-ref-id.js";
import { addWorkletRefInitValue } from "./worklet-ref-pool.js";

/** Describes how a serializable payload becomes a main-thread object. @public */
export interface MainThreadObjectTypeDefinition<I, O extends object> {
  /** A globally unique and stable type key. */
  readonly type: string;
  /** Capture-free Main Thread Function that creates the target object. */
  readonly create: (initialValue: I) => O;
}

/** Immutable type token returned by `defineMainThreadObjectType`. @public */
export interface MainThreadObjectType<I, O extends object> {
  readonly type: string;
  /** Narrow a value to a handle of this exact type without realizing it. */
  readonly downcast: (value: unknown) => MainThreadObjectHandle<I, O> | undefined;
}

/** Weak registry used by `downcast` and `captureMainThreadObject`. @internal */
const mainThreadObjectHandleTypes = new WeakMap<object, string>();

const mainThreadObjectDefinitions = new WeakMap<object, { type: string; create: unknown }>();

function isMainThreadObjectHandle(value: unknown): value is object {
  return typeof value === "object" && value !== null && mainThreadObjectHandleTypes.has(value);
}

/**
 * Return a handle unchanged when it is a MainThreadObject; ordinary captured
 * objects return `undefined` so the transform's fallback expression is used.
 *
 * @public
 */
export function captureMainThreadObject(source: unknown): object | undefined {
  return isMainThreadObjectHandle(source) ? source : undefined;
}

/**
 * An opaque source-runtime handle for an object realized on the main thread.
 *
 * @public
 */
export abstract class MainThreadObjectHandle<I, O extends object> {
  /** Type-only phantom member so the target type remains in the public API. @internal */
  declare readonly __targetType?: O;

  /** @internal */
  readonly _wvid: number;

  /** @internal */
  protected readonly _initValue: I;

  /** @internal */
  protected readonly _type: string;

  /** Keeps the native destruction observer alive for the handle lifetime. */
  private _releaseObserver: unknown;

  protected constructor(initialValue: I, type: string, create?: unknown) {
    this._initValue = initialValue;
    this._type = type;
    this._wvid = allocateWorkletRefId();
    mainThreadObjectHandleTypes.set(this, type);

    if (typeof __JS__ !== "undefined" && __JS__) {
      addWorkletRefInitValue(this._wvid, initialValue, type, create);

      if (typeof lynx !== "undefined") {
        const id = this._wvid;
        this._releaseObserver = lynx?.getNativeApp?.()?.createJSObjectDestructionObserver?.(() => {
          lynx?.getCoreContext?.()?.dispatchEvent({
            type: "Lynx.Worklet.releaseWorkletRef",
            data: { id },
          });
        });
      }
    }
  }

  /** The payload used to create the realized object. @public */
  get creationPayload(): Readonly<I> {
    return this._initValue;
  }

  /** Serialize the handle into the BG→MT worklet-ref init patch. @internal */
  toJSON(): { _wvid: number; _initValue: I; _type: string } {
    return {
      _wvid: this._wvid,
      _initValue: this._initValue,
      _type: this._type,
    };
  }
}

class MainThreadObjectHandleImpl<I, O extends object> extends MainThreadObjectHandle<I, O> {
  constructor(initialValue: I, type: string, create?: unknown) {
    super(initialValue, type, create);
  }
}

function isMainThreadLifecycleFunction(value: unknown): value is ((initialValue: unknown) => object) | { _wkltId: string } {
  return typeof value === "function" || (typeof value === "object" && value !== null && typeof (value as { _wkltId?: unknown })._wkltId === "string");
}

/**
 * Define a main-thread object type for a library-provided hook.
 *
 * @public
 */
export function defineMainThreadObjectType<I, O extends object>(definition: MainThreadObjectTypeDefinition<I, O>): MainThreadObjectType<I, O> {
  const { type, create } = definition;

  if (typeof type !== "string" || type.length === 0) {
    throw new Error("[@my-react/react-lynx] MainThreadObject type must be a non-empty string.");
  }
  if (type === "main-thread") {
    throw new Error('[@my-react/react-lynx] MainThreadObject type "main-thread" is reserved for MainThreadRef.');
  }
  if (!isMainThreadLifecycleFunction(create)) {
    throw new Error(`[@my-react/react-lynx] MainThreadObject type "${type}" must provide a create Main Thread Function.`);
  }

  const validatedDefinition = Object.freeze({ type, create });
  const objectType: MainThreadObjectType<I, O> = Object.freeze({
    type,
    downcast(value: unknown) {
      return typeof value === "object" && value !== null && mainThreadObjectHandleTypes.get(value) === type
        ? (value as MainThreadObjectHandle<I, O>)
        : undefined;
    },
  });

  mainThreadObjectDefinitions.set(objectType, validatedDefinition);

  // The main-thread runtime owns the type registry. The background thread must
  // never call into `lynxWorkletImpl` while defining a type.
  if (typeof __JS__ !== "undefined" && !__JS__) {
    registerMainThreadObjectType(type, create as never);
  }

  return objectType;
}

/**
 * Create a stable handle that resolves to an object of `objectType` inside
 * main-thread functions.
 *
 * @public
 */
export function useMainThreadObject<I, O extends object>(objectType: MainThreadObjectType<I, O>, initialValue: I): O {
  return useMemo(() => {
    const definition = mainThreadObjectDefinitions.get(objectType);
    if (definition === undefined) {
      throw new Error(`[@my-react/react-lynx] Invalid MainThreadObject type token for "${objectType.type}". Create it with defineMainThreadObjectType().`);
    }

    // Re-register at first hook use on the main thread. This mirrors upstream:
    // module-level definitions may run before the page's worklet registry is
    // initialized, and reloads may reset that registry.
    if (typeof __JS__ !== "undefined" && !__JS__) {
      registerMainThreadObjectType(definition.type, definition.create as never);
    }

    return new MainThreadObjectHandleImpl<I, O>(initialValue, objectType.type, definition.create) as unknown as O;
  }, []);
}
