import type { MyReactInternalInstance } from "../internal";
import type { RenderHook } from "../renderHook";
import type { UpdateQueue } from "../renderQueue";
import type { ListTree, PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

interface DefaultRenderFiber {
  state: STATE_TYPE;

  patch: PATCH_TYPE;

  hookList: ListTree<RenderHook> | null;

  dependence: Set<MyReactInternalInstance> | null;

  instance: MyReactInternalInstance | null;

  updateQueue: ListTree<UpdateQueue> | null;

  child: DefaultRenderFiber | null;

  parent: DefaultRenderFiber | null;

  sibling: DefaultRenderFiber | null;

  _addDependence(instance: MyReactInternalInstance): void;

  _removeDependence(instance: MyReactInternalInstance): void;

  _update(state?: STATE_TYPE): void;

  _error(error: Error): void;

  _prepare(): void;

  _unmount(): void;
}

export type RenderFiber<T = Record<string, any>> = DefaultRenderFiber & T;
