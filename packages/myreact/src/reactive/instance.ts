import { ReactiveFlags, ReactiveEffect, proxyRefs } from "@my-react/react-reactive";

import { MyReactInternalInstance } from "../internal";

import type { createContext, MyReactElementNode, Props } from "../element";

export class MyReactReactiveInstance<
  P extends Props = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> extends MyReactInternalInstance {
  [ReactiveFlags.Skip_key]: true;

  contextType: null | ReturnType<typeof createContext>;

  setup: (props: P, context?: C) => S;

  state: S;

  props: P;

  context: C;

  effect?: ReactiveEffect<MyReactElementNode>;

  render: (s: S, p: P, c?: C) => MyReactElementNode;

  staticRender: (s: S, p: P, c?: C) => MyReactElementNode;

  beforeMountHooks: Array<() => void> = [];

  mountedHooks: Array<() => void> = [];

  beforeUpdateHooks: Array<() => void> = [];

  updatedHooks: Array<() => void> = [];

  beforeUnmountHooks: Array<() => void> = [];

  unmountedHooks: Array<() => void> = [];

  constructor(props: P, context?: C) {
    super();
    this.props = props;
    this.context = context;
  }

  get isMyReactReactive() {
    return true;
  }

  _createSetupState(setup?: (props: P, context?: C) => S, render?: (s: S, p: P, c?: C) => MyReactElementNode) {
    const { props, context } = this;
    this.setup = setup;
    this.staticRender = render;
    const data = setup?.(props, context) || {};
    this.state = proxyRefs(data) as S;
  }

  _createEffectUpdate(scheduler: () => void) {
    this.effect = new ReactiveEffect(() => {
      const render = this.staticRender ? this.staticRender : typeof this.props.children === "function" ? this.props.children : () => null;
      return render(this.state, this.props, this.context);
    }, scheduler);
  }

  _unmount(): void {
    super._unmount();
    this.effect.stop();
    this.unmountedHooks.forEach((f) => f?.());
  }
}
