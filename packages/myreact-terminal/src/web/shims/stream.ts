import { EventEmitter } from "./events.js";

export class Stream extends EventEmitter {}

export class Writable extends Stream {
  writable = true;
  readonly isTTY = true;

  columns = 80;
  rows = 24;

  private _onWrite?: (chunk: string) => void;

  constructor(onWrite?: (chunk: string) => void) {
    super();
    this._onWrite = onWrite;
  }

  write(chunk: string | Buffer, encoding?: string | ((err?: Error | null) => void), callback?: (err?: Error | null) => void): boolean {
    const str = typeof chunk === "string" ? chunk : chunk.toString();
    this._onWrite?.(str);

    const cb = typeof encoding === "function" ? encoding : callback;
    cb?.();
    return true;
  }

  end(): this {
    return this;
  }

  cork(): void {}
  uncork(): void {}

  setDefaultEncoding(_enc: string): this {
    return this;
  }

  destroy(): this {
    return this;
  }
}

export class Readable extends Stream {
  readable = true;

  columns: number;

  rows: number;

  readonly isTTY = true;

  private _isRaw = false;

  get isRaw(): boolean {
    return this._isRaw;
  }

  setRawMode(mode: boolean): this {
    this._isRaw = mode;
    return this;
  }

  setEncoding(_encoding: string): this {
    return this;
  }

  resume(): this {
    return this;
  }

  pause(): this {
    return this;
  }

  read(): null | string {
    return null;
  }

  pipe<T>(_dest: T): T {
    return _dest;
  }

  unpipe(): this {
    return this;
  }

  unref(): this {
    return this;
  }

  ref(): this {
    return this;
  }

  destroy(): this {
    return this;
  }
}

export class PassThrough extends Writable {}
