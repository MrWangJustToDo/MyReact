import { isValidElement, lazy } from "@my-react/react/type";
import { Lazy as REACT_LAZY_TYPE, isPromise, TRANSITIONAL_ELEMENT } from "@my-react/react-shared";

import { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "./types";

import type { FlightChunkRegistry } from "./flight-chunk-registry";
import type { ModuleLoader, ClientReferenceMetadata } from "./types";

type PromiseWithState<T> = Promise<T> & {
  status?: "pending" | "fulfilled" | "rejected";
  _value?: T;
  _reason?: unknown;
};

type NormalizeOptions = {
  inChildren?: boolean;
  moduleLoader: ModuleLoader;
  /** Parallel I-row scan — lets `$L<id>` loaders await chunk binding */
  flightChunks?: FlightChunkRegistry;
  wrapPendingPromise?: (promise: PromiseWithState<unknown>) => unknown;
};

type LazarvLazyWrapper = {
  $$typeof?: symbol;
  _payload?: unknown;
  _init?: (payload: unknown) => unknown;
  loader?: unknown;
  $$id?: string;
  $$name?: string;
  $$metadata?: ClientReferenceMetadata;
};

const REACT_TRANSITIONAL_ELEMENT_TYPE = TRANSITIONAL_ELEMENT;

function isElementTuple(value: unknown): value is [string, unknown, unknown, Record<string, unknown>] {
  return Array.isArray(value) && value.length >= 3 && value[0] === "$";
}

function convertElementTupleToElement(tuple: [string, unknown, unknown, Record<string, unknown>], options: NormalizeOptions): unknown {
  const [, type, key, props] = tuple;
  const normalizedType = normalizeRscType(type, options);
  const normalizedProps = props ? (normalizeRscValue(props, { ...options, inChildren: false }) as Record<string, unknown>) : {};

  if ("children" in normalizedProps) {
    normalizedProps.children = normalizeRscValue(normalizedProps.children, { ...options, inChildren: true });
  }

  const element = {
    $$typeof: REACT_TRANSITIONAL_ELEMENT_TYPE,
    type: normalizedType,
    key: key ?? null,
    ref: normalizedProps.ref ?? null,
    props: normalizedProps,
  };

  if (__DEV__) {
    (element as Record<string, unknown>)._rsc = true;
  }

  return element;
}

/**
 * @lazarv/rsc createLazyWrapper returns a *callable function* with
 * `$$typeof: react.lazy` + `_init`/`_payload`. MyReact only understands its own
 * `lazy({ loader })` shape — convert before render.
 *
 * `_init` may throw a thenable while the Flight chunk is PENDING (React Suspense protocol).
 */
async function runLazarvInit(init: (payload: unknown) => unknown, payload: unknown): Promise<unknown> {
  for (;;) {
    try {
      return init(payload);
    } catch (thrown) {
      if (isPromise(thrown)) {
        await thrown;
        continue;
      }
      throw thrown;
    }
  }
}

function toMyReactLazyFromLazarv(typed: LazarvLazyWrapper, options: NormalizeOptions): unknown {
  const payload = typed._payload as {
    status?: number;
    value?: {
      $$typeof?: symbol;
      $$id?: string;
      $$metadata?: ClientReferenceMetadata;
    };
    promise?: Promise<unknown>;
    _modulePromise?: Promise<unknown>;
  };

  if (payload?.value?.$$typeof === CLIENT_REFERENCE_SYMBOL && payload.value.$$metadata) {
    const metadata = payload.value.$$metadata;
    const lazyLoader = (async () => {
      const result = await options.moduleLoader.requireModule(metadata);
      const exportName = metadata.name || "default";
      return typeof result === "object" && result !== null
        ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
        : result;
    }) as unknown as () => Promise<any>;

    lazyLoader["displayName"] = `$$LazyClient(${metadata.id}#${metadata.name})`;
    return lazy(lazyLoader) as unknown as ReturnType<typeof lazy>;
  }

  if (payload?.promise || payload?._modulePromise || typeof typed._init === "function") {
    const lazyLoader = (async () => {
      if (payload?.promise) {
        await payload.promise;
      }
      if (payload?._modulePromise) {
        await payload._modulePromise;
      }

      if (payload?.value?.$$typeof === CLIENT_REFERENCE_SYMBOL && payload.value.$$metadata) {
        const metadata = payload.value.$$metadata;
        const result = await options.moduleLoader.requireModule(metadata);
        const exportName = metadata.name || "default";
        return typeof result === "object" && result !== null
          ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
          : result;
      }

      if (typeof typed._init === "function") {
        return runLazarvInit(typed._init, typed._payload);
      }

      return payload?.value;
    }) as unknown as () => Promise<any>;

    lazyLoader["displayName"] = `$$LazyClientPending`;
    return lazy(lazyLoader) as unknown as ReturnType<typeof lazy>;
  }

  const lazyLoader = (async () => (typeof typed._init === "function" ? runLazarvInit(typed._init, typed._payload) : typed)) as unknown as () => Promise<any>;
  return lazy(lazyLoader) as unknown as ReturnType<typeof lazy>;
}

function toMyReactLazyFromClientRef(typed: LazarvLazyWrapper, options: NormalizeOptions): unknown {
  const metadata = typed.$$metadata ?? { id: typed.$$id ?? "", name: typed.$$name ?? "default" };
  const lazyLoader = (async () => {
    const result = await options.moduleLoader.requireModule(metadata as ClientReferenceMetadata);
    const exportName = metadata.name || "default";
    return typeof result === "object" && result !== null
      ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
      : result;
  }) as unknown as () => Promise<any>;

  lazyLoader["$$rsc"] = typed;
  lazyLoader["displayName"] = "$$ClientResolve";
  return lazy(lazyLoader) as unknown as ReturnType<typeof lazy>;
}

/**
 * `$L8` is a Flight module-chunk id. Prefer waiting on the teed I-row registry
 * (same binding `@lazarv/rsc` uses) so React.lazy / undigested tuples can resolve.
 */
function toFlightChunkLazy(ref: string, options: NormalizeOptions): unknown {
  const id = Number(ref.slice(2));
  const registry = options.flightChunks;

  if (!registry || !Number.isFinite(id)) {
    const error = new Error(`[@my-react/react-server] Unresolved Flight reference ${ref} (no chunk registry).`);
    if (__DEV__) {
      console.warn(error.message);
    }
    const lazyLoader = (() => Promise.reject(error)) as unknown as () => Promise<any>;
    lazyLoader["displayName"] = `$$UnresolvedFlightRef(${ref})`;
    return lazy(lazyLoader) as unknown as ReturnType<typeof lazy>;
  }

  const lazyLoader = (async () => {
    const value = await registry.waitForChunk(id);

    if (typeof value === "function") {
      return value;
    }

    if (value && typeof value === "object") {
      const typed = value as LazarvLazyWrapper;
      if (typed.$$typeof === CLIENT_REFERENCE_SYMBOL && typed.$$metadata) {
        const metadata = typed.$$metadata;
        const result = await options.moduleLoader.requireModule(metadata);
        const exportName = metadata.name || "default";
        return typeof result === "object" && result !== null
          ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
          : result;
      }
    }

    return value;
  }) as unknown as () => Promise<any>;

  lazyLoader["displayName"] = `$$FlightChunkRef(${ref})`;
  return lazy(lazyLoader) as unknown as ReturnType<typeof lazy>;
}

// we need this because the different between react tree from @my-react tree
export function normalizeRscValue(value: unknown, options: NormalizeOptions): unknown {
  const { inChildren } = options;

  if (isPromise(value)) {
    if (!inChildren) return value;
    const promiseValue = value as PromiseWithState<unknown>;
    if (options.wrapPendingPromise) {
      return options.wrapPendingPromise(promiseValue.then((r) => normalizeRscValue(r, options)));
    }
    return value.then((r) => normalizeRscValue(r, options));
  }

  if (Array.isArray(value)) {
    if (isElementTuple(value)) {
      return convertElementTupleToElement(value, options);
    }
    return value.map((item) => normalizeRscValue(item, options));
  }

  if (isValidElement(value)) {
    const element = value;
    const nextType = normalizeRscType(element.type, options);
    const nextProps = element.props ? normalizeRscValue(element.props, { ...options, inChildren: false }) : element.props;
    const props = (nextProps || {}) as Record<string, unknown>;
    const children = "children" in props ? normalizeRscValue(props.children, { ...options, inChildren: true }) : props.children;
    let ele = element;
    if (nextType !== element.type || children !== props.children || nextProps !== element.props) {
      ele = {
        ...element,
        type: nextType,
        props: { ...props, children },
      };
    }
    if (__DEV__) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ele = { ...ele, _rsc: true };
    }

    return ele;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    let changed = false;
    const next: Record<string, unknown> = {};
    for (const key of Object.keys(record)) {
      const normalized = normalizeRscValue(record[key], options);
      next[key] = normalized;
      if (normalized !== record[key]) {
        changed = true;
      }
    }
    return changed ? next : value;
  }

  return value;
}

