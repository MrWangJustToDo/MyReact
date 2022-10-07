import type { OutputOptions } from "rollup";

export type packages = "myreact" | "myreact-dom" | "myreact-reconciler" | "myreact-shared" | "myreact-reactivity";
export type Mode = "production" | "development";
export type MultipleOutput = OutputOptions & {
  multiple?: boolean;
};
