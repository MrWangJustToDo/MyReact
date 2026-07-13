import type { Rspack } from "@rsbuild/core";

export default function invalidImportErrorLoader(this: Rspack.LoaderContext<{ message: string }>): void {
  const { message } = this.getOptions();
  throw new Error(message);
}
