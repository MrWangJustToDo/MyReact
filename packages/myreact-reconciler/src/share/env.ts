import { createRef } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

export const enableKeyDiff = createRef(true);

// ==== running ==== //
export const nRoundTransformFiberArray = createRef<MyReactFiberNode[]>([]);

export const cRoundTransformFiberArray = createRef<MyReactFiberNode[]>([]);
