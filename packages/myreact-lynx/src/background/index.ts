import React from "@my-react/react";

// Runtime/types from MyReact (`./type`); rslib remaps emit to `@my-react/react`.
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

export { reconciler, render, root, createPortal, flushSync, type Root } from "./render/renderer.js";
export { markFirstScreenPatchComplete } from "./first-screen/first-screen-patch.js";
export { isIfrEnabled, isIfrMainThread } from "../shared/ifr.js";
export { useMainThreadRef, MainThreadRef } from "./worklet/main-thread-ref.js";
export { runOnBackground } from "./worklet/run-on-background.js";
export { transformToWorklet } from "./worklet/transform-to-worklet.js";
export { runOnMainThread } from "./worklet/cross-thread.js";

// InitData system
export { useLynxGlobalEventListener } from "./data/use-lynx-global-event-listener.js";
export { useInitData, useInitDataChanged, InitDataProvider, InitDataConsumer, withInitDataInState, type InitData, type InitDataRaw } from "./data/init-data.js";

// GlobalProps system
export { useGlobalProps, useGlobalPropsChanged, GlobalPropsProvider, GlobalPropsConsumer, type GlobalProps } from "./data/global-props.js";

// Data Processor system
export { registerDataProcessors, type DataProcessorDefinition, type DataProcessors } from "./data/data-processor.js";

// Lynx API extensions
export { triggerGlobalEventFromLepus, querySelector, querySelectorAll, type LynxAPI } from "./data/lynx-api.js";

// Lazy bundle loading
export { loadLazyBundle, makeSyncThen } from "./lazy/lazy-bundle.js";
export { loadDynamicJS, __dynamicImport } from "./lazy/dynamic-import.js";

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
export { useGesture } from "./gesture/use-gesture.js";
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
