/* eslint-disable max-lines */
import { type StyledChar } from "@alcalzone/ansi-tokenize";
import ansiEscapes from "ansi-escapes";
import autoBind from "auto-bind";
import { throttle } from "es-toolkit/compat";
import isInCi from "is-in-ci";
import process from "node:process";
import patchConsole from "patch-console";
import { type ReactNode } from "react";
import { type FiberRoot } from "react-reconciler";
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
import { ResizeObserverEntry } from "./resize-observer";
import { calculateScroll } from "./scroll";
import { Selection } from "./selection";

import type ResizeObserver from "./resize-observer";

const noop = () => {};

/**
Performance metrics for a render operation.
*/
export type RenderMetrics = {
  /**
	Time spent rendering in milliseconds.
	*/
  renderTime: number;
};

export type Options = {
  stdout: NodeJS.WriteStream;
  stdin: NodeJS.ReadStream;
  stderr: NodeJS.WriteStream;
  debug: boolean;
  exitOnCtrlC: boolean;
  patchConsole: boolean;
  onRender?: (metrics: RenderMetrics) => void;
  isScreenReaderEnabled?: boolean;
  waitUntilExit?: () => Promise<void>;
  maxFps?: number;
  alternateBuffer?: boolean;
  alternateBufferAlreadyActive?: boolean;
  incrementalRendering?: boolean;
  debugRainbow?: boolean;
  selectionStyle?: (char: StyledChar) => StyledChar;
};

const rainbowColors = [
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "blackBright",
  "redBright",
  "greenBright",
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  "whiteBright",
];

export default class Ink {
  private readonly options: Options;
  private readonly log: LogUpdate;
  private readonly throttledLog: LogUpdate;
  private readonly isScreenReaderEnabled: boolean;
  private readonly selection: Selection;

  // Ignore last render after unmounting a tree to prevent empty output before exit
  private isUnmounted: boolean;
  private lastOutput: string;
  private lastOutputHeight: number;
  private readonly container: FiberRoot;
  private readonly rootNode: dom.DOMElement;
  // This variable is used only in debug mode to store full static output
  // so that it's rerendered every time, not just new static parts, like in non-debug mode
  private fullStaticOutput: string;
  private exitPromise?: Promise<void>;
  private restoreConsole?: () => void;
  private readonly unsubscribeResize?: () => void;
  private readonly unsubscribeSelection?: () => void;
  private frameIndex = 0;

