import { isNormalEquals, MyReactInternalInstance } from '../share';

import type { createContext } from '../element';
import type { ComponentUpdateQueue } from '../fiber';
import type { DynamicChildrenNode } from '../vdom';

interface MyReactComponentType<P, S, C> {
  render(this: MyReactComponent): DynamicChildrenNode;
  componentDidMount?(this: MyReactComponent): void;
  shouldComponentUpdate?(
    this: MyReactComponent,
    nextProps: P,
    nextState: S,
    nextContext: C
  ): boolean;
  componentDidUpdate?(
    this: MyReactComponent,
    prevProps: P,
    prevState: S,
    prevContext: C
  ): void;
  componentWillUnmount?(): void;
}

export type MyReactComponentStaticType<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any
> = {
  contextType: null | ReturnType<typeof createContext>;
  getDerivedStateFromProps(props: P, state: S): S;
};

export type MixinMyReactComponentType<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> = MyReactComponent<P, S, C> & MyReactComponentType<P, S, C>;

export class MyReactComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> extends MyReactInternalInstance {
  state: S | null = null;
  props: P | null = null;
  context: C | null = null;

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

  setState(
    payLoad: ComponentUpdateQueue['payLoad'],
    callback: ComponentUpdateQueue['callback']
  ) {
    const updater: ComponentUpdateQueue = {
      type: 'state',
      payLoad,
      callback,
      trigger: this,
    };
    this.__fiber__?.compUpdateQueue.push(updater);
    this.__fiber__?.update();
  }

  forceUpdate() {
    const updater: ComponentUpdateQueue = {
      type: 'state',
      isForce: true,
      trigger: this,
    };
    this.__fiber__?.compUpdateQueue.push(updater);
    this.__fiber__?.update();
  }
}

export class MyReactPureComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> extends MyReactComponent<P, S, C> {
  shouldComponentUpdate(nextProps: P, nextState: S, nextContext: C) {
    return (
      !isNormalEquals(nextProps, this.props) ||
      !isNormalEquals(nextState, this.state) ||
      !isNormalEquals(nextContext, this.context)
    );
  }
}
