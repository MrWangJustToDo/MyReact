import { isValidElement, lazy } from "@my-react/react";
import { Lazy as REACT_LAZY_TYPE, isPromise } from "@my-react/react-shared";

import { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "./types";

import type { ModuleLoader, ClientReferenceMetadata } from "./types";

type PromiseWithState<T> = Promise<T> & {
  status?: "pending" | "fulfilled" | "rejected";
  _value?: T;
  _reason?: unknown;
};

type NormalizeOptions = {
  inChildren?: boolean;
  isServerSide?: boolean;
  isClientSide?: boolean;
  moduleLoader: ModuleLoader;
  wrapPendingPromise?: (promise: PromiseWithState<unknown>) => unknown;
};

// we need this because the different between react tree from @my-react tree
export function normalizeRscValue(value: unknown, options: NormalizeOptions): unknown {
  const { inChildren } = options;

  if (isPromise(value)) {
    if (!inChildren) return value;
    const promiseValue = value as PromiseWithState<unknown>;
    if (options.wrapPendingPromise) {
      return options.wrapPendingPromise(promiseValue);
    }
    return value;
  }

  if (Array.isArray(value)) {
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
    const loader = (async () => {
      try {
        return await typed._init!(typed._payload);
      } catch (error) {
        if (error && typeof (error as { then?: unknown }).then === "function") {
          return await (error as Promise<unknown>);
        }
        throw error;
      }
    }) as unknown as () => Promise<any>;

    loader["$$rsc"] = typed;

    return lazy(loader) as unknown as ReturnType<typeof lazy>;
  }

  if (typed.$$typeof === CLIENT_REFERENCE_SYMBOL) {
    const metadata = typed.$$metadata ?? { id: typed.$$id ?? "", name: typed.$$name ?? "default" };
    const loader = (async () => {
      const result = await options.moduleLoader.requireModule(metadata as ClientReferenceMetadata);
      const exportName = metadata.name || "default";
      return typeof result === "object" && result !== null
        ? ((result as Record<string, unknown>)[exportName] ?? (result as Record<string, unknown>).default ?? result)
        : result;
    }) as unknown as () => Promise<any>;

    loader["$$rsc"] = typed;

    loader["displayName"] = "$$ClientResolve";

    return lazy(loader) as unknown as ReturnType<typeof lazy>;
  }

  if (options.isServerSide) {
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
  }

  return type;
}
