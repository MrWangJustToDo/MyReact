/**
 * GlobalProps system for MyReact Lynx.
 *
 * Provides React context and hooks for accessing `lynx.__globalProps` with
 * automatic re-rendering when the data changes via 'onGlobalPropsChanged' event.
 */

import { createContext, useState, createElement } from "@my-react/react";

import { useLynxGlobalEventListener } from "./use-lynx-global-event-listener";

import type React from "@my-react/react";
import type { ReactNode, Consumer, FC } from "react";

/**
 * The interface you can extend so that the `useGlobalProps` returning value can be customized.
 *
 * @example
 * ```ts
 * declare module '@my-react/react-lynx' {
 *   interface GlobalProps {
 *     theme: 'light' | 'dark';
 *     locale: string;
 *   }
 * }
 * ```
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GlobalProps {}

type Getter<T> = {
  [key in keyof T]: () => T[key];
};

/**
 * Factory function for creating GlobalProps context and hooks.
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

const _GlobalProps = factory<GlobalProps>("__globalProps", "onGlobalPropsChanged");

/**
 * The Provider Component that provides `globalProps`.
 * You must wrap your JSX inside it.
 *
 * @example
 * ```tsx
 * import { root, GlobalPropsProvider } from '@my-react/react-lynx';
 *
 * function App() {
 *   return (
 *     <GlobalPropsConsumer>
 *       {(globalProps) => <view>{globalProps.theme}</view>}
 *     </GlobalPropsConsumer>
 *   )
 * }
 *
 * root.render(
 *   <GlobalPropsProvider>
 *     <App />
 *   </GlobalPropsProvider>
 * );
 * ```
 *
 * @public
 */
export const GlobalPropsProvider: FC<{ children?: ReactNode }> = _GlobalProps.Provider();

/**
 * The Consumer Component that provides `globalProps`.
 * This should be used with {@link GlobalPropsProvider}.
 *
 * @public
 */
export const GlobalPropsConsumer: Consumer<GlobalProps> = _GlobalProps.Consumer();

/**
 * A React Hook for you to get `lynx.__globalProps`.
 * If `globalProps` is changed, a re-render will be triggered automatically.
 *
 * @example
 * ```tsx
 * function App() {
 *   const globalProps = useGlobalProps();
 *
 *   return <view>{globalProps.theme}</view>;
 * }
 * ```
 *
 * @public
 */
export const useGlobalProps: () => GlobalProps = _GlobalProps.use();

/**
 * A React Hook for you to get notified when `globalProps` changed.
 *
 * @example
 * ```tsx
 * function App() {
 *   useGlobalPropsChanged((data) => {
 *     console.log('globalProps changed:', data.theme);
 *   });
 *
 *   return <view>...</view>;
 * }
 * ```
 *
 * @public
 */
export const useGlobalPropsChanged: (callback: (data: GlobalProps) => void) => void = _GlobalProps.useChanged();
