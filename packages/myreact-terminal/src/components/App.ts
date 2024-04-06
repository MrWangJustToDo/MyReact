import { createElement, PureComponent } from "@my-react/react";
import cliCursor from "cli-cursor";
import { EventEmitter } from "node:events";
import process from "node:process";

import { AppContext } from "./AppContext";
import { ErrorOverview } from "./ErrorOverview";
import { FocusContext } from "./FocusContext";
import { StderrContext } from "./StderrContext";
import { StdinContext } from "./StdinContext";
import { StdoutContext } from "./StdoutContext";

import type { MyReactElementNode } from "@my-react/react";

const tab = "\t";
const shiftTab = "\u001B[Z";
const escape = "\u001B";

type Props = {
  readonly children: MyReactElementNode;
  readonly stdin: NodeJS.ReadStream;
  readonly stdout: NodeJS.WriteStream;
  readonly stderr: NodeJS.WriteStream;
  readonly writeToStdout: (data: string) => void;
  readonly writeToStderr: (data: string) => void;
  readonly exitOnCtrlC: boolean;
  readonly onExit: (error?: Error) => void;
};

type State = {
  readonly isFocusEnabled: boolean;
  readonly activeFocusId?: string;
  readonly focusables: Focusable[];
  readonly error?: Error;
};

type Focusable = {
  readonly id: string;
  readonly isActive: boolean;
};

// Root component for all Ink apps
// It renders stdin and stdout contexts, so that children can access them if needed
// It also handles Ctrl+C exiting and cursor visibility
export class App extends PureComponent<Props, State> {
  static displayName = "InternalApp";

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override state = {
    isFocusEnabled: true,
    activeFocusId: undefined,
    focusables: [],
    error: undefined,
  };

  // Count how many components enabled raw mode to avoid disabling
  // raw mode until all components don't need it anymore
  rawModeEnabledCount = 0;

  internal_eventEmitter = new EventEmitter();

  // Determines if TTY is supported on the provided stdin
  isRawModeSupported(): boolean {
    return this.props.stdin.isTTY;
  }

  override render() {
    return createElement(
      AppContext.Provider,
      { value: { exit: this.handleExit } },
      createElement(
        StdinContext.Provider,
        {
          value: {
            stdin: this.props.stdin,
            setRawMode: this.handleSetRawMode,
            isRawModeSupported: this.isRawModeSupported(),
            internal_exitOnCtrlC: this.props.exitOnCtrlC,
            internal_eventEmitter: this.internal_eventEmitter
          },
        },
        createElement(
          StdoutContext.Provider,
          {
            value: {
              stdout: this.props.stdout,
              write: this.props.writeToStdout,
            },
          },
          createElement(
            StderrContext.Provider,
            {
              value: {
                stderr: this.props.stderr,
                write: this.props.writeToStderr,
              },
            },
            createElement(
              FocusContext.Provider,
              {
                value: {
                  activeId: this.state.activeFocusId,
                  add: this.addFocusable,
                  remove: this.removeFocusable,
                  activate: this.activateFocusable,
                  deactivate: this.deactivateFocusable,
                  enableFocus: this.enableFocus,
                  disableFocus: this.disableFocus,
                  focusNext: this.focusNext,
                  focusPrevious: this.focusPrevious,
                  focus: this.focus,
                },
              },
              this.state.error ? createElement(ErrorOverview, { error: this.state.error as Error }) : this.props.children
            )
          )
        )
      )
    );
  }

  override componentDidMount() {
    cliCursor.hide(this.props.stdout);
  }

