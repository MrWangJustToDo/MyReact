export { OP } from "../shared/op";

let buffer: unknown[] = [];

export function pushOp(...args: unknown[]): void {
  for (const arg of args) {
    buffer.push(arg);
  }
}

export function takeOps(): unknown[] {
  const b = buffer;
  buffer = [];
  return b;
}

/** @internal */
export function hasPendingOps(): boolean {
  return buffer.length > 0;
}
