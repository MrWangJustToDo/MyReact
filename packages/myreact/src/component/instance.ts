import { UpdateQueueType, isNormalEquals } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";
import { currentRenderPlatform, enableSyncFlush } from "../share";

import type { MyReactElementNode, createContext } from "../element";
import type { ComponentUpdateQueue } from "../renderQueue";

/**
 * @public
 */
export type ErrorInfo = {
  componentStack: string;
};

/**
 * @public
 */
export class MyReactComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any,
> extends MyReactInternalInstance {
  static contextType?: null | ReturnType<typeof createContext>;

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

  /**
   * @deprecated
   */
  UNSAFE_componentWillMount?(): void;
  /**
   * @deprecated
   */
  componentWillMount?(): void;
  /**
   * @deprecated
   */
  UNSAFE_componentWillReceiveProps?(nextProps: P): void;
  /**
   * @deprecated
   */
  componentWillReceiveProps?(nextProps: P): void;
  /**
   * @deprecated
   */
  UNSAFE_componentWillUpdate?(nextProps: P, nextState: S): void;
  /**
   * @deprecated
   */
  componentWillUpdate?(nextProps: P, nextState: S): void;

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

  setState = (payLoad: ComponentUpdateQueue<S, P>["payLoad"], callback?: ComponentUpdateQueue["callback"]) => {
    const updater: ComponentUpdateQueue = {
      type: UpdateQueueType.component,
      payLoad,
      callback,
      trigger: this,
      isForce: false,
      isSync: enableSyncFlush.current,
      isInitial: this._ownerFiber?.mode === 0,
    };

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform?.dispatchState(updater);
  };

  forceUpdate = () => {
    const updater: ComponentUpdateQueue = {
      type: UpdateQueueType.component,
      trigger: this,
      isForce: true,
      isSync: enableSyncFlush.current,
      isInitial: this._ownerFiber?.mode === 0,
    };

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform?.dispatchState(updater);
  };

  render(): MyReactElementNode {
    return null;
  }

  _unmount() {
    super._unmount();
    this.componentWillUnmount?.();
  }
}

/**
 * @internal
 */
export class MyReactPureComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any,
> extends MyReactComponent<P, S, C> {
  // for original react render, there are not a context judge for `shouldComponentUpdate` function
  shouldComponentUpdate(nextProps: P, nextState: S, nextContext: C) {
    return !isNormalEquals(nextProps, this.props) || !isNormalEquals(nextState, this.state) || !isNormalEquals(nextContext, this.context);
  }
}