  override componentWillUnmount() {
    cliCursor.show(this.props.stdout);

    // ignore calling setRawMode on an handle stdin it cannot be called
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false);
    }
  }

  override componentDidCatch(error: Error) {
    this.handleExit(error);
  }

  handleSetRawMode = (isEnabled: boolean): void => {
    const { stdin } = this.props;

    if (!this.isRawModeSupported()) {
      if (stdin === process.stdin) {
        throw new Error(
          "Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported"
        );
      } else {
        throw new Error(
          "Raw mode is not supported on the stdin provided to Ink.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported"
        );
      }
    }

    stdin.setEncoding("utf8");

    if (isEnabled) {
      // Ensure raw mode is enabled only once
      if (this.rawModeEnabledCount === 0) {
        stdin.ref();
        stdin.setRawMode(true);
        stdin.addListener("readable", this.handleReadable);
      }

      this.rawModeEnabledCount++;
      return;
    }

    // Disable raw mode only when no components left that are using it
    if (--this.rawModeEnabledCount === 0) {
      stdin.setRawMode(false);
      stdin.removeListener("readable", this.handleReadable);
      stdin.unref();
    }
  };

  handleReadable = (): void => {
		let chunk;
		// eslint-disable-next-line @typescript-eslint/ban-types
		while ((chunk = this.props.stdin.read() as string | null) !== null) {
			this.handleInput(chunk);
			this.internal_eventEmitter.emit('input', chunk);
		}
	};

  handleInput = (input: string): void => {
    // Exit on Ctrl+C
    if (input === "\x03" && this.props.exitOnCtrlC) {
      this.handleExit();
    }

    // Reset focus when there's an active focused component on Esc
    if (input === escape && this.state.activeFocusId) {
      this.setState({
        activeFocusId: undefined,
      });
    }

    if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
      if (input === tab) {
        this.focusNext();
      }

      if (input === shiftTab) {
        this.focusPrevious();
      }
    }
  };

  handleExit = (error?: Error): void => {
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false);
    }

    this.props.onExit(error);
  };

  enableFocus = (): void => {
    this.setState({
      isFocusEnabled: true,
    });
  };

  disableFocus = (): void => {
    this.setState({
      isFocusEnabled: false,
    });
  };

  focus = (id: string): void => {
    this.setState((previousState) => {
      const hasFocusableId = previousState.focusables.some((focusable) => focusable?.id === id);

      if (!hasFocusableId) {
        return previousState;
      }

      return { activeFocusId: id };
    });
  };

  focusNext = (): void => {
    this.setState((previousState) => {
      const firstFocusableId = previousState.focusables[0]?.id;
      const nextFocusableId = this.findNextFocusable(previousState);

      return {
        activeFocusId: nextFocusableId ?? firstFocusableId,
      };
    });
  };

  focusPrevious = (): void => {
    this.setState((previousState) => {
      const lastFocusableId = previousState.focusables[previousState.focusables.length - 1]?.id;
      const previousFocusableId = this.findPreviousFocusable(previousState);

      return {
        activeFocusId: previousFocusableId ?? lastFocusableId,
      };
    });
  };

  addFocusable = (id: string, { autoFocus }: { autoFocus: boolean }): void => {
    this.setState((previousState) => {
      let nextFocusId = previousState.activeFocusId;

      if (!nextFocusId && autoFocus) {
        nextFocusId = id;
      }

      return {
        activeFocusId: nextFocusId,
        focusables: [
          ...previousState.focusables,
          {
            id,
            isActive: true,
          },
        ],
      };
    });
  };

  removeFocusable = (id: string): void => {
    this.setState((previousState) => ({
      activeFocusId: previousState.activeFocusId === id ? undefined : previousState.activeFocusId,
      focusables: previousState.focusables.filter((focusable) => {
        return focusable.id !== id;
      }),
    }));
  };

  activateFocusable = (id: string): void => {
    this.setState((previousState) => ({
      focusables: previousState.focusables.map((focusable) => {
        if (focusable.id !== id) {
          return focusable;
        }

        return {
          id,
          isActive: true,
        };
      }),
    }));
  };

  deactivateFocusable = (id: string): void => {
    this.setState((previousState) => ({
      activeFocusId: previousState.activeFocusId === id ? undefined : previousState.activeFocusId,
      focusables: previousState.focusables.map((focusable) => {
        if (focusable.id !== id) {
          return focusable;
        }

        return {
          id,
          isActive: false,
        };
      }),
    }));
  };

  findNextFocusable = (state: State): string | undefined => {
    const activeIndex = state.focusables.findIndex((focusable) => {
      return focusable.id === state.activeFocusId;
    });

    for (let index = activeIndex + 1; index < state.focusables.length; index++) {
      const focusable = state.focusables[index];

      if (focusable?.isActive) {
        return focusable.id;
      }
    }

    return undefined;
  };

  findPreviousFocusable = (state: State): string | undefined => {
    const activeIndex = state.focusables.findIndex((focusable) => {
      return focusable.id === state.activeFocusId;
    });

    for (let index = activeIndex - 1; index >= 0; index--) {
      const focusable = state.focusables[index];

      if (focusable?.isActive) {
        return focusable.id;
      }
    }

    return undefined;
  };
}