function normalizeRscType(type: unknown, options: NormalizeOptions): unknown {
  if (typeof type === "string") {
    if (type.startsWith("$L")) {
      const rest = type.slice(2);
      const hashIndex = rest.indexOf("#");

      if (hashIndex !== -1) {
        const moduleId = rest.slice(0, hashIndex);
        const exportName = rest.slice(hashIndex + 1);

        const loader = (async () => {
          const result = await options.moduleLoader.requireModule({ id: moduleId, name: exportName, chunks: [] });
          return typeof result === "object" && result !== null
            ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
            : result;
        }) as unknown as () => Promise<any>;

        loader["displayName"] = `$$LazyClient(${moduleId}#${exportName})`;

        return lazy(loader) as unknown as ReturnType<typeof lazy>;
      }

      // `$L8` — wait for teed I-row scan to bind the same module chunk
      if (/^\d+$/.test(rest)) {
        return toFlightChunkLazy(type, options);
      }

      if (__DEV__) {
        console.warn(`[@my-react/react-server] Unrecognized $L reference: ${type}`);
      }
      return () => null;
    }

    return type;
  }

  // @lazarv/rsc lazy wrappers are callable functions — must convert before the
  // non-object early return, otherwise MyReact never sees a MyReact `lazy()`.
  if (typeof type === "function") {
    const typed = type as LazarvLazyWrapper;
    if (typed.$$typeof === REACT_LAZY_TYPE && typeof typed.loader !== "function" && typeof typed._init === "function") {
      return toMyReactLazyFromLazarv(typed, options);
    }
    if (typed.$$typeof === CLIENT_REFERENCE_SYMBOL) {
      return toMyReactLazyFromClientRef(typed, options);
    }
    if (typed.$$typeof === SERVER_REFERENCE_SYMBOL) {
      const metadata = typed.$$metadata ?? { id: typed.$$id ?? "", name: typed.$$name ?? "default" };
      const loader = (async () => {
        const result = await options.moduleLoader.requireModule(metadata as ClientReferenceMetadata);
        const exportName = metadata.name || "default";
        return typeof result === "object" && result !== null
          ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
          : result;
      }) as unknown as () => Promise<any>;
      loader["$$rsc"] = typed;
      loader["displayName"] = "$$ServerResolve";
      return lazy(loader) as unknown as ReturnType<typeof lazy>;
    }
    return type;
  }

  if (!type || typeof type !== "object") {
    return type;
  }

  const typed = type as LazarvLazyWrapper;

  if (typed.$$typeof === REACT_LAZY_TYPE && typeof typed.loader !== "function" && typeof typed._init === "function") {
    return toMyReactLazyFromLazarv(typed, options);
  }

  if (typed.$$typeof === CLIENT_REFERENCE_SYMBOL) {
    return toMyReactLazyFromClientRef(typed, options);
  }

  if (typed.$$typeof === SERVER_REFERENCE_SYMBOL) {
    const metadata = typed.$$metadata ?? { id: typed.$$id ?? "", name: typed.$$name ?? "default" };
    const loader = (async () => {
      const result = await options.moduleLoader.requireModule(metadata as ClientReferenceMetadata);
      const exportName = metadata.name || "default";
      return typeof result === "object" && result !== null
        ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
        : result;
    }) as unknown as () => Promise<any>;

    loader["$$rsc"] = typed;
    loader["displayName"] = "$$ServerResolve";
    return lazy(loader) as unknown as ReturnType<typeof lazy>;
  }

  return type;
}
