import ansiEscapes from "ansi-escapes";
import autoBind from "auto-bind";
import { throttle } from "es-toolkit/compat";
import isInCi from "is-in-ci";
import process from "node:process";
import patchConsole from "patch-console";
import React, { type ReactNode } from "react";
import * as signalExit from "signal-exit";
import wrapAnsi from "wrap-ansi";
import Yoga from "yoga-layout";

import { accessibilityContext as AccessibilityContext } from "./components/AccessibilityContext";
import App from "./components/App";
import * as dom from "./dom";
import instances from "./instances";
import logUpdate, { type LogUpdate } from "./log-update";
import { Reconciler } from "./reconciler";
import render from "./renderer";

import type { MyReactFiberRoot } from "@my-react/react-reconciler";

const noop = () => {};

export type Options = {
  stdout: NodeJS.WriteStream;
  stdin: NodeJS.ReadStream;
  stderr: NodeJS.WriteStream;
  debug: boolean;
  exitOnCtrlC: boolean;
  patchConsole: boolean;
  isScreenReaderEnabled?: boolean;
  waitUntilExit?: () => Promise<void>;
};

export default class Ink {
  private readonly options: Options;
  private readonly log: LogUpdate;
  private readonly throttledLog: LogUpdate;
  private readonly isScreenReaderEnabled: boolean;

  // Ignore last render after unmounting a tree to prevent empty output before exit
  private isUnmounted: boolean;
  private lastOutput: string;
  private lastOutputHeight: number;
  private readonly container: MyReactFiberRoot;
  private readonly rootNode: dom.DOMElement;
  // This variable is used only in debug mode to store full static output
  // so that it's rerendered every time, not just new static parts, like in non-debug mode
  private fullStaticOutput: string;
  private exitPromise?: Promise<void>;
  private restoreConsole?: () => void;
  private readonly unsubscribeResize?: () => void;

  constructor(options: Options) {
    autoBind(this);

    this.options = options;
    this.rootNode = dom.createNode("ink-root");
    this.rootNode.onComputeLayout = this.calculateLayout;

    this.isScreenReaderEnabled = options.isScreenReaderEnabled ?? process.env["INK_SCREEN_READER"] === "true";

    const unthrottled = options.debug || this.isScreenReaderEnabled;

    this.rootNode.onRender = unthrottled
      ? this.onRender
      : throttle(this.onRender, 32, {
          leading: true,
          trailing: true,
        });

    this.rootNode.onImmediateRender = this.onRender;
    this.log = logUpdate.create(options.stdout);
    this.throttledLog = unthrottled
      ? this.log
      : (throttle(this.log, undefined, {
          leading: true,
          trailing: true,
        }) as unknown as LogUpdate);

    // Ignore last render after unmounting a tree to prevent empty output before exit
    this.isUnmounted = false;

    // Store last output to only rerender when needed
    this.lastOutput = "";
    this.lastOutputHeight = 0;

    // This variable is used only in debug mode to store full static output
    // so that it's rerendered every time, not just new static parts, like in non-debug mode
    this.fullStaticOutput = "";

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.container = Reconciler.createContainer(
      this.rootNode,
      // Legacy mode
      0,
      null,
      false,
      null,
      "id",
      () => {},
      null
    );

    // Unmount when process exits
    this.unsubscribeExit = signalExit.onExit(this.unmount, { alwaysLast: false });

    if (process.env["DEV"] === "true") {
      const injectIntoDevTools = async (url: string, config: any) => {
        const { io } = await import("socket.io-client");
        globalThis.io = io;
        const typedReconciler = Reconciler as typeof Reconciler & {
          injectIntoDevToolsWithSocketIO: (url: string, config: any) => Promise<void>;
        };
        typedReconciler.injectIntoDevToolsWithSocketIO(url, config);
      };

      const DEVTOOL_PATH = process.env["DEVTOOL_PATH"] || "localhost";

      const DEVTOOL_PORT = process.env["DEVTOOL_PORT"] || "3002";

      // TODO: make this configurable
      injectIntoDevTools(`http://${DEVTOOL_PATH}:${DEVTOOL_PORT}`, {
        rendererPackageName: "@my-react/react-terminal",
      });
    }

    if (options.patchConsole) {
      this.patchConsole();
    }

    if (!isInCi) {
      options.stdout.on("resize", this.resized);

      this.unsubscribeResize = () => {
        options.stdout.off("resize", this.resized);
      };
    }
  }

  resized = () => {
    this.calculateLayout();
    this.onRender();
  };

  resolveExitPromise: () => void = () => {};
  rejectExitPromise: (reason?: Error) => void = () => {};
  unsubscribeExit: () => void = () => {};

