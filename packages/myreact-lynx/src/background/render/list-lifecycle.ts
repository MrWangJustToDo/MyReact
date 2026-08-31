/**
 * List-item lifecycle callbacks — MT→BG structured event transport.
 *
 * The native <list> calls `enqueueComponent` (cell reeled out of the viewport)
 * and `componentAtIndex` (cell about to be mounted) on the Main Thread. Our
 * Main Thread list executor forwards these to the Background Thread via a
 * structured event of the form:
 *
 *   { bgId, propName, data }   // propName ∈ { onRecycleComponent, onComponentAtIndex }
 *
 * This module owns the per-element handler registry and the listener that
 * receives those MT dispatches, then invokes the user-provided React callback
 * on the Background Thread. It mirrors the handler-key pattern ReactLynx uses
 * (`${id}:__extraProps:onRecycleComponent`) without requiring a full snapshot
 * model — MyReact keys by the Background element id directly.
 */

const LIST_LIFECYCLE_CHANNEL = "Lynx.React.ListLifecycle";

interface ListLifecycleState {
  /** bgId → propName → handler */
  handlers: Map<number, Map<string, (data: unknown) => void>>;
}

function getState(): ListLifecycleState {
  let state = globalThis.__REACT_LYNX_LIST_LIFECYCLE__;
  if (!state) {
    state = { handlers: new Map<number, Map<string, (data: unknown) => void>>() };
    Object.defineProperty(globalThis, "__REACT_LYNX_LIST_LIFECYCLE__", {
      value: state,
      configurable: true,
      enumerable: false,
      writable: true,
    });
  }
  return state;
}

let listenerAttached = false;

/**
 * Lazily attach the MT→BG listener. Called on first registration so we never
 * register a listener in environments without a list.
 */
function ensureListener(): void {
  if (listenerAttached) return;
  listenerAttached = true;

  const core = typeof lynx !== "undefined" ? lynx.getCoreContext?.() : undefined;
  if (!core) return;

  core.addEventListener(LIST_LIFECYCLE_CHANNEL, (event: { data?: unknown }) => {
    try {
      const payload = JSON.parse(event.data as string) as { bgId: number; propName: string; data?: unknown };
      const propHandlers = getState().handlers.get(payload.bgId);
      propHandlers?.get(payload.propName)?.(payload.data);
    } catch (err) {
      if (__DEV__) {
        console.warn("[@my-react/react-lynx] Failed to dispatch list lifecycle event", err);
      }
    }
  });
}

/**
 * Register a list-item lifecycle handler for a Background element.
 * Called from the reconciler when `onRecycleComponent` / `onComponentAtIndex`
 * props are present on a <list-item>.
 *
 * @public
 */
export function registerListLifecycle(bgId: number, propName: string, handler: (data: unknown) => void): void {
  ensureListener();
  const state = getState();
  let propHandlers = state.handlers.get(bgId);
  if (!propHandlers) {
    propHandlers = new Map<string, (data: unknown) => void>();
    state.handlers.set(bgId, propHandlers);
  }
  propHandlers.set(propName, handler);
}

/**
 * Remove a single list-item lifecycle handler, or all of them for an element
 * when `propName` is omitted. Called from the reconciler on prop removal and
 * from element teardown.
 *
 * @public
 */
export function unregisterListLifecycle(bgId: number, propName?: string): void {
  const state = getState();
  const propHandlers = state.handlers.get(bgId);
  if (!propHandlers) return;
  if (propName === undefined) {
    state.handlers.delete(bgId);
    return;
  }
  propHandlers.delete(propName);
  if (propHandlers.size === 0) {
    state.handlers.delete(bgId);
  }
}

/** Reset all state – for testing only. */
export function resetListLifecycleState(): void {
  getState().handlers.clear();
  listenerAttached = false;
}
