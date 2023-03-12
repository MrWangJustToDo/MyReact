import { createRef } from "../api";

import type { MyReactReactiveInstance } from "../reactive";

export const currentReactiveInstance = createRef<MyReactReactiveInstance | null>(null);
