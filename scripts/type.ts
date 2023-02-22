import type { OutputOptions } from "rollup";

export type packages = "myreact" | "myreact-dom" | "myreact-reconciler" | "myreact-shared" | "myreact-reactivity" | "myreact-jsx" | "axios" | "graphql";
export type Mode = "production" | "development";
export type MultipleOutput = OutputOptions & {
  multiple?: boolean;
};
