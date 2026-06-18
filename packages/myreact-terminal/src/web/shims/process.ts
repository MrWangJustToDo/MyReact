import { EventEmitter } from "./events.js";

class FakeProcess extends EventEmitter {
  env: Record<string, string | undefined> = {};
  argv: string[] = [];
  pid = 1;
  platform = "browser" as NodeJS.Platform;

  stdout = null;
  stderr = null;
  stdin = null;

  cwd(): string {
    return "/";
  }

  exit(_code?: number): never {
    throw new Error("process.exit is not available in browser");
  }

  nextTick(fn: (...args: any[]) => void, ...args: any[]): void {
    queueMicrotask(() => fn(...args));
  }
}

const fakeProcess = new FakeProcess();

export const env = fakeProcess.env;
export const argv = fakeProcess.argv;
export const pid = fakeProcess.pid;
export const platform = fakeProcess.platform;
export const stdout = fakeProcess.stdout;
export const stderr = fakeProcess.stderr;
export const stdin = fakeProcess.stdin;
export const cwd = () => fakeProcess.cwd();
export const exit = (code?: number) => fakeProcess.exit(code);
export const nextTick = (fn: (...args: any[]) => void, ...args: any[]) => fakeProcess.nextTick(fn, ...args);
export const on = (event: string, listener: (...args: any[]) => void) => fakeProcess.on(event, listener);
export const off = (event: string, listener: (...args: any[]) => void) => fakeProcess.off(event, listener);
export const emit = (event: string, ...args: any[]) => fakeProcess.emit(event, ...args);

export default fakeProcess;
