import { Component, createElement, useState, useCallback } from "@my-react/react";

import { proxyRefs, ReactiveEffect } from "../api";

import type { UnwrapRef } from "../api";
import type { MyReactElementNode } from "@my-react/react";

type LifeCycle = {
  onBeforeMount: Array<() => void>;

  onMounted: Array<() => void>;

  onBeforeUpdate: Array<() => void>;

  onUpdated: Array<() => void>;

  onBeforeUnmount: Array<() => void>;

  onUnmounted: Array<() => void>;

  hasHookInstall: boolean;
};

export let globalInstance: LifeCycle | null = null;

export function createReactive<P extends Record<string, unknown>, S extends Record<string, unknown>>(props?: {
  setup: () => S;
  render?: (props: UnwrapRef<S> & P) => MyReactElementNode;
}) {
  const instance: LifeCycle = {
    onBeforeMount: [],
    onBeforeUpdate: [],
    onBeforeUnmount: [],
    onMounted: [],
    onUpdated: [],
    onUnmounted: [],
    hasHookInstall: false,
  };
  const setup = typeof props === "function" ? props : props.setup;

  const render = typeof props === "function" ? null : props.render;

  globalInstance = instance;

  const state = proxyRefs(setup());

  globalInstance = null;

  let canUpdate = true;

  class ForBeforeUnmount extends Component<{ children: MyReactElementNode }> {
    componentWillUnmount(): void {
      instance.onBeforeUnmount.forEach((f) => f());
    }

    render() {
      return this.props.children;
    }
  }

  class ForBeforeMount extends Component<{ children: MyReactElementNode }> {
    componentDidMount(): void {
      instance.onBeforeMount.forEach((f) => f());
    }

    render() {
      return this.props.children;
    }
  }

  class Render extends Component<{ ["__trigger__"]: () => void; children: (props: UnwrapRef<S> & P) => MyReactElementNode } & P> {
    componentDidMount(): void {
      instance.onMounted.forEach((f) => f());
    }

    componentDidUpdate(): void {
      instance.onUpdated.forEach((f) => f());
    }

    componentWillUnmount(): void {
      instance.onUnmounted.forEach((f) => f());
    }

    shouldComponentUpdate(): boolean {
      canUpdate = false;
      instance.onBeforeUpdate.forEach((f) => f());
      canUpdate = true;
      return true;
    }

    effect = new ReactiveEffect(() => {
      const { children, __trigger__, ...last } = this.props;
      const targetRender = (render || children) as (props: UnwrapRef<S> & P) => MyReactElementNode;
      const element = targetRender?.({ ...last, ...state } as UnwrapRef<S> & P) || null;
      return element;
    }, this.props.__trigger__);

    render() {
      return createElement(ForBeforeMount, { children: this.effect.run() });
    }
  }

  const MyReactReactiveComponent = (props: P) => {
    if (__DEV__) {
      for (const key in props) {
        if (key in state) {
          console.warn(`duplicate key ${key} in Component props and reactive state, please fix this usage`);
        }
      }
    }

    const [, setState] = useState(() => 0);

    const updateCallback = useCallback(() => {
      if (canUpdate) {
        setState((i) => i + 1);
      }
    }, []);

    return createElement(ForBeforeUnmount, { children: createElement(Render, { ...props, ["__trigger__"]: updateCallback }) });
  };

  return MyReactReactiveComponent;
}
