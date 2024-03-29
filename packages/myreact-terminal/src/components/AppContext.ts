import { createContext } from "@my-react/react";

export type AppContextProps = {
  readonly exit: (error?: Error) => void;
};

/**
 * `AppContext` is a React context, which exposes a method to manually exit the app (unmount).
 */
export const AppContext = createContext<AppContextProps>({
  exit: () => void 0,
});

AppContext.displayName = "InternalAppContext";
