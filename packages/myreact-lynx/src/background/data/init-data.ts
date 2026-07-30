/**
 * InitData system for MyReact Lynx.
 *
 * Provides React context and hooks for accessing `lynx.__initData` with
 * automatic re-rendering when the data changes via 'onDataChanged' event.
 */

import { createContext, useState, createElement } from "@my-react/react";

import { useLynxGlobalEventListener } from "./use-lynx-global-event-listener";

import type React from "@my-react/react";
import type { ComponentClass } from "@my-react/react";
import type { ReactNode, Consumer, FC } from "react";

/**
 * The interface you can extend so that the `defaultDataProcessor` parameter can be customized.
 *
 * Should be used with `lynx.registerDataProcessors`.
 *
 * @example
 * ```ts
 * declare module '@my-react/react-lynx' {
 *   interface InitDataRaw {
 *     someProperty: string;
 *   }
 * }
 * ```
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InitDataRaw {}

/**
 * The interface you can extend so that the `defaultDataProcessor` returning value can be customized.
 *
 * Should be used with `lynx.registerDataProcessors`.
 *
 * @example
 * ```ts
 * declare module '@my-react/react-lynx' {
 *   interface InitData {
 *     someProperty: string;
 *   }
 * }
 * ```
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InitData {}

type Getter<T> = {
  [key in keyof T]: () => T[key];
};

/**
 * Factory function for creating InitData context and hooks.
 * Mirrors ReactLynx's factory pattern for better compatibility.
 */
function factory<Data>(
  prop: "__globalProps" | "__initData",
  eventName: string
): Getter<{
  Context: React.Context<Data>;
  Provider: FC<{ children?: ReactNode }>;
  Consumer: Consumer<Data>;
  use: () => Data;
  useChanged: (callback: (data: Data) => void) => void;
}> {
  const Context = createContext({} as Data);

  const Provider: FC<{ children?: ReactNode }> = ({ children }) => {
    const [value, setValue] = useState<Data>(lynx[prop] as Data);

    const handleChange = () => {
      setValue(lynx[prop] as Data);
    };

    useChanged(handleChange);

    return createElement(Context.Provider, { value }, children);
  };

  const ConsumerComponent = Context.Consumer as Consumer<Data>;

  const use = (): Data => {
    const [value, setValue] = useState<Data>(lynx[prop] as Data);

    useChanged(() => {
      setValue(lynx[prop] as Data);
    });

    return value;
  };

  const useChanged = (callback: (data: Data) => void): void => {
    if (typeof __LEPUS__ === "undefined" || !__LEPUS__) {
      useLynxGlobalEventListener(eventName, callback);
    }
  };

  return {
    Context: () => Context,
    Provider: () => Provider,
    Consumer: () => ConsumerComponent,
    use: () => use,
    useChanged: () => useChanged,
  };
}

const _InitData = factory<InitData>("__initData", "onDataChanged");

/**
 * The Provider Component that provides `initData`.
 * You must wrap your JSX inside it.
 *
 * @example
 * ```tsx
 * import { root, InitDataProvider } from '@my-react/react-lynx';
 *
 * function App() {
 *   return (
 *     <InitDataConsumer>
 *       {(initData) => <view>{initData.someProperty}</view>}
 *     </InitDataConsumer>
 *   )
 * }
 *
 * root.render(
 *   <InitDataProvider>
 *     <App />
 *   </InitDataProvider>
 * );
 * ```
 *
 * @public
 */
export const InitDataProvider: FC<{ children?: ReactNode }> = _InitData.Provider();

/**
 * The Consumer Component that provides `initData`.
 * This should be used with {@link InitDataProvider}.
 *
 * @public
 */
export const InitDataConsumer: Consumer<InitData> = _InitData.Consumer();

/**
 * A React Hook for you to get `initData`.
 * If `initData` is changed, a re-render will be triggered automatically.
 *
 * @example
 * ```tsx
 * function App() {
 *   const initData = useInitData();
 *
 *   return <view>{initData.someProperty}</view>;
 * }
 * ```
 *
 * @public
 */
export const useInitData: () => InitData = _InitData.use();

/**
 * A React Hook for you to get notified when `initData` changed.
 *
 * @example
 * ```tsx
 * function App() {
 *   useInitDataChanged((data) => {
 *     console.log('initData changed:', data.someProperty);
 *   });
 *
 *   return <view>...</view>;
 * }
 * ```
 *
 * @public
 */
export const useInitDataChanged: (callback: (data: InitData) => void) => void = _InitData.useChanged();

/**
 * Higher-Order Component (HOC) that injects `initData` into the state of the given class component.
 *
 * This HOC checks if the provided component is a class component. If it is, it wraps the component
 * and injects the `initData` into its state. It also adds a listener to update the state when
 * data changes, and removes the listener when the component unmounts.
 *
 * @typeParam P - The type of the props of the wrapped component.
 * @typeParam S - The type of the state of the wrapped component.
 *
 * @param App - The class component to be wrapped by the HOC.
 *
 * @returns The original component if it is not a class component, otherwise a new class component
 *          with `initData` injection and state update functionality.
 *
 * @example
 * ```tsx
 * class App extends React.Component<MyProps, MyState> {
 *   render() {
 *     return <view>{this.state.someProperty}</view>;
 *   }
 * }
 *
 * export default withInitDataInState(App);
 * ```
 *
 * @public
 */
export function withInitDataInState<P, S>(App: ComponentClass<P, S>): ComponentClass<P, S> {
  const isClassComponent = "prototype" in App && "render" in App.prototype;
  if (!isClassComponent) {
    return App;
  }

  class WrappedComponent extends App {
    private _handler?: () => void;

    constructor(props: P) {
      super(props);
      this.state = {
        ...this.state,
        ...lynx.__initData,
      };

      if (typeof __LEPUS__ === "undefined" || !__LEPUS__) {
        this._handler = (...args: unknown[]) => {
          const [newData] = args as [S];
          this.setState(newData);
        };
        lynx.getJSModule("GlobalEventEmitter").addListener("onDataChanged", this._handler);
      }
    }

    override componentWillUnmount(): void {
      super.componentWillUnmount?.();
      if ((typeof __LEPUS__ === "undefined" || !__LEPUS__) && this._handler) {
        lynx.getJSModule("GlobalEventEmitter").removeListener("onDataChanged", this._handler);
      }
    }
  }

  return WrappedComponent;
}
