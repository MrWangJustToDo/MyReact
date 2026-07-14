import React from "@my-react/react";

export * from "@my-react/react/type";
export { React };

// Re-export common React APIs so `@lynx-js/react` → `@my-react/react-lynx` aliases
// work for official examples / packages (e.g. `@lynx-js/motion`).
export {
  Children,
  Component,
  Fragment,
  PureComponent,
  StrictMode,
  Suspense,
  cloneElement,
  createContext,
  createElement,
  createRef,
  forwardRef,
  isValidElement,
  lazy,
  memo,
  startTransition,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "@my-react/react";

// Worklet SWC transform (runtimePkg) and packages like `@lynx-js/motion` import these.
export { loadWorkletRuntime, runWorkletCtx } from "@lynx-js/react/worklet-runtime/bindings";

export { reconciler, render, root, createPortal, flushSync, type Root } from "./renderer";
export { markFirstScreenPatchComplete } from "./first-screen-patch";
export { useMainThreadRef, MainThreadRef } from "./main-thread-ref";
export { runOnBackground } from "./run-on-background";
export { transformToWorklet } from "./transform-to-worklet";
export { runOnMainThread } from "./cross-thread";

// InitData system
export { useLynxGlobalEventListener } from "./use-lynx-global-event-listener";
export { useInitData, useInitDataChanged, InitDataProvider, InitDataConsumer, withInitDataInState, type InitData, type InitDataRaw } from "./init-data";

// GlobalProps system
export { useGlobalProps, useGlobalPropsChanged, GlobalPropsProvider, GlobalPropsConsumer, type GlobalProps } from "./global-props";

// Data Processor system
export { registerDataProcessors, type DataProcessorDefinition, type DataProcessors } from "./data-processor";

// Lynx API extensions
export { triggerGlobalEventFromLepus, querySelector, querySelectorAll, type LynxAPI } from "./lynx-api";

// Lazy bundle loading
export { loadLazyBundle, makeSyncThen } from "./lazy-bundle";
export { loadDynamicJS, __dynamicImport } from "./dynamic-import";

// Gesture system
export {
  Gesture,
  BaseGesture,
  ContinuousGesture,
  PanGesture,
  TapGesture,
  LongPressGesture,
  FlingGesture,
  NativeGesture,
  DefaultScrollGesture,
  SimultaneousGesture,
  ComposedGesture,
  ExclusiveGesture,
} from "@lynx-js/gesture-runtime";
export { useGesture } from "./useGesture.js";
export type {
  GestureKind,
  GestureChangeEvent,
  PanGestureChangeEvent,
  TapGestureChangeEvent,
  LongPressGestureChangeEvent,
  FlingGestureChangeEvent,
  GestureCallback,
  PanGestureConfig,
  TapGestureConfig,
  LongPressGestureConfig,
  FlingGestureConfig,
  StateManager,
} from "@lynx-js/gesture-runtime";