  constructor(options: Options) {
    autoBind(this);

    this.options = options;

    this.rootNode = dom.createNode("ink-root");
    this.rootNode.onComputeLayout = this.calculateLayout;

    this.isScreenReaderEnabled = options.isScreenReaderEnabled ?? process.env["INK_SCREEN_READER"] === "true";

    this.selection = new Selection();

    const unthrottled = options.debug || this.isScreenReaderEnabled;
    const maxFps = options.maxFps ?? 30;
    const renderThrottleMs = maxFps > 0 ? Math.max(1, Math.ceil(1000 / maxFps)) : 0;

    const onRender = unthrottled
      ? this.onRender
      : throttle(this.onRender, renderThrottleMs, {
          leading: true,
          trailing: true,
        });

    this.rootNode.onRender = onRender;
    this.unsubscribeSelection = this.selection.onChange(onRender);

    this.rootNode.onImmediateRender = this.onRender;
    this.log = logUpdate.create(options.stdout, {
      alternateBuffer: options.alternateBuffer,
      alternateBufferAlreadyActive: options.alternateBufferAlreadyActive,
      getRows: () => options.stdout.rows,
      getColumns: () => options.stdout.columns,
      incremental: options.incrementalRendering,
    });
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
      0,
      null,
      false,
      null,
      "id",
      () => {},
      () => {},
      () => {},
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

  getSelection(): Selection {
    return this.selection;
  }

  resolveExitPromise: () => void = () => {};
  rejectExitPromise: (reason?: Error) => void = () => {};
  unsubscribeExit: () => void = () => {};

  calculateLayout = () => {
    // The 'columns' property can be undefined or 0 when not using a TTY.
    // In that case we fall back to 80.
    const terminalWidth = this.options.stdout.columns || 80;

    this.rootNode.yogaNode!.setWidth(terminalWidth);

    this.rootNode.yogaNode!.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    const observerEntries = new Map<ResizeObserver, ResizeObserverEntry[]>();
    this.calculateLayoutAndTriggerObservers(this.rootNode, observerEntries);

    for (const [observer, entries] of observerEntries) {
      observer.internalTrigger(entries);
    }
  };

  calculateLayoutAndTriggerObservers(node: dom.DOMElement, observerEntries: Map<ResizeObserver, ResizeObserverEntry[]>) {
    if (node.nodeName === "ink-box") {
      const { style } = node;
      const overflow = style.overflow ?? "visible";
      const overflowX = style.overflowX ?? overflow;
      const overflowY = style.overflowY ?? overflow;

      if (overflowX === "scroll" || overflowY === "scroll") {
        calculateScroll(node);
      } else if (node.internal_scrollState) {
        delete node.internal_scrollState;
      }
    }

    if (node.resizeObservers && node.resizeObservers.size > 0 && node.yogaNode) {
      const width = node.yogaNode.getComputedWidth();
      const height = node.yogaNode.getComputedHeight();
      const lastSize = node.internal_lastMeasuredSize;

      if (!lastSize || lastSize.width !== width || lastSize.height !== height) {
        const entry = new ResizeObserverEntry(node, { width, height });

        for (const observer of node.resizeObservers) {
          if (!observerEntries.has(observer)) {
            observerEntries.set(observer, []);
          }

          observerEntries.get(observer)!.push(entry);
        }

        node.internal_lastMeasuredSize = { width, height };
      }
    }

    for (const child of node.childNodes) {
      if (child.nodeName !== "#text") {
        this.calculateLayoutAndTriggerObservers(child, observerEntries);
      }
    }
  }

  onRender: () => void = () => {
    if (this.isUnmounted) {
      return;
    }

    const startTime = performance.now();

    let debugRainbowColor: string | undefined;
    if (this.options.debugRainbow) {
      debugRainbowColor = rainbowColors[this.frameIndex % rainbowColors.length];
      this.frameIndex++;
    }

    const { output, outputHeight, staticOutput, styledOutput } = render(this.rootNode, this.isScreenReaderEnabled, this.selection, this.options.selectionStyle);

    this.options.onRender?.({ renderTime: performance.now() - startTime });

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

    if (this.options.alternateBuffer) {
      if (hasStaticOutput) {
        this.fullStaticOutput += staticOutput;
      }

      this.log(this.fullStaticOutput + output, styledOutput, debugRainbowColor);
      this.lastOutput = output;
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
      this.options.stdout.write(ansiEscapes.clearTerminal + this.fullStaticOutput + output);
      this.lastOutput = output;
      this.lastOutputHeight = outputHeight;
      this.log.sync(output);
      return;
    }

    // To ensure static output is cleanly rendered before main output, clear main output first
    if (hasStaticOutput) {
      this.log.clear();
      this.options.stdout.write(staticOutput);
      this.log(output, styledOutput, debugRainbowColor);
    }

    if (!hasStaticOutput && output !== this.lastOutput) {
      this.throttledLog(output, styledOutput, debugRainbowColor);
    }

    this.lastOutput = output;
    this.lastOutputHeight = outputHeight;
  };

  recalculateLayout(): void {
    this.markAllTextNodesDirty(this.rootNode);
    this.calculateLayout();
    this.onRender();
  }

  onRerender = () => {
    if (this.isUnmounted) {
      return;
    }

    this.log.clear();
    this.lastOutput = "";
    this.onRender();
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
          selection={this.selection}
          onExit={this.unmount}
          onRerender={this.onRerender}
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
    this.log(this.lastOutput, []);
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
    this.log(this.lastOutput, []);
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

    if (typeof this.unsubscribeSelection === "function") {
      this.unsubscribeSelection();
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

  private markAllTextNodesDirty(node: dom.DOMElement) {
    if (node.nodeName === "ink-text" && node.yogaNode) {
      node.yogaNode.markDirty();
    }

    for (const child of node.childNodes) {
      if (child.nodeName !== "#text") {
        this.markAllTextNodesDirty(child);
      }
    }
  }
}
