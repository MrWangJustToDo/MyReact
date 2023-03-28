import { isNormalEquals } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";
import { currentRenderPlatform } from "../share";

import type { MyReactElementNode, createContext } from "../element";
import type { RenderFiber } from "../renderFiber";
import type { ComponentUpdateQueue } from "../renderQueue";

type ErrorInfo = {
  componentStack: string;
};

export class MyReactComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> extends MyReactInternalInstance {
  static contextType: null | ReturnType<typeof createContext>;

  static getDerivedStateFromProps?(props: any, state: any): any;

  static getDerivedStateFromError?(error: Error): any;

  state: S | null = null;

  props: P | null = null;

  context: C | null = null;

  getSnapshotBeforeUpdate?(this: MyReactComponent, prevProps: P, prevState: S): void;

  shouldComponentUpdate?(this: MyReactComponent, nextProps: P, nextState: S, nextContext: C): boolean;

  componentDidMount?(this: MyReactComponent): void;

  componentDidUpdate?(this: MyReactComponent, prevProps: P, prevState: S, snapshot: any): void;

  componentDidCatch?(this: MyReactComponent, error: Error, errorInfo: ErrorInfo): void;

  componentWillUnmount?(): void;

  UNSAFE_componentWillMount?(): void;

  UNSAFE_componentWillReceiveProps?(nextProps: P): void;

  UNSAFE_componentWillUpdate?(nextProps: P, nextState: S): void;

  // for queue update
  _result: { newState: unknown; isForce: boolean; callback: Array<() => void> } = {
    newState: null,
    isForce: false,
    callback: [],
  };

  // error catch component
  _error: { error: Error | null; trigger: RenderFiber | null; hasError: boolean } = {
    error: null,
    trigger: null,
    hasError: false,
  };

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

    const ownerFiber = this._ownerFiber;

    ownerFiber.updateQueue.push(updater);

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.triggerClassComponent(ownerFiber);
  };

  forceUpdate = () => {
    const updater: ComponentUpdateQueue = {
      type: "component",
      isForce: true,
      trigger: this,
    };

    const ownerFiber = this._ownerFiber;

    ownerFiber.updateQueue.push(updater);

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.triggerClassComponent(ownerFiber);
  };

  render(): MyReactElementNode {
    return null;
  }

  _unmount() {
    super._unmount();
    this.componentWillUnmount?.();
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
