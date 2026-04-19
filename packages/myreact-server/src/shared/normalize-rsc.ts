import { isValidElement, lazy } from "@my-react/react/type";
import { Lazy as REACT_LAZY_TYPE, isPromise, TRANSITIONAL_ELEMENT } from "@my-react/react-shared";

import { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "./types";

import type { ModuleLoader, ClientReferenceMetadata } from "./types";

type PromiseWithState<T> = Promise<T> & {
  status?: "pending" | "fulfilled" | "rejected";
  _value?: T;
  _reason?: unknown;
};

type NormalizeOptions = {
  inChildren?: boolean;
  moduleLoader: ModuleLoader;
  wrapPendingPromise?: (promise: PromiseWithState<unknown>) => unknown;
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
  // Handle string type references like "$L<moduleId>#<exportName>"
  if (typeof type === "string") {
    // $L reference with inline format: $Lmodule/path.js#exportName
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

      // Raw numeric reference like "$L8" - this is a Flight protocol internal ID
      // that should have been resolved by @lazarv/rsc. If we see it here,
      // the stream processing is still pending. Return a lazy wrapper that
      // will render null/fallback until the reference is resolved.
      if (__DEV__) {
        console.warn(`[@my-react/react-server] Unresolved lazy reference: ${type}`);
      }
      // Return a placeholder component to avoid rendering "$L8" as DOM tag
      return () => null;
    }

    return type;
  }

  if (!type || typeof type !== "object") {
    return type;
  }

  const typed = type as {
    $$typeof?: symbol;
    _payload?: unknown;
    _init?: (payload: unknown) => unknown;
    loader?: unknown;
    $$id?: string;
    $$name?: string;
    $$metadata?: ClientReferenceMetadata;
  };

  if (typed.$$typeof === REACT_LAZY_TYPE && typeof typed.loader !== "function" && typeof typed._init === "function") {
    // This is a lazy wrapper from @lazarv/rsc
    const payload = typed._payload as {
      status?: number;
      value?: {
        $$typeof?: symbol;
        $$id?: string;
        $$metadata?: ClientReferenceMetadata;
      };
      promise?: Promise<unknown>;
    };

    // Handle resolved client reference
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

    // Handle pending lazy - wait for promise and then load
    if (payload?.promise) {
      const lazyLoader = (async () => {
        await payload.promise;

        if (payload.value?.$$typeof === CLIENT_REFERENCE_SYMBOL && payload.value.$$metadata) {
          const metadata = payload.value.$$metadata;
          const result = await options.moduleLoader.requireModule(metadata);
          const exportName = metadata.name || "default";
          return typeof result === "object" && result !== null
            ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
            : result;
        }

        return typed._init!(typed._payload);
      }) as unknown as () => Promise<any>;

      lazyLoader["displayName"] = `$$LazyClientPending`;
      return lazy(lazyLoader) as unknown as ReturnType<typeof lazy>;
    }

    // Fallback: use original init
    const lazyLoader = (async () => typed._init!(typed._payload)) as unknown as () => Promise<any>;
    return lazy(lazyLoader) as unknown as ReturnType<typeof lazy>;
  }

  if (typed.$$typeof === CLIENT_REFERENCE_SYMBOL) {
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
