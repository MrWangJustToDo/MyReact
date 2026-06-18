const encoder = new TextEncoder();
const decoder = new TextDecoder();

// @ts-expect-error Uint8Array static methods conflict with custom Buffer.from overloads
export class Buffer extends Uint8Array {
  private _view?: DataView;

  private get view(): DataView {
    if (!this._view) {
      this._view = new DataView(this.buffer, this.byteOffset, this.byteLength);
    }
    return this._view;
  }

  static override from(data: string | ArrayBuffer | Uint8Array | ArrayLike<number>, encodingOrOffset?: string | number, length?: number): Buffer {
    if (typeof data === "string") {
      const bytes = encoder.encode(data);
      const buf = new Buffer(bytes.length);
      buf.set(bytes);
      return buf;
    }
    if (data instanceof ArrayBuffer) {
      const offset = typeof encodingOrOffset === "number" ? encodingOrOffset : 0;
      const len = typeof length === "number" ? length : data.byteLength - offset;
      const buf = new Buffer(len);
      buf.set(new Uint8Array(data, offset, len));
      return buf;
    }
    if (data instanceof Uint8Array) {
      const buf = new Buffer(data.length);
      buf.set(data);
      return buf;
    }
    const arr = data as ArrayLike<number>;
    const buf = new Buffer(arr.length);
    for (let i = 0; i < arr.length; i++) {
      buf[i] = arr[i]!;
    }
    return buf;
  }

  static alloc(size: number, fill?: number): Buffer {
    const buf = new Buffer(size);
    if (fill !== undefined) buf.fill(fill);
    return buf;
  }

  static allocUnsafe(size: number): Buffer {
    return new Buffer(size);
  }

  static isBuffer(obj: any): obj is Buffer {
    return obj instanceof Buffer;
  }

  static concat(buffers: Uint8Array[], totalLength?: number): Buffer {
    const len = totalLength ?? buffers.reduce((sum, buf) => sum + buf.length, 0);
    const result = Buffer.alloc(len);
    let offset = 0;
    for (const buf of buffers) {
      result.set(buf, offset);
      offset += buf.length;
    }
    return result;
  }

  static byteLength(str: string, _encoding?: string): number {
    return encoder.encode(str).length;
  }

  copy(target: Buffer, targetStart = 0, sourceStart = 0, sourceEnd = this.length): number {
    const bytes = this.subarray(sourceStart, sourceEnd);
    target.set(bytes, targetStart);
    return bytes.length;
  }

  write(str: string, offset = 0, length?: number, _encoding?: string): number {
    const bytes = encoder.encode(str);
    const len = length !== undefined ? Math.min(bytes.length, length) : bytes.length;
    for (let i = 0; i < len; i++) {
      this[offset + i] = bytes[i]!;
    }
    return len;
  }

  toString(encoding?: string, start = 0, end = this.length): string {
    return decoder.decode(this.subarray(start, end));
  }

  writeUint8(value: number, offset = 0): number {
    this.view.setUint8(offset, value);
    return offset + 1;
  }

  readUint8(offset = 0): number {
    return this.view.getUint8(offset);
  }

  writeUint16LE(value: number, offset = 0): number {
    this.view.setUint16(offset, value, true);
    return offset + 2;
  }

  readUint16LE(offset = 0): number {
    return this.view.getUint16(offset, true);
  }

  writeUint32LE(value: number, offset = 0): number {
    this.view.setUint32(offset, value, true);
    return offset + 4;
  }

  readUint32LE(offset = 0): number {
    return this.view.getUint32(offset, true);
  }

  writeInt8(value: number, offset = 0): number {
    this.view.setInt8(offset, value);
    return offset + 1;
  }

  readInt8(offset = 0): number {
    return this.view.getInt8(offset);
  }

  writeInt16LE(value: number, offset = 0): number {
    this.view.setInt16(offset, value, true);
    return offset + 2;
  }

  readInt16LE(offset = 0): number {
    return this.view.getInt16(offset, true);
  }

  writeInt32LE(value: number, offset = 0): number {
    this.view.setInt32(offset, value, true);
    return offset + 4;
  }

  readInt32LE(offset = 0): number {
    return this.view.getInt32(offset, true);
  }

  writeFloatLE(value: number, offset = 0): number {
    this.view.setFloat32(offset, value, true);
    return offset + 4;
  }

  readFloatLE(offset = 0): number {
    return this.view.getFloat32(offset, true);
  }

  writeDoubleLE(value: number, offset = 0): number {
    this.view.setFloat64(offset, value, true);
    return offset + 8;
  }

  readDoubleLE(offset = 0): number {
    return this.view.getFloat64(offset, true);
  }
}

export default { Buffer };
