import { createRef } from "@my-react/react";

export const asyncUpdateTimeLimit = createRef<number>(8);

export const asyncUpdateTimeStep = createRef<number | null>(null);

// ==== feature ==== //
export const enableControlComponent = createRef(true);

export const enableEventSystem = createRef(true);

export const enableHighlight = createRef(false);
