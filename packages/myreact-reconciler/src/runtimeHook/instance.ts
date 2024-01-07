import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { MODE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import type { UpdateQueueDev } from "../processState";
import type { RenderHook, Action, HookUpdateQueue } from "@my-react/react";
import type { ListTree, HOOK_TYPE } from "@my-react/react-shared";

const { MyReactInternalInstance, currentRenderPlatform } = __my_react_internal__;

const { enableSyncFlush } = __my_react_shared__;

export class MyReactHookNode extends MyReactInternalInstance implements RenderHook {
  type: HOOK_TYPE;

  value: any;

  reducer: RenderHook["reducer"];

  hasEffect = false;

  cancel?: () => void;

  result: any;

  deps: RenderHook["deps"];

  constructor(type: HOOK_TYPE, value: RenderHook["value"], reducer: RenderHook["reducer"], deps: RenderHook["deps"]) {
    super();
    this.type = type;
    this.deps = deps;
    this.value = value;
    this.reducer = reducer;
  }

  get isMyReactHook() {
    return true;
  }

  _unmount() {
    super._unmount();
    this.hasEffect = false;
    this.cancel && this.cancel();
  }

  _dispatch = (action: Action) => {
    const updater: HookUpdateQueue = {
      type: UpdateQueueType.hook,
      trigger: this,
      payLoad: action,
      isForce: false,
      isSync: enableSyncFlush.current,
      isInitial: this._ownerFiber?.mode === MODE_TYPE.__initial__,
    };

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform?.dispatchState(updater);
  };

  _internalDispatch = (params: { isForce?: boolean; callback?: () => void }) => {
    const updater: HookUpdateQueue = {
      type: UpdateQueueType.hook,
      trigger: this,
      payLoad: a => a,
      isSync: enableSyncFlush.current,
      isForce: params.isForce,
      callback: params.callback,
      isInitial: this._ownerFiber?.mode === MODE_TYPE.__initial__,
    };

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform?.dispatchState(updater);
  };
}

export interface MyReactHookNodeDev extends MyReactHookNode {
  _debugType: string;
  _debugIndex: number;
  _debugUpdateQueue: ListTree<UpdateQueueDev>;
}
