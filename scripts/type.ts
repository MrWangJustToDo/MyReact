import type { OutputOptions } from "rollup";

export type packages = "myreact" | "myreact-dom" | "myreact-reconciler" | "myreact-shared";
export type Mode = "production" | "development";
export type MultipleOutput = OutputOptions & {
  multiple?: boolean;
};
