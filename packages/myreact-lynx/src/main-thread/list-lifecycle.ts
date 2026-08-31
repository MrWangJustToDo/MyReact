/**
 * MT-side dispatch of list-item lifecycle events to the Background Thread.
 *
 * The native <list> calls `enqueueComponent` / `componentAtIndex` on the Main
 * Thread. This module forwards those as a structured event that the Background
 * Thread's `background/render/list-lifecycle.ts` listener receives and routes
 * to the user's `onRecycleComponent` / `onComponentAtIndex` React callbacks.
 *
 * Guaranteed no-op (no side effects) when there is no MT runtime, so list code
 * can call it unconditionally.
 */

const LIST_LIFECYCLE_CHANNEL = "Lynx.React.ListLifecycle";

/**
 * Dispatch a list-item lifecycle event to the Background Thread.
 *
 * @param bgId   Background element id of the <list-item>.
 * @param propName one of `onRecycleComponent` | `onComponentAtIndex`.
 * @param data   optional payload forwarded to the React callback.
 * @public
 */
export function dispatchListLifecycle(bgId: number, propName: string, data?: unknown): void {
  if (typeof lynx === "undefined" || !lynx.getJSContext) return;
  try {
    lynx.getJSContext().dispatchEvent({ type: LIST_LIFECYCLE_CHANNEL, data: JSON.stringify({ bgId, propName, data }) });
  } catch (err) {
    if (__DEV__) {
      console.warn("[@my-react/react-lynx] Failed to dispatch list lifecycle event", err);
    }
  }
}
