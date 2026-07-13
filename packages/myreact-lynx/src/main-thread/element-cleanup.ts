import { elements } from "./element-registry.js";
import { removeElementGesture } from "./gesture-apply.js";
import { removeListElement } from "./list-apply.js";
import { removeElementWorkletEvents } from "./worklet-apply.js";

/** Remove all Main Thread tracking state for a Background element id. */
export function cleanupElementState(id: number): void {
  removeElementWorkletEvents(id);
  removeElementGesture(id);
  removeListElement(id);
  elements.delete(id);
}
