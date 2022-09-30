import { createRef } from "@my-react/react";

export const enableAllCheck = createRef(__DEV__);

export const asyncUpdateTimeLimit = 8;

export const asyncUpdateTimeStep = createRef<number | null>(null);

// ==== feature ==== //
export const enableControlComponent = createRef(true);

export const enableEventSystem = createRef(true);

export const enableHighlight = createRef(false);

// ==== 实验性 ==== //
// 如果禁用，请同时启用 LinkTreeList 的 scopePush
export const enableFastLoop = createRef(true);