  calculateLayout = () => {
    // The 'columns' property can be undefined or 0 when not using a TTY.
    // In that case we fall back to 80.
    const terminalWidth = this.options.stdout.columns || 80;

    this.rootNode.yogaNode!.setWidth(terminalWidth);

    this.rootNode.yogaNode!.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);
  };

  onRender: () => void = () => {
    if (this.isUnmounted) {
      return;
    }

    const { output, outputHeight, staticOutput } = render(this.rootNode, this.isScreenReaderEnabled);

    // If <Static> output isn't empty, it means new children have been added to it
    const hasStaticOutput = staticOutput && staticOutput !== "\n";

    if (this.options.debug) {
      if (hasStaticOutput) {
        this.fullStaticOutput += staticOutput;
      }

      this.options.stdout.write(this.fullStaticOutput + output);
      return;
    }

    if (isInCi) {
      if (hasStaticOutput) {
        this.options.stdout.write(staticOutput);
      }

      this.lastOutput = output;
      this.lastOutputHeight = outputHeight;
      return;
    }

    if (this.isScreenReaderEnabled) {
      if (hasStaticOutput) {
        // We need to erase the main output before writing new static output
        const erase = this.lastOutputHeight > 0 ? ansiEscapes.eraseLines(this.lastOutputHeight) : "";
        this.options.stdout.write(erase + staticOutput);
        // After erasing, the last output is gone, so we should reset its height
        this.lastOutputHeight = 0;
      }

      if (output === this.lastOutput && !hasStaticOutput) {
        return;
      }

      const terminalWidth = this.options.stdout.columns || 80;

      const wrappedOutput = wrapAnsi(output, terminalWidth, {
        trim: false,
        hard: true,
      });

      // If we haven't erased yet, do it now.
      if (hasStaticOutput) {
        this.options.stdout.write(wrappedOutput);
      } else {
        const erase = this.lastOutputHeight > 0 ? ansiEscapes.eraseLines(this.lastOutputHeight) : "";
        this.options.stdout.write(erase + wrappedOutput);
      }

      this.lastOutput = output;
      this.lastOutputHeight = wrappedOutput === "" ? 0 : wrappedOutput.split("\n").length;
      return;
    }

    if (hasStaticOutput) {
      this.fullStaticOutput += staticOutput;
    }

    if (this.lastOutputHeight >= this.options.stdout.rows) {
      this.options.stdout.write(ansiEscapes.clearTerminal + this.fullStaticOutput + output + "\n");
      this.lastOutput = output;
      this.lastOutputHeight = outputHeight;
      this.log.sync(output);
      return;
    }

    // To ensure static output is cleanly rendered before main output, clear main output first
    if (hasStaticOutput) {
      this.log.clear();
      this.options.stdout.write(staticOutput);
      this.log(output);
    }

    if (!hasStaticOutput && output !== this.lastOutput) {
      this.throttledLog(output);
    }

    this.lastOutput = output;
    this.lastOutputHeight = outputHeight;
  };

  render(node: ReactNode): void {
    const tree = (
      <AccessibilityContext.Provider value={{ isScreenReaderEnabled: this.isScreenReaderEnabled }}>
        <App
          stdin={this.options.stdin}
          stdout={this.options.stdout}
          stderr={this.options.stderr}
          writeToStdout={this.writeToStdout}
          writeToStderr={this.writeToStderr}
          exitOnCtrlC={this.options.exitOnCtrlC}
          onExit={this.unmount}
        >
          {node}
        </App>
      </AccessibilityContext.Provider>
    );

    Reconciler.updateContainer(tree, this.container, null, noop);
  }

  writeToStdout(data: string): void {
    if (this.isUnmounted) {
      return;
    }

    if (this.options.debug) {
      this.options.stdout.write(data + this.fullStaticOutput + this.lastOutput);
      return;
    }

    if (isInCi) {
      this.options.stdout.write(data);
      return;
    }

    this.log.clear();
    this.options.stdout.write(data);
    this.log(this.lastOutput);
  }

  writeToStderr(data: string): void {
    if (this.isUnmounted) {
      return;
    }

    if (this.options.debug) {
      this.options.stderr.write(data);
      this.options.stdout.write(this.fullStaticOutput + this.lastOutput);
      return;
    }

    if (isInCi) {
      this.options.stderr.write(data);
      return;
    }

    this.log.clear();
    this.options.stderr.write(data);
    this.log(this.lastOutput);
  }

  unmount(error?: Error | number | null): void {
    if (this.isUnmounted) {
      return;
    }

    this.calculateLayout();
    this.onRender();
    this.unsubscribeExit();

    if (typeof this.restoreConsole === "function") {
      this.restoreConsole();
    }

    if (typeof this.unsubscribeResize === "function") {
      this.unsubscribeResize();
    }

    // CIs don't handle erasing ansi escapes well, so it's better to
    // only render last frame of non-static output
    if (isInCi) {
      this.options.stdout.write(this.lastOutput + "\n");
    } else if (!this.options.debug) {
      this.log.done();
    }

    this.isUnmounted = true;

    Reconciler.updateContainer(null, this.container, null, noop);

    instances.delete(this.options.stdout);

    if (error instanceof Error) {
      this.rejectExitPromise(error);
    } else {
      this.resolveExitPromise();
    }
  }

  async waitUntilExit(): Promise<void> {
    this.exitPromise ||= new Promise((resolve, reject) => {
      this.resolveExitPromise = resolve;
      this.rejectExitPromise = reject;
    });

    return this.exitPromise;
  }

  clear(): void {
    if (!isInCi && !this.options.debug) {
      this.log.clear();
    }
  }

  patchConsole(): void {
    if (this.options.debug) {
      return;
    }

    this.restoreConsole = patchConsole((stream, data) => {
      if (stream === "stdout") {
        this.writeToStdout(data);
      }

      if (stream === "stderr") {
        const isReactMessage = data.startsWith("The above error occurred");

        if (!isReactMessage) {
          this.writeToStderr(data);
        }
      }
    });
  }
}
