import { Stream } from "node:stream";

import { Instance, instances } from "./instance";

import type { Options } from "./instance";
import type { MyReactElementNode } from "@my-react/react";

export type RenderOptions = {
  /**
   * Output stream where app will be rendered.
   *
   * @default process.stdout
   */
  stdout?: NodeJS.WriteStream;
  /**
   * Input stream where app will listen for input.
   *
   * @default process.stdin
   */
  stdin?: NodeJS.ReadStream;
  /**
   * Error stream.
   * @default process.stderr
   */
  stderr?: NodeJS.WriteStream;
  /**
   * If true, each update will be rendered as a separate output, without replacing the previous one.
   *
   * @default false
   */
  debug?: boolean;
  /**
   * Configure whether Ink should listen to Ctrl+C keyboard input and exit the app. This is needed in case `process.stdin` is in raw mode, because then Ctrl+C is ignored by default and process is expected to handle it manually.
   *
   * @default true
   */
  exitOnCtrlC?: boolean;

  /**
   * Patch console methods to ensure console output doesn't mix with Ink output.
   *
   * @default true
   */
  patchConsole?: boolean;
};

if (typeof process === "undefined") {
  throw new Error(`[@my-react/react-terminal] can only working in the terminal env`);
}

export const render = (node: MyReactElementNode, options?: NodeJS.WriteStream | RenderOptions) => {
  const inkOptions: Options = {
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr,
    debug: false,
    exitOnCtrlC: true,
    patchConsole: true,
    ...getOptions(options),
  };

  const instance: Instance = getInstance(inkOptions.stdout, () => new Instance(inkOptions));

  instance.render(node);

  return {
    render: instance.render,
    unmount: () => instance.unmount(),
    waitUntilExit: instance.waitUntilExit,
    cleanup: () => instances.delete(inkOptions.stdout),
    clear: instance.clear,
  };
};

const getOptions = (stdout: NodeJS.WriteStream | RenderOptions | undefined = {}): RenderOptions => {
  if (stdout instanceof Stream) {
    return {
      stdout,
      stdin: process.stdin,
    };
  }

  return stdout;
};

const getInstance = (stdout: NodeJS.WriteStream, createInstance: () => Instance): Instance => {
  let instance = instances.get(stdout);

  if (!instance) {
    instance = createInstance();
    instances.set(stdout, instance);
  }

  return instance;
};
