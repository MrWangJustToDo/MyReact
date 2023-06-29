import { createContext } from "@my-react/react";
import process from "node:process";

export type StdinContextProps = {
  /**
   * Stdin stream passed to `render()` in `options.stdin` or `process.stdin` by default. Useful if your app needs to handle user input.
   */
  readonly stdin: NodeJS.ReadStream;

  /**
   * Ink exposes this function via own `<StdinContext>` to be able to handle Ctrl+C, that's why you should use Ink's `setRawMode` instead of `process.stdin.setRawMode`.
   * If the `stdin` stream passed to Ink does not support setRawMode, this function does nothing.
   */
  readonly setRawMode: (value: boolean) => void;

  /**
   * A boolean flag determining if the current `stdin` supports `setRawMode`. A component using `setRawMode` might want to use `isRawModeSupported` to nicely fall back in environments where raw mode is not supported.
   */
  readonly isRawModeSupported: boolean;

  readonly internal_exitOnCtrlC: boolean;
};

/**
 * `StdinContext` is a React context, which exposes input stream.
 */
export const StdinContext = createContext<StdinContextProps>({
  stdin: process.stdin,
  setRawMode: () => void 0,
  isRawModeSupported: false,
  internal_exitOnCtrlC: true,
});

StdinContext.displayName = "InternalStdinContext";
