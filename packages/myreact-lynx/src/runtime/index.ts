import React from "@my-react/react";

export * from "@my-react/react/type";
export { React };
export { reconciler, render, root, createPortal, flushSync, type Root } from "./renderer";
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
