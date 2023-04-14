import { createRef } from "@my-react/react";

import { MyWeakMap } from "./map";

import type { MyReactContainer, MyReactFiberNode } from "../runtimeFiber";

export const currentLoopContainer = createRef<MyReactContainer | null>(null);

export const fiberToContainerMap = new MyWeakMap<MyReactFiberNode, MyReactContainer>();
