/* eslint-disable max-lines */
import { ForwardRef, Memo, STATE_TYPE, TYPEKEY } from "@my-react/react-shared";

import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactComponentType, MyReactElementType } from "@my-react/react";
import type { CustomRenderDispatch, CustomRenderDispatchDev, HMR, MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react-reconciler";

const DISPATCH_FIELD = "__@my-react/dispatch__";

const DEV_REFRESH_FIELD = "__@my-react/react-refresh__";

const DEV_TOOL_FIELD = "__@my-react/react-refresh-dev__";

let hmrRuntime: HMR[];

type Family = {
  current: MyReactComponentType;
};

type Signature = {
  key: string;
  forceReset: boolean;
  getCustomHooks: () => any[];

  fullKey?: string;
};

type HMRGlobal = {
  [DISPATCH_FIELD]: CustomRenderDispatch[];
  [DEV_REFRESH_FIELD]: (dispatchArray: CustomRenderDispatch[]) => void;
  [DEV_TOOL_FIELD]: {
    allFamiliesByID: typeof allFamiliesByID;
    allSignaturesByType: typeof allSignaturesByType;
    updatedFamiliesByType: typeof updatedFamiliesByType;
  };
};

const typedSelf = globalThis as unknown as HMRGlobal;

const pendingUpdates: Array<[Family, MyReactComponentType]> = [];

const allFamiliesByID = new Map<string, Family>();

const allFamiliesByType = new WeakMap<MyReactComponentType, Family>();

const allSignaturesByType = new WeakMap<MyReactComponentType, Signature>();

const updatedFamiliesByType = new WeakMap<MyReactComponentType, Family>();

const getProperty = (object: Record<string, unknown>, property: string) => {
  try {
    return object[property];
  } catch (err) {
    // Intentionally ignore.
    return undefined;
  }
};

const computeFullKey = (signature: Signature) => {
  let fullKey = signature.key;
  let hooks;

  try {
    hooks = signature.getCustomHooks();
  } catch (err) {
    signature.forceReset = true;
    return fullKey;
  }

  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (typeof hook !== "function") {
      signature.forceReset = true;
      return fullKey;
    }

    const nestedHookSignature = allSignaturesByType.get(hook);
    if (nestedHookSignature === undefined) continue;

    const nestedHookKey = computeFullKey(nestedHookSignature);
    if (nestedHookSignature.forceReset) signature.forceReset = true;

    fullKey += "\n---\n" + nestedHookKey;
  }

  return fullKey;
};

const haveEqualSignatures = (prevType: MyReactComponentType, nextType: MyReactComponentType) => {
  const prevSignature = allSignaturesByType.get(prevType);
  const nextSignature = allSignaturesByType.get(nextType);

  if (prevSignature === undefined && nextSignature === undefined) {
    return true;
  }
  if (prevSignature === undefined || nextSignature === undefined) {
    return false;
  }
  if (computeFullKey(prevSignature) !== computeFullKey(nextSignature)) {
    return false;
  }
  if (nextSignature.forceReset) {
    return false;
  }

  return true;
};

// check memo | forwardRef | function
const hasEqualType = (prevType: MyReactComponentType, nextType: MyReactComponentType) => {
  if (prevType === nextType) {
    return true;
  }

  if (typeof prevType !== typeof nextType) {
    return false;
  } else {
    if (typeof prevType === "object" && typeof nextType === "object") {
      return (
        getProperty(prevType, TYPEKEY) === getProperty(nextType, TYPEKEY) &&
        hasEqualType(prevType.render as MyReactComponentType, nextType.render as MyReactComponentType)
      );
    }
  }

  return true;
};

const getRenderTypeFormType = (type: MyReactComponentType): MixinMyReactClassComponent | MixinMyReactFunctionComponent | null => {
  if (!type) {
    console.error(`[@my-react/react-refresh] can not get the real type for current render, it is a bug for @my-react/react-refresh`);
    return null;
  }

  if (typeof type === "object") {
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
      case Memo:
        return getRenderTypeFormType(type.render as MyReactComponentType);
      default:
        return null;
    }
  }

  if (typeof type === "function") {
    return type;
  }

  return null;
};

const isMyReactClass = (type: MyReactComponentType) => {
  if (typeof type === "function") {
    return type.prototype && type.prototype.isMyReactComponent;
  } else {
    return false;
  }
};

const canPreserveStateBetween = (prevType: MyReactComponentType, nextType: MyReactComponentType) => {
  if (isMyReactClass(prevType) || isMyReactClass(nextType)) {
    return false;
  }
  if (hasEqualType(prevType, nextType) && haveEqualSignatures(prevType, nextType)) {
    return true;
  }
  return false;
};

const resolveFamily = (type: MyReactComponentType) => {
  return updatedFamiliesByType.get(type);
};

