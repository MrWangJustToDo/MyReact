import { isValidElement, type LikeJSX } from "@my-react/react";
import { initialFiberNode, MyReactFiberNode } from "@my-react/react-reconciler";

import { ContainerElement } from "@my-react-dom-server/api";
import { LatestServerStreamDispatch, type BootstrapScriptDescriptor } from "@my-react-dom-server/renderDispatch";
import { prepareRenderPlatform } from "@my-react-dom-server/renderPlatform";
import { checkRoot, startRenderAsync } from "@my-react-dom-shared";

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

export const renderToReadableStream = (element: LikeJSX, options?: RenderToReadableStreamOptions): ReadableStream => {
  if (isValidElement(element)) {
    prepareRenderPlatform();

    const container = new ContainerElement();

    const fiber = new MyReactFiberNode(element);

    __DEV__ && checkRoot(fiber);

    const renderDispatch = new LatestServerStreamDispatch(container, fiber);

    options?.onError && (renderDispatch.onError = options.onError);

    renderDispatch.bootstrapModules = options?.bootstrapModules;

    renderDispatch.bootstrapScripts = options?.bootstrapScripts;

    renderDispatch.bootstrapScriptContent = options?.bootstrapScriptContent;

    renderDispatch.isServerRender = true;

    const encoder = new TextEncoder();

    let canceled = false;

    const stream = new ReadableStream({
      start: (controller) => {
        const internalStream = {
          push: (chunk: string) => {
            if (canceled) return;
            if (chunk !== null) {
              controller.enqueue(encoder.encode(chunk));
            }
          },
          destroy: (error) => {
            controller.error(error);
          },
        };
        const onAllReady = () => {
          controller.close();
        };

        renderDispatch.stream = internalStream;

        renderDispatch.onAllReady = onAllReady;

        startRenderAsync(fiber, renderDispatch);
      },
      cancel: () => {
        canceled = true;
      },
    });

    initialFiberNode(fiber, renderDispatch);

    return stream;
  } else {
    throw new Error(`[@my-react/react-dom] 'renderToReadableStream' can only render a '@my-react' element`);
  }
};
