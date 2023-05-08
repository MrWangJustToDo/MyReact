import { __my_react_internal__ } from "@my-react/react";

import type { RenderHook, Action, HookUpdateQueue } from "@my-react/react";
import type { HOOK_TYPE } from "@my-react/react-shared";

const { MyReactInternalInstance, currentRenderPlatform } = __my_react_internal__;

export class MyReactHookNode extends MyReactInternalInstance implements RenderHook {
  type: HOOK_TYPE;

  value: any;

  reducer: RenderHook["reducer"];

  effect = false;

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
    this.effect = false;
    this.cancel && this.cancel();
  }

  _dispatch = (action: Action) => {
    const updater: HookUpdateQueue = {
      type: "hook",
      trigger: this,
      payLoad: action,
    };

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform?.dispatchState(updater);
  };
}