export const getFamilyByID = (id: string) => {
  return allFamiliesByID.get(id);
};

export const getFamilyByType = (type: MyReactComponentType) => {
  return allFamiliesByType.get(type);
};

export const setSignature = (type: MyReactComponentType, key: string, forceReset: boolean, getCustomHooks: Signature["getCustomHooks"]) => {
  if (!type) return;

  if (!allSignaturesByType.has(type)) {
    allSignaturesByType.set(type, {
      key,
      forceReset,
      getCustomHooks: getCustomHooks || (() => []),
    });
  }

  if (typeof type === "object" && type !== null) {
    // see @my-react/react element/feature.ts
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
      case Memo:
        setSignature(type.render as MyReactComponentType, key, forceReset, getCustomHooks);
        break;
    }
  }
};

export const collectCustomHooksForSignature = (type: MyReactComponentType) => {
  const signature = allSignaturesByType.get(type);
  if (signature) {
    signature.fullKey = computeFullKey(signature);
  }
};

export const register = (type: MyReactComponentType, id: string) => {
  if (type === null) {
    return;
  }
  if (typeof type !== "function" && typeof type !== "object") {
    return;
  }

  if (allFamiliesByType.has(type)) return;

  let family = allFamiliesByID.get(id);

  if (family === undefined) {
    family = { current: type };

    allFamiliesByID.set(id, family);
  } else {
    pendingUpdates.push([family, type]);
  }

  allFamiliesByType.set(type, family);

  if (typeof type === "object" && type !== null) {
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
        register(type.render as MyReactComponentType, id + "$forwardRef");
        break;
      case Memo:
        register(type.render as MyReactComponentType, id + "$memo");
        break;
    }
  }
};

export const createSignatureFunctionForTransform = () => {
  let savedType: MyReactComponentType | null = null;
  let hasCustomHooks = false;
  let didCollectHooks = false;
  return (type: MyReactComponentType, key: string, forceReset: boolean, getCustomHooks: Signature["getCustomHooks"]) => {
    // call with argument
    if (typeof key === "string") {
      if (!savedType) {
        savedType = type;
        hasCustomHooks = typeof getCustomHooks === "function";
      }

      if (type != null && (typeof type === "function" || typeof type === "object")) {
        setSignature(type, key, forceReset, getCustomHooks);
      }
      return type;
    } else {
      // call without argument, only happen in the component
      if (!didCollectHooks && hasCustomHooks) {
        didCollectHooks = true;
        collectCustomHooksForSignature(savedType);
      }
    }
  };
};

export const performReactRefresh = () => {
  if (!pendingUpdates.length) return;

  if (hmrRuntime.length === 0) {
    console.log(`[@my-react/react-refresh] try to refresh current App failed, current environment not have a valid HMR runtime`);
    return;
  }

  const allPending = pendingUpdates.slice(0);

  pendingUpdates.length = 0;

  const containers: Map<CustomRenderDispatch, boolean> = new Map();

  allPending.forEach(([family, _nextType]) => {
    const _prevType = family.current;

    const prevType = getRenderTypeFormType(_prevType);

    const nextType = getRenderTypeFormType(_nextType);

    if (prevType && nextType) {
      let fibers: Set<MyReactFiberNode> | null = null;

      hmrRuntime.forEach((i) => {
        try {
          fibers = fibers || i.getCurrentFibersFromType(prevType);
        } catch {
          void 0;
        }
      });

      updatedFamiliesByType.set(prevType, family);

      updatedFamiliesByType.set(_nextType, family);

      family.current = _nextType;

      if (fibers?.size) {
        const forceReset = !canPreserveStateBetween(_prevType, _nextType);

        fibers.forEach((f) => {
          let container: CustomRenderDispatchDev | null = null;

          hmrRuntime.forEach((i) => {
            try {
              container = container || (i.getCurrentDispatchFromFiber(f) as CustomRenderDispatchDev);
            } catch {
              void 0;
            }
          });

          if (!container) return;

          const hasRootUpdate = containers.get(container) || f === container.rootFiber;

          container.__hmr_runtime__?.hmr?.(f, _nextType, forceReset);

          containers.set(container, hasRootUpdate);
        });
      }
    }
  });

  if (containers.size === 0) {
    // try to refresh all the containers
    const allContainers = typedSelf[DISPATCH_FIELD];
    allContainers.forEach((container) => {
      containers.set(container, true);
    });
  }

  if (containers.size > 0) {
    console.log(`[@my-react/react-refresh] updating ...`);

    console.time(`[@my-react/react-refresh] update take`);

    let count = 0;

    const updateDone = () => {
      count++;

      if (count === containers.size) {
        console.timeEnd(`[@my-react/react-refresh] update take`);
      }
    };

    containers.forEach((hasRootUpdate, container: CustomRenderDispatchDev) => {
      if (container.isAppCrashed || container.isAppUnmounted) {
        // have a uncaught runtime error for prev render
        container.__hmr_remount__?.(updateDone);
      } else if (container.runtimeFiber.errorCatchFiber) {
        // has a error for prev render
        const errorCatchFiber = container?.runtimeFiber.errorCatchFiber;

        (errorCatchFiber as MyReactFiberNodeDev).__hmr_revert__?.(updateDone);
      } else {
        const rootFiber = container.rootFiber;

        (rootFiber as MyReactFiberNodeDev).__hmr_update__?.(hasRootUpdate ? STATE_TYPE.__triggerSync__ : STATE_TYPE.__skippedSync__, updateDone);
      }
      setRefreshRuntimeFieldForDev(container);
    });
  } else {
    console.log(`[@my-react/react-refresh] nothing need to update, you may need a full reload to get the effect`);
  }
};

