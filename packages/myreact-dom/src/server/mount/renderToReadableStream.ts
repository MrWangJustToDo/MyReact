import { isValidElement, type LikeJSX } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { LatestServerStreamDispatch, type BootstrapScriptDescriptor } from "@my-react-dom-server/renderDispatch";
import { checkRoot, createControlPromise, initServer, startRenderAsync, wrapperFunc } from "@my-react-dom-shared";

type RenderToReadableStreamOptions = {
  identifierPrefix?: string;
  namespaceURI?: string;
  nonce?: string;
  bootstrapScriptContent?: string;
  bootstrapScripts?: Array<string | BootstrapScriptDescriptor>;
  bootstrapModules?: Array<string | BootstrapScriptDescriptor>;
  progressiveChunkSize?: number;
  signal?: AbortSignal;
  onError?: (error: unknown) => void;
  onPostpone?: (reason: string) => void;
};

type ReactDOMServerReadableStream = ReadableStream & {
  allReady: Promise<void>;
};

export const renderToReadableStream = wrapperFunc((element: LikeJSX, options?: RenderToReadableStreamOptions): Promise<ReactDOMServerReadableStream> => {
  if (isValidElement(element)) {
    initServer();

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new LatestServerStreamDispatch(container, fiber, element);

    options?.onError && (renderDispatch.onError = options.onError);

    renderDispatch.bootstrapModules = options?.bootstrapModules;

    renderDispatch.bootstrapScripts = options?.bootstrapScripts;

    renderDispatch.bootstrapScriptContent = options?.bootstrapScriptContent;

    renderDispatch.isServerRender = true;

    const encoder = new TextEncoder();

    let canceled = false;

    initialFiberNode(fiber, renderDispatch);

    return new Promise<ReactDOMServerReadableStream>((resolve, reject) => {
      const { promise, resolve: _resolve, reject: _reject } = createControlPromise();

      const stream = new ReadableStream({
        start: (controller) => {
          const internalStream = {
            push: (chunk: string) => {
              if (canceled) return;
              if (chunk) {
                controller.enqueue(encoder.encode(chunk));
              }
            },
            destroy: (error) => {
              controller.error(error);
            },
          };
          const onAllReady = () => {
            controller.close();
            _resolve();
          };

          const onShellReady = () => {
            resolve(stream);
          };

          const onShellError = (error: unknown) => {
            reject(error);
            _reject(error as Error);
          };

          renderDispatch.stream = internalStream;

          renderDispatch.onAllReady = onAllReady;

          renderDispatch.onShellReady = onShellReady;

          renderDispatch.onShellError = onShellError;

          startRenderAsync(fiber, renderDispatch);
        },
        cancel: () => {
          canceled = true;
        },
      }) as ReactDOMServerReadableStream;

      stream.allReady = promise;
    });
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToReadableStream' can only render a '@my-react' element`);
  }
});
