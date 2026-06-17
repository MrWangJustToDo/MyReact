/* eslint-disable import/export */
import { createStoreWithComponent } from "reactivity-store";

import type { Creator } from "reactivity-store";

const createReactive = <T extends Record<string, unknown>>(options: Creator<T> | Parameters<typeof createStoreWithComponent<T>>[0]) => {
  if (typeof options === "function") {
    return createStoreWithComponent({ setup: options });
  } else {
    return createStoreWithComponent(options);
  }
};

const version = __VERSION__;

export * from "reactivity-store";

export { version, createReactive };
