import type { RenderFiber } from "../renderFiber";

/**
 * @public
 */
export class MyReactInternalInstance {
  get isMyReactInstance() {
    return true;
  }
  _reactInternals: RenderFiber;
}
