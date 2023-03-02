import { isNormalEquals } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";

import type { MyReactElementNode, createContext } from "../element";
import type { ComponentUpdateQueue } from "../fiber";

type ErrorInfo = {
  componentStack: string;
};

export interface MyReactComponentType<P, S, C> {
  render(this: MyReactComponent): MyReactElementNode;
  componentDidMount?(this: MyReactComponent): void;
  getSnapshotBeforeUpdate?(this: MyReactComponent, prevProps: P, prevState: S): void;
  shouldComponentUpdate?(this: MyReactComponent, nextProps: P, nextState: S, nextContext: C): boolean;
  componentDidUpdate?(this: MyReactComponent, prevProps: P, prevState: S, snapshot: any): void;
  componentDidCatch?(this: MyReactComponent, error: Error, errorInfo: ErrorInfo): void;
  componentWillUnmount?(): void;
  UNSAFE_componentWillMount?(): void;
  UNSAFE_componentWillReceiveProps?(nextProps: P): void;
  UNSAFE_componentWillUpdate?(nextProps: P, nextState: S): void;
}

export const DEFAULT_RESULT = {
  newState: null,
  isForce: false,
  callback: [],
};

export type MyReactComponentStaticType<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any> = {
  contextType: null | ReturnType<typeof createContext>;
  getDerivedStateFromProps(props: P, state: S): S;
  getDerivedStateFromError(error: Error): S;
};

export type MixinMyReactComponentType<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> = MyReactComponent<P, S, C> & MyReactComponentType<P, S, C>;

export class MyReactComponent<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>
  extends MyReactInternalInstance
  implements MyReactComponentType<P, S, C>
{
  state: S | null = null;
  props: P | null = null;
  context: C | null = null;

  // for queue update
  _result: { newState: unknown; isForce: boolean; callback: Array<() => void> } = DEFAULT_RESULT;

  constructor(props?: P, context?: C | null) {
    super();
    this.props = props || null;
    this.context = context || null;
  }

  get isReactComponent() {
    return true;
  }

  get isMyReactComponent() {
    return true;
  }

  setState = (payLoad: ComponentUpdateQueue["payLoad"], callback: ComponentUpdateQueue["callback"]) => {
    const updater: ComponentUpdateQueue = {
      type: "component",
      payLoad,
      callback,
      trigger: this,
    };

    this._ownerFiber?.updateQueue.push(updater);

    Promise.resolve().then(() => this._ownerFiber?.update());
  };

  forceUpdate = () => {
    const updater: ComponentUpdateQueue = {
      type: "component",
      isForce: true,
      trigger: this,
    };

    this._ownerFiber?.updateQueue.push(updater);

    Promise.resolve().then(() => this._ownerFiber?.update());
  };

  render() {
    return void 0;
  }

  unmount() {
    super.unmount();
    const instance = this as MixinMyReactComponentType;
    instance.componentWillUnmount?.();
  }
}

export class MyReactPureComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> extends MyReactComponent<P, S, C> {
  // for original react render, there are not a context judge for `shouldComponentUpdate` function
  shouldComponentUpdate(nextProps: P, nextState: S, nextContext: C) {
    return !isNormalEquals(nextProps, this.props) || !isNormalEquals(nextState, this.state) || !isNormalEquals(nextContext, this.context);
  }
}
