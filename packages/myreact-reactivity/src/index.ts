/* eslint-disable import/export */
import { createStoreWithComponent } from "reactivity-store";

const createReactive = createStoreWithComponent;

const version = __VERSION__;

export * from "reactivity-store";

export { version, createReactive };
