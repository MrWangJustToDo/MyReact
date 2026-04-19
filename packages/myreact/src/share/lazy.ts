import { enableDebugFiled } from "./env";

import type { lazy, LazyType } from "../element";

const Uninitialized = -1;
const Pending = 0;
const Resolved = 1;
const Rejected = 2;

type LazyPayload<T> = {
  _status: typeof Uninitialized | typeof Pending | typeof Resolved | typeof Rejected;
  _result: (() => Promise<{ default: T } | T>) | Promise<{ default: T } | T> | { default: T } | T | unknown;
};

type Lazy = ReturnType<typeof lazy>;

const getExport = <T>(moduleResult: { default: T }): T => {
  if (moduleResult?.default) return moduleResult.default;
  return moduleResult as T;
};

function lazyInitializer<T>(payload: LazyPayload<T>, lazyEle: Lazy): T {
  let throwFun: () => Promise<any> = () => Promise.reject("This error should not be happen, look like a bug for @my-react");

  if (payload._status === Uninitialized) {
    const ctor = payload._result as () => Promise<{ default: T } | T>;

    const thenable = ctor();

    throwFun = () => thenable;

    thenable.then(
      (moduleObject) => {
        if (payload._status === Pending || payload._status === Uninitialized) {
          payload._status = Resolved;
          payload._result = moduleObject;
        }
      },
      (error) => {
        if (payload._status === Pending || payload._status === Uninitialized) {
          payload._status = Rejected;
          payload._result = error;
        }
      }
    );

    if (!lazyEle._loaded) {
      const enableDevDebug = __DEV__ && enableDebugFiled.current;
      if (enableDevDebug) {
        lazyEle._debugCreateTime = Date.now();
      }
      lazyEle._loading = true;
      thenable
        .then(getExport)
        .then((render) => {
          lazyEle.render = render as unknown as Lazy["render"];
        })
        .catch((error) => {
          lazyEle._error = error;
        })
        .finally(() => {
          lazyEle._loading = false;
          lazyEle._loaded = true;
          if (enableDevDebug) {
            lazyEle._debugCreateTime = Date.now();
          }
        });
    }

    if (payload._status === Uninitialized) {
      payload._status = Pending;
      payload._result = thenable;
    }
  }

  if (payload._status === Resolved) {
    return getExport(payload._result as { default: T });
  } else {
    // 有点奇怪 rsc 需要 _result 解包的内容，可能有其他遗漏
    // throw payload._result;
    throw throwFun().then(getExport);
  }
}

/**
 * @internal
 * Assigns React-compatible _payload and _init fields to a MyReact lazy element
 * for RSC (React Server Components) flow serialization compatibility.
 */
export const assignLazy = <P extends Record<string, unknown>>(lazyElement: LazyType<P>) => {
  const payload: LazyPayload<unknown> = {
    _status: Uninitialized,
    _result: lazyElement.loader,
  };

  const init = (payload: LazyPayload<unknown>) => lazyInitializer(payload, lazyElement);

  Object.assign(lazyElement, {
    _payload: payload,
    _init: init,
  });

  return lazyElement as LazyType<P> & {
    _payload: LazyPayload<unknown>;
    _init: typeof init;
  };
};
