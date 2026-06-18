export const isatty = () => true;

export class ReadStream {
  isRaw = false;
  isTTY = true as const;
  setRawMode(mode: boolean): this {
    this.isRaw = mode;
    return this;
  }
}

export class WriteStream {
  isTTY = true as const;
  columns = 80;
  rows = 24;
}

export default { isatty, ReadStream, WriteStream };
