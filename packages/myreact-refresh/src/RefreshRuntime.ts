import { ForwardRef, Memo, STATE_TYPE, TYPEKEY } from "@my-react/react-shared";

import type { forwardRef, memo, MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElementType } from "@my-react/react";
import type { CustomRenderDispatch, HMR, setRefreshHandler } from "@my-react/react-reconciler";

type Family = {
  current: MyReactComponentType;
};

type Signature = {
  key: string;
  forceReset: boolean;
  getCustomHooks: () => any[];

  fullKey?: string;
};

type MyReactComponentType = ReturnType<typeof forwardRef> | ReturnType<typeof memo> | MixinMyReactClassComponent | MixinMyReactFunctionComponent;

type HMRGlobal = {
  ["__@my-react/hmr__"]: HMR;
  ["__@my-react/react-refresh__"]: {
    register: typeof register;
    setSignature: typeof setSignature;
    getFamilyByID: typeof getFamilyByID;
    getFamilyByType: typeof getFamilyByType;
    performReactRefresh: typeof performReactRefresh;
    isLikelyComponentType: typeof isLikelyComponentType;
    collectCustomHooksForSignature: typeof collectCustomHooksForSignature;
    createSignatureFunctionForTransform: typeof createSignatureFunctionForTransform;
  };
  ["__@my-react/react-refresh__id"]: typeof allFamiliesByID;
  ["__@my-react/react-refresh__updated"]: typeof updatedFamiliesByType;
  ["__@my-react/react-refresh__signature"]: typeof allSignaturesByType;
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
  if (haveEqualSignatures(prevType, nextType)) {
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

  if (typeof typedSelf?.["__@my-react/hmr__"]?.hmr !== "function") {
    console.log(`[@my-react/react-refresh] try to refresh current App failed, current environment not have a valid HMR runtime`);
    return;
  }

  const allPending = pendingUpdates.slice(0);

  pendingUpdates.length = 0;

  const containers: Map<CustomRenderDispatch, boolean> = new Map();

  allPending.forEach(([family, _nextType]) => {
    const prevType = getRenderTypeFormType(family.current);

    const nextType = getRenderTypeFormType(_nextType);

    if (prevType && nextType) {
      const fibers = typedSelf["__@my-react/hmr__"]?.getCurrentFibersFromType?.(prevType);

      updatedFamiliesByType.set(prevType, family);

      updatedFamiliesByType.set(_nextType, family);

      family.current = nextType;

      if (fibers?.size) {
        const forceReset = !canPreserveStateBetween(prevType, nextType);

        fibers.forEach((f) => {
          const container = typedSelf["__@my-react/hmr__"]?.getCurrentDispatchFromFiber?.(f);

          const hasRootUpdate = containers.get(container) || f === container.rootFiber;

          typedSelf?.["__@my-react/hmr__"]?.hmr?.(f, nextType, forceReset);

          containers.set(container, hasRootUpdate);
        });
      }
    }
  });

  if (containers.size > 0) {
    console.log(`[@my-react/react-refresh] updating ...`);

    containers.forEach((hasRootUpdate, container) => {
      if (container.isAppCrashed || container.isAppUnmounted) {
        // have a uncaught runtime error for prev render
        container.remountOnDev?.();
      } else if (container.runtimeFiber.errorCatchFiber) {
        // has a error for prev render
        const fiber = container?.runtimeFiber.errorCatchFiber;

        fiber._revert();
      } else {
        container.rootFiber._update(hasRootUpdate ? STATE_TYPE.__triggerSync__ : STATE_TYPE.__skippedSync__);
      }
    });
  } else {
    console.error(`[@my-react/react-refresh] refresh failed`);
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

const tryToRegister = () => {
  if (__DEV__) {
    try {
      if (typeof typedSelf?.["__@my-react/hmr__"]?.setRefreshHandler !== "function") {
        console.error(`%c[@my-react/react-refresh] inject Dev refresh failed!`, "color: red; font-size: 14px;");
      } else {
        console.log(`%c[@my-react/react-refresh] Dev refresh have been enabled!`, "color: #38B2AC; font-size: 14px;");

        typedSelf?.["__@my-react/hmr__"]?.setRefreshHandler?.(resolveFamily as Parameters<typeof setRefreshHandler>[0]);
      }
    } catch {
      void 0;
    }
  }
};

export const injectIntoGlobalHook = (globalThis: Window) => globalThis.addEventListener("load", tryToRegister);

export const version = __VERSION__;

if (__DEV__) {
  typedSelf["__@my-react/react-refresh__"] = {
    register,
    setSignature,
    getFamilyByID,
    getFamilyByType,
    performReactRefresh,
    isLikelyComponentType,
    collectCustomHooksForSignature,
    createSignatureFunctionForTransform,
  };

  typedSelf["__@my-react/react-refresh__id"] = allFamiliesByID;

  typedSelf["__@my-react/react-refresh__updated"] = updatedFamiliesByType;

  typedSelf["__@my-react/react-refresh__signature"] = allSignaturesByType;
}
