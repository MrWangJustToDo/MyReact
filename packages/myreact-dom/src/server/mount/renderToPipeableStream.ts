import { isValidElement, type LikeJSX } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { LatestServerStreamDispatch } from "@my-react-dom-server/renderDispatch";
import { checkRoot, initServer, isServer, startRenderAsync, wrapperFunc } from "@my-react-dom-shared";

import type { BootstrapScriptDescriptor, ErrorInfo } from "@my-react-dom-server/renderDispatch";

type RenderToPipeableStreamOptions = {
  identifierPrefix?: string;
  namespaceURI?: string;
  nonce?: string;
  bootstrapScriptContent?: string;
  bootstrapScripts?: Array<string | BootstrapScriptDescriptor>;
  bootstrapModules?: Array<string | BootstrapScriptDescriptor>;
  progressiveChunkSize?: number;
  onShellReady?: () => void;
  onShellError?: (error: unknown) => void;
  onAllReady?: () => void;
  onError?: (error: unknown, errorInfo: ErrorInfo) => string | void;
};

type PipeableStream = {
  abort: (reason?: unknown) => void;
  pipe: <Writable extends NodeJS.WritableStream>(destination: Writable) => Writable;
};

export const renderToPipeableStream = wrapperFunc((element: LikeJSX, options?: RenderToPipeableStreamOptions): PipeableStream => {
  if (isValidElement(element)) {
    initServer();

    const temp = [];
    (temp as any).destroy = () => {
      void 0;
    };
    (temp as any).pipe = () => {
      return temp;
    };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const stream = isServer ? new (require("stream").Readable)({ read() {} }) : temp;

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new LatestServerStreamDispatch(container, fiber, element);

    renderDispatch.stream = stream;

    renderDispatch.onShellError = options?.onShellError;

    renderDispatch.onShellReady = options?.onShellReady;

    renderDispatch.onAllReady = options?.onAllReady;

    options?.onError && (renderDispatch.onError = options.onError);

    renderDispatch.bootstrapModules = options?.bootstrapModules;

    renderDispatch.bootstrapScripts = options?.bootstrapScripts;

    renderDispatch.bootstrapScriptContent = options?.bootstrapScriptContent;

    renderDispatch.isServerRender = true;

    initialFiberNode(renderDispatch, fiber);

    startRenderAsync(renderDispatch, fiber);

    return {
      pipe: stream.pipe.bind(stream),
      abort: stream.destroy.bind(stream),
    };
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToPipeableStream' can only render a '@my-react' element`);
  }
});
