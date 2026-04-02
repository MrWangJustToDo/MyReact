import { createContext } from "react";

import { type Selection } from "../selection.js";

export type InkOptions = {
  readonly isAlternateBufferEnabled?: boolean;
  readonly stickyHeadersInBackbuffer?: boolean;
  readonly animatedScroll?: boolean;
  readonly animationInterval?: number;
  readonly backbufferUpdateDelay?: number;
  readonly maxScrollbackLength?: number;

  /**
   * When set to true, Ink will attempt to force the terminal to scroll to the bottom
   * when performing a full re-render (e.g. when the backbuffer is refreshed).
   *
   * Currently this is only supported in VS Code due to lack of robust APIs in other
   * terminals to force scrolling to the bottom.
   */
  readonly forceScrollToBottomOnBackbufferRefresh?: boolean;
};

export type Props = {
  /**
	Exit (unmount) the whole Ink app.
	*/
  readonly exit: (error?: Error) => void;

  /**
	Force a full rerender of the app, clearing the screen.
	*/
  readonly rerender: () => void;
  readonly selection?: Selection;
  readonly options: InkOptions;
  readonly setOptions: (options: Partial<InkOptions>) => void;

  /**
   * Exports the current internal rendering state to a JSON file and a human-readable text dump.
   * Only supported when `terminalBuffer` is enabled.
   * @param filename The path/name for the JSON file (e.g., 'snapshot.json').
   */
  readonly dumpCurrentFrame: (filename: string) => void;

  /**
   * Starts recording internal rendering states (frames) to a sequence.
   * Only supported when `terminalBuffer` is enabled.
   * @param filename The path/name for the JSON file where the sequence will be saved when stopped.
   */
  readonly startRecording: (filename: string) => void;

  /**
   * Stops recording and saves the collected frames to the filename specified in `startRecording`.
   * Only supported when `terminalBuffer` is enabled.
   */
  readonly stopRecording: () => void;
};

/**
`AppContext` is a React context that exposes a method to manually exit the app (unmount).
*/

export const AppContext = createContext<Props>({
  exit() {},
  rerender() {},
  options: {},
  setOptions() {},
  dumpCurrentFrame() {},
  startRecording() {},
  stopRecording() {},
});

AppContext.displayName = "AppContext";

export default AppContext;
