import { ReactiveFlags, ReactiveEffect } from "@my-react/react-reactive";

import { MyReactInternalInstance } from "../internal";

import type { createContext, MaybeArrayMyReactElementNode } from "../element";

export class MyReactReactiveInstance<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> extends MyReactInternalInstance {
  [ReactiveFlags.Skip_key]: true;

  contextType: null | ReturnType<typeof createContext>;

  setup: (props: P, context?: C) => S;

  state: S;

  props: P;

  context: C;

  effect?: ReactiveEffect;

  render: (s: S, p: P, c?: C) => MaybeArrayMyReactElementNode;

  constructor(props: P, context?: C) {
    super();
    this.props = props;
    this.context = context;

    this.createSetupState();

    this.createScopeRender();
  }

  get isMyReactReactive() {
    return true;
  }

  createSetupState() {
    const { setup, props, context } = this;
    this.state = setup(props, context);
  }

  createScopeRender() {
    const { props } = this;

    const { children } = props;

    const typedChildren = children as (s: S, p: P, c?: C) => MaybeArrayMyReactElementNode;

    this.render = this.render || typedChildren;
  }

  createEffectUpdate(action: () => void, scheduler: () => void) {
    this.effect = new ReactiveEffect(action, scheduler);
  }
}