export const isLikelyComponentType = (type: MyReactElementType) => {
  switch (typeof type) {
    case "function": {
      // First, deal with classes.
      if (type.prototype != null) {
        if (type.prototype.isMyReactComponent) {
          // React class.
          return true;
        }
        const ownNames = Object.getOwnPropertyNames(type.prototype);
        if (ownNames.length > 1 || ownNames[0] !== "constructor") {
          // This looks like a class.
          return false;
        }
        if (type.prototype.__proto__ !== Object.prototype) {
          // It has a superclass.
          return false;
        }
        // Pass through.
        // This looks like a regular function with empty prototype.
      }
      // For plain functions and arrows, use name as a heuristic.
      const name = type.name || type.displayName;
      return typeof name === "string" && /^[A-Z]/.test(name);
    }
    case "object": {
      if (type != null) {
        switch (getProperty(type, TYPEKEY)) {
          case ForwardRef:
          case Memo:
            // Definitely React components.
            return true;
          default:
            return false;
        }
      }
      return false;
    }
    default: {
      return false;
    }
  }
};

const setRefreshRuntimeFieldForDev = (container: CustomRenderDispatch) => {
  if (Object.prototype.hasOwnProperty.call(container, "__refresh_runtime__")) {
    return;
  }
  Object.defineProperty(container, "__refresh_runtime__", {
    value: {
      register,
      setSignature,
      getFamilyByID,
      getFamilyByType,
      performReactRefresh,
      isLikelyComponentType,
      collectCustomHooksForSignature,
      createSignatureFunctionForTransform,
    },
  });
};

let hasInjected = false;

const setupRefresh = (dispatchArray: CustomRenderDispatch[]) => {
  if (hasInjected) return;

  const typedDispatchArray = dispatchArray as CustomRenderDispatchDev[];

  const allHMRRuntime = typedDispatchArray.map((item) => item?.["__hmr_runtime__"]);

  allHMRRuntime.forEach((c, i) => {
    const n = allHMRRuntime[i + 1];
    if (n && c?.hmr !== n?.hmr) {
      console.warn(
        `[@my-react/react-refresh] find multiple HMR runtime in current environment, look like you are using multiple version of @my-react for current page, it may cause some problem!`
      );
    }
  });

  if (allHMRRuntime.length > 0) {
    hmrRuntime = allHMRRuntime;

    const setRefreshHandler = new Set(hmrRuntime.map((i) => i.setRefreshHandler));

    setRefreshHandler.forEach((item) => {
      item(resolveFamily);
    });

    dispatchArray.forEach((dispatch) => setRefreshRuntimeFieldForDev(dispatch));

    console.log(`%c[@my-react/react-refresh] Dev refresh have been enabled!`, "color: #38B2AC; font-size: 14px;");

    hasInjected = true;

    delete typedSelf[DEV_REFRESH_FIELD];
  } else {
    console.error(`%c[@my-react/react-refresh] inject Dev refresh failed!`, "color: red; font-size: 14px;");
  }
};

const tryToRegister = () => {
  if (__DEV__) {
    try {
      typedSelf[DEV_REFRESH_FIELD] = setupRefresh;
      if (Array.isArray(typedSelf?.[DISPATCH_FIELD])) {
        setupRefresh(typedSelf[DISPATCH_FIELD]);
      }
    } catch {
      console.error(`%c[@my-react/react-refresh] inject Dev refresh failed!`, "color: red; font-size: 14px;");
    }
  }
};

export const injectIntoGlobalHook = (_context: Window) => setTimeout(tryToRegister, 0);

export const version = __VERSION__;

if (__DEV__) {
  typedSelf[DEV_TOOL_FIELD] = {
    allFamiliesByID,
    allSignaturesByType,
    updatedFamiliesByType,
  };
} else {
  console.warn("[@my-react/react-refresh] current environment is not in development mode!");
}
