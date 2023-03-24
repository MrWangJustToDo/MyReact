import { isNormalEquals } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";
import { enableSyncFlush } from "../share";

import type { MyReactElementNode, createContext } from "../element";
import type { ComponentUpdateQueue } from "../fiber";

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

    if (ownerFiber && ownerFiber.isMounted) {
      const renderPlatform = ownerFiber.root.renderPlatform;

      const renderDispatch = ownerFiber.root.renderDispatch;

      ownerFiber.updateQueue.push(updater);

      if (enableSyncFlush.current) {
        renderDispatch.processClassComponentQueue(ownerFiber);
      } else {
        renderPlatform.microTask(() => renderDispatch.processClassComponentQueue(ownerFiber));
      }
    }
  };

  forceUpdate = () => {
    const updater: ComponentUpdateQueue = {
      type: "component",
      isForce: true,
      trigger: this,
    };

    const ownerFiber = this._ownerFiber;

    if (ownerFiber && ownerFiber.isMounted) {
      const renderPlatform = ownerFiber.root.renderPlatform;

      const renderDispatch = ownerFiber.root.renderDispatch;

      ownerFiber.updateQueue.push(updater);

      if (enableSyncFlush.current) {
        renderDispatch.processClassComponentQueue(ownerFiber);
      } else {
        renderPlatform.microTask(() => renderDispatch.processClassComponentQueue(ownerFiber));
      }
    }
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
