import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { UpdateQueueType } from "@my-react/react-shared";

import type { UpdateQueueDev } from "../processState";
import type { RenderHook, Action, HookUpdateQueue } from "@my-react/react";
import type { ListTree, HOOK_TYPE } from "@my-react/react-shared";

const { MyReactInternalInstance, currentRenderPlatform } = __my_react_internal__;

const { enableSyncFlush } = __my_react_shared__;

const defaultPayLoad = (a: any) => a;

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

  _update(params: Omit<HookUpdateQueue, "type" | "trigger"> = {}) {
    const updater: HookUpdateQueue = {
      type: UpdateQueueType.hook,
      trigger: this,
      payLoad: defaultPayLoad,
      ...params,
    };

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform?.dispatchState(updater);
  }

  _dispatch = (action: Action) => {
    this._update({ payLoad: action, isForce: false, isSync: enableSyncFlush.current });
  };
}

export interface MyReactHookNodeDev extends MyReactHookNode {
  _debugType: string;
  _debugIndex: number;
  _debugUpdateQueue: ListTree<UpdateQueueDev>;
}
