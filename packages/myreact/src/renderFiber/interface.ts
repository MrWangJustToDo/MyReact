import type { MyReactInternalInstance } from "../internal";
import type { RenderHook } from "../renderHook";
import type { UpdateQueue } from "../renderQueue";
import type { ListTree, MODE_TYPE, PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

/**
 * @public
 */
export interface DefaultRenderFiber {
  state: STATE_TYPE;

  patch: PATCH_TYPE;

  mode: MODE_TYPE;

  hookList: ListTree<RenderHook> | null;

  dependence: Set<MyReactInternalInstance> | null;

  instance: MyReactInternalInstance | null;

  updateQueue: ListTree<UpdateQueue> | null;

  child: DefaultRenderFiber | null;

  parent: DefaultRenderFiber | null;

  sibling: DefaultRenderFiber | null;

  _addDependence(instance: MyReactInternalInstance): void;

  _delDependence(instance: MyReactInternalInstance): void;

  _update(state?: STATE_TYPE): void;
}

/**
 * @public
 */
export type RenderFiber<T = Record<string, any>> = DefaultRenderFiber & T;
