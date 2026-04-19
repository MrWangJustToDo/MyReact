import { createFromReadableStream, createFromFetch } from "@lazarv/rsc/client";
import { __my_react_internal__, createElement, Suspense, use } from "@my-react/react/type";

import { createModuleLoader } from "../client/module-loader";
import { normalizeRscValue } from "../shared/normalize-rsc";

import type { FlightServerOptions, ModuleLoader } from "../shared/types";
import type { MyReactElement } from "@my-react/react/type";
import type { renderToReadableStream } from "@my-react/react-dom/server";
import type { ReactNode } from "react";

const { cacheLazy } = __my_react_internal__;

export interface FlightServer {
  renderToStream(rscStream: ReadableStream<Uint8Array>): ReturnType<typeof renderToReadableStream>;
  createFromStream(stream: ReadableStream<Uint8Array>): Promise<unknown>;
  createFromFetch(responsePromise: Promise<Response>): Promise<unknown>;
}

export async function createFlightServer(options: FlightServerOptions = {}): Promise<FlightServer> {
  const { renderToReadableStream } = await import("@my-react/react-dom/server");

  const moduleLoader: ModuleLoader = options.moduleLoader || createModuleLoader();

  function createFromStreamInternal(stream: ReadableStream<Uint8Array>): Promise<unknown> {
    const result = createFromReadableStream(stream, {
      moduleLoader,
    }) as Promise<unknown>;
    return wrapPromiseWithState(result, moduleLoader);
  }

  function createFromFetchInternal(responsePromise: Promise<Response>): Promise<unknown> {
    const fetchFn = createFromFetch as unknown as (promise: Promise<Response>, options?: { moduleLoader: ModuleLoader }) => Promise<unknown>;
    const result = fetchFn(responsePromise, {
      moduleLoader,
    });
    return wrapPromiseWithState(result, moduleLoader);
  }

  function renderToStream(rscStream: ReadableStream<Uint8Array>) {
    // Get the element tree from the Flight stream
    const payloadPromise = createFromStreamInternal(rscStream);

    function SsrRoot() {
      const ele = use(payloadPromise) as MyReactElement;

      return ele;
    }

    const shell = createElement(Suspense, { fallback: createElement("div", { className: "loading" }, "Loading...") }, createElement(SsrRoot));

    return renderToReadableStream(shell as ReactNode);
  }

  return {
    renderToStream,
    createFromStream: createFromStreamInternal,
    createFromFetch: createFromFetchInternal,
  };
}

type PromiseWithState<T> = Promise<T> & {
  status?: "pending" | "fulfilled" | "rejected";
  _value?: T;
  _reason?: unknown;
};

function wrapPromiseWithState(value: Promise<unknown>, moduleLoader: ModuleLoader): PromiseWithState<unknown> {
  const normalizedPromise = Promise.resolve(value).then((resolved) =>
    normalizeRscValue(resolved, {
      moduleLoader,
      wrapPendingPromise: (promise) => createElement(cacheLazy(promise as Promise<any>)),
    })
  );
  const promiseWithState = normalizedPromise as PromiseWithState<unknown>;

  return promiseWithState;
}
