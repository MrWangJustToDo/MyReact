import { Component, createElement, useState, useCallback, useMemo } from "@my-react/react";

import { proxyRefs, ReactiveEffect } from "../api";

import type { UnwrapRef } from "../api";
import type { MyReactElementNode, LikeJSX , MyReactElement } from "@my-react/react";

type LifeCycle = {
  onBeforeMount: Array<() => void>;

  onMounted: Array<() => void>;

  onBeforeUpdate: Array<() => void>;

  onUpdated: Array<() => void>;

  onBeforeUnmount: Array<() => void>;

  onUnmounted: Array<() => void>;

  hasHookInstalled: boolean;

  canUpdateComponent: boolean;
};

export let globalInstance: LifeCycle | null = null;

export function createReactive<P extends Record<string, unknown>, S extends Record<string, unknown>>(props?: {
  setup: () => S;
  render?: (props: UnwrapRef<S> & P) => LikeJSX;
}) {
  const setup = typeof props === "function" ? props : props.setup;

  const render = typeof props === "function" ? null : props.render;

  class ForBeforeUnmount extends Component<{ ["$$__instance__$$"]: LifeCycle; children: MyReactElementNode }> {
    componentWillUnmount(): void {
      this.props.$$__instance__$$.onBeforeUnmount.forEach((f) => f());
    }

    render() {
      return this.props.children;
    }
  }

  class ForBeforeMount extends Component<{ ["$$__instance__$$"]: LifeCycle; children: MyReactElementNode }> {
    componentDidMount(): void {
      this.props.$$__instance__$$.onBeforeMount.forEach((f) => f());
    }

    render() {
      return this.props.children;
    }
  }

  class RenderWithLifeCycle extends Component<
    {
      ["$$__trigger__$$"]: () => void;
      ["$$__instance__$$"]: LifeCycle;
      ["$$__reactiveState__$$"]: UnwrapRef<S>;
      children: (props: UnwrapRef<S> & P) => MyReactElementNode;
    } & P
  > {
    componentDidMount(): void {
      this.props.$$__instance__$$.onMounted.forEach((f) => f());
    }

    componentDidUpdate(): void {
      this.props.$$__instance__$$.onUpdated.forEach((f) => f());
    }

    componentWillUnmount(): void {
      this.props.$$__instance__$$.onUnmounted.forEach((f) => f());
      this.effect.stop();
    }

    shouldComponentUpdate(): boolean {
      this.props.$$__instance__$$.canUpdateComponent = false;
      this.props.$$__instance__$$.onBeforeUpdate.forEach((f) => f());
      this.props.$$__instance__$$.canUpdateComponent = true;
      return true;
    }

    effect = new ReactiveEffect(() => {
      const { children, $$__trigger__$$, $$__reactiveState__$$, $$__instance__$$, ...last } = this.props;
      const targetRender = (render || children) as (props: UnwrapRef<S> & P) => MyReactElementNode;
      const element = targetRender?.({ ...last, ...$$__reactiveState__$$ } as UnwrapRef<S> & P) || null;
      return element;
    }, this.props.$$__trigger__$$);

    render() {
      return createElement(ForBeforeMount, { ["$$__instance__$$"]: this.props.$$__instance__$$, children: this.effect.run() });
    }
  }

  class Render extends Component<
    {
      ["$$__trigger__$$"]: () => void;
      ["$$__reactiveState__$$"]: UnwrapRef<S>;
      children: (props: UnwrapRef<S> & P) => MyReactElementNode;
    } & P
  > {
    componentWillUnmount(): void {
      this.effect.stop();
    }

    effect = new ReactiveEffect(() => {
      const { children, $$__trigger__$$, $$__reactiveState__$$, $$__instance__$$, ...last } = this.props;
      const targetRender = (render || children) as (props: UnwrapRef<S> & P) => MyReactElementNode;
      const element = targetRender?.({ ...last, ...$$__reactiveState__$$ } as UnwrapRef<S> & P) || null;
      return element;
    }, this.props.$$__trigger__$$);

    render() {
      return this.effect.run();
    }
  }

  const MyReactReactiveComponent = (props: P & {children: (props: UnwrapRef<S> & P) => MyReactElement}) => {
    const [instance] = useState(() => ({
      onBeforeMount: [],
      onBeforeUpdate: [],
      onBeforeUnmount: [],
      onMounted: [],
      onUpdated: [],
      onUnmounted: [],
      hasHookInstalled: false,
      canUpdateComponent: true,
    }));

    const state = useMemo(() => {
      globalInstance = instance;

      const state = proxyRefs(setup());

      globalInstance = null;

      return state;
    }, []);

    if (__DEV__) {
      for (const key in props) {
        if (key in state) {
          console.warn(`duplicate key ${key} in Component props and reactive state, please fix this usage`);
        }
      }
      if (props["children"] && typeof props["children"] !== "function") {
        throw new Error("the component which return from createReactive() expect a function children");
      }
    }

    const [, setState] = useState(() => 0);

    const updateCallback = useCallback(() => {
      if (instance.canUpdateComponent) {
        setState((i) => i + 1);
      }
    }, []);

    if (instance.hasHookInstalled) {
      return createElement(ForBeforeUnmount, {
        ["$$__instance__$$"]: instance,
        children: createElement(RenderWithLifeCycle, {
          ...props,
          ["$$__trigger__$$"]: updateCallback,
          ["$$__reactiveState__$$"]: state,
          ["$$__instance__$$"]: instance,
        }),
      });
    } else {
      return createElement(Render, { ...props, ["$$__trigger__$$"]: updateCallback, ["$$__reactiveState__$$"]: state });
    }
  };

  return MyReactReactiveComponent;
}
