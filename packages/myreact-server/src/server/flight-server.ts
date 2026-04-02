import { createFromReadableStream, createFromFetch } from "@lazarv/rsc/client";
import { __my_react_internal__, createElement, Suspense, use } from "@my-react/react";
import { renderToReadableStream } from "@my-react/react-dom/server";

import { createModuleLoader } from "../client/module-loader";
import { normalizeRscValue } from "../shared/normalize-rsc";

import type { FlightServerOptions, ModuleLoader } from "../shared/types";
import type { MyReactElement } from "@my-react/react";

const { cacheLazy } = __my_react_internal__;

export interface FlightServer {
  renderToStream(rscStream: ReadableStream<Uint8Array>): ReturnType<typeof renderToReadableStream>;
  createFromStream(stream: ReadableStream<Uint8Array>): Promise<unknown>;
  createFromFetch(responsePromise: Promise<Response>): Promise<unknown>;
}

export function createFlightServer(options: FlightServerOptions = {}): FlightServer {
  const moduleLoader: ModuleLoader = options.moduleLoader || createModuleLoader();
  const resolveModuleId = options.resolveModuleId ?? ((id: string) => id);

  function createFromStreamInternal(stream: ReadableStream<Uint8Array>): Promise<unknown> {
    const result = createFromReadableStream(stream, {
      moduleLoader: wrapModuleLoader(moduleLoader, resolveModuleId),
    }) as Promise<unknown>;
    return wrapPromiseWithState(result, moduleLoader);
  }

  function createFromFetchInternal(responsePromise: Promise<Response>): Promise<unknown> {
    const fetchFn = createFromFetch as unknown as (promise: Promise<Response>, options?: { moduleLoader: ModuleLoader }) => Promise<unknown>;
    const result = fetchFn(responsePromise, {
      moduleLoader: wrapModuleLoader(moduleLoader, resolveModuleId),
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

    return renderToReadableStream(shell);
  }

  return {
    renderToStream,
    createFromStream: createFromStreamInternal,
    createFromFetch: createFromFetchInternal,
  };
}

function wrapModuleLoader(loader: ModuleLoader, resolveModuleId: (id: string) => string): ModuleLoader {
  return {
    requireModule(metadata) {
      return loader.requireModule({ ...metadata, id: resolveModuleId(metadata.id) });
    },
    preloadModule(metadata) {
      return loader.preloadModule?.({ ...metadata, id: resolveModuleId(metadata.id) });
    },
    loadServerAction(id) {
      return loader.loadServerAction?.(id);
    },
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
      isServerSide: true,
      moduleLoader,
      wrapPendingPromise: (promise) => createElement(cacheLazy(promise as Promise<any>)),
    })
  );
  const promiseWithState = normalizedPromise as PromiseWithState<unknown>;

  promiseWithState.status = "pending";
  promiseWithState._value = undefined;
  promiseWithState._reason = undefined;

  promiseWithState.then(
    (resolved) => {
      promiseWithState.status = "fulfilled";
      promiseWithState._value = resolved;
    },
    (error) => {
      promiseWithState.status = "rejected";
      promiseWithState._reason = error;
    }
  );

  return promiseWithState;
}
