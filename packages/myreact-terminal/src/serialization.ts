import { Buffer } from "node:buffer";

import { StyledLine, type StyleSpan } from "./styled-line.js";
import { FULL_WIDTH_MASK } from "./tokenize.js";

const hasStylesMask = 0b0000_0010;
const fullWidthMask = 0b0000_0001;
const isRepeatedCharMask = 0b0000_0100;
const isAsciiMixedMask = 0b0000_1000;

export class Serializer {
  private buffer: Buffer;
  private currentSize = 0;

  constructor(initialSize = 1024 * 1024) {
    this.buffer = Buffer.allocUnsafe(initialSize);
  }

  serialize(lines: readonly StyledLine[]): Uint8Array {
    this.currentSize = 0;
    this.writeUint32(lines.length);
    for (const line of lines) {
      this.writeLine(line);
    }

    const result = Buffer.allocUnsafe(this.currentSize);
    this.buffer.copy(result, 0, 0, this.currentSize);
    return result;
  }

  private ensureCapacity(size: number) {
    if (this.currentSize + size > this.buffer.length) {
      const newSize = Math.max(this.buffer.length * 2, this.currentSize + size + 1024 * 1024);
      const newBuffer = Buffer.allocUnsafe(newSize);
      this.buffer.copy(newBuffer, 0, 0, this.currentSize);
      this.buffer = newBuffer;
    }
  }

  private writeLine(line: StyledLine | undefined) {
    if (!line || line.length === 0) {
      this.writeUint32(0);
      return;
    }

    const spans = line.getSpans();
    this.writeUint32(spans.length);

    let offset = 0;
    for (const span of spans) {
      this.writeSpan(line, span, offset);
      offset += span.length;
    }
  }

  private writeSpan(line: StyledLine, span: StyleSpan, start: number) {
    this.writeUint32(span.length);

    const end = start + span.length;
    const firstVal = line.getValue(start);
    const firstFullWidth = line.getFullWidth(start);
    let isRepeatedChar = true;
    let isAsciiMixed = true;

    for (let i = start; i < end; i++) {
      const val = line.getValue(i);
      if (val !== firstVal || line.getFullWidth(i) !== firstFullWidth) {
        isRepeatedChar = false;
      }

      if (line.getFullWidth(i) || val.length !== 1) {
        isAsciiMixed = false;
      }
    }

    let flags = 0;
    // A span has styles if its format flags are anything but 0 (or just full-width)
    // Or if it has colors.
    const hasStyles = (span.formatFlags & ~FULL_WIDTH_MASK) !== 0 || span.fgColor || span.bgColor || span.link;
    if (hasStyles) {
      flags |= hasStylesMask;
    }

    if (isRepeatedChar) {
      flags |= isRepeatedCharMask;
    } else if (isAsciiMixed) {
      flags |= isAsciiMixedMask;
    }

    this.writeUint8(flags);

    if (hasStyles) {
      this.writeUint8(span.formatFlags);
      this.writeString(span.fgColor || "");
      this.writeString(span.bgColor || "");
      this.writeString(span.link || "");
    }

    if (isRepeatedChar) {
      let charFlags = 0;
      if (firstFullWidth) {
        charFlags |= fullWidthMask;
      }

      this.writeUint8(charFlags);
      this.writeString(firstVal || "");
    } else if (isAsciiMixed) {
      let concat = "";
      for (let i = start; i < end; i++) {
        concat += line.getValue(i);
      }

      this.writeString(concat);
    } else {
      for (let i = start; i < end; i++) {
        let charFlags = 0;
        if (line.getFullWidth(i)) {
          charFlags |= fullWidthMask;
        }

        this.writeUint8(charFlags);
        this.writeString(line.getValue(i) || "");
      }
    }
  }

  private writeString(str: string) {
    const len = Buffer.byteLength(str);
    this.ensureCapacity(2 + len);
    this.buffer.writeUint16LE(len, this.currentSize);
    this.currentSize += 2;
    this.buffer.write(str, this.currentSize, len, "utf8");
    this.currentSize += len;
  }

  private writeUint32(value: number) {
    this.ensureCapacity(4);
    this.buffer.writeUint32LE(value, this.currentSize);
    this.currentSize += 4;
  }

  private writeUint8(value: number) {
    this.ensureCapacity(1);
    this.buffer.writeUint8(value, this.currentSize);
    this.currentSize += 1;
  }
}

export class Deserializer {
  private offset = 0;
  private readonly buf: Buffer;

  constructor(buffer: Uint8Array) {
    this.buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  deserialize(): StyledLine[] {
    const lineCount = this.readUint32();
    const lines: StyledLine[] = [];

    for (let i = 0; i < lineCount; i++) {
      lines.push(this.readLine());
    }

    return lines;
  }

  private readLine(): StyledLine {
    const spanCount = this.readUint32();
    const line = new StyledLine();

    for (let i = 0; i < spanCount; i++) {
      this.readSpan(line);
    }

    return line;
  }

  private readSpan(line: StyledLine) {
    const spanLength = this.readUint32();
    const flags = this.readUint8();

    const hasStyles = (flags & hasStylesMask) !== 0;
    const isRepeatedChar = (flags & isRepeatedCharMask) !== 0;
    const isAsciiMixed = (flags & isAsciiMixedMask) !== 0;

    let formatFlags = 0;
    let fgColor: string | undefined;
    let bgColor: string | undefined;
    let link: string | undefined;

    if (hasStyles) {
      formatFlags = this.readUint8();
      fgColor = this.readString() || undefined;
      bgColor = this.readString() || undefined;
      link = this.readString() || undefined;
    }

    if (isRepeatedChar) {
      const charFlags = this.readUint8();
      const fullWidth = (charFlags & fullWidthMask) !== 0;
      const value = this.readString();

      let ff = formatFlags;
      if (fullWidth) ff |= FULL_WIDTH_MASK;

      for (let i = 0; i < spanLength; i++) {
        line.pushChar(value, ff, fgColor, bgColor, link);
      }
    } else if (isAsciiMixed) {
      const value = this.readString();
      for (let i = 0; i < spanLength; i++) {
        line.pushChar(value[i]!, formatFlags, fgColor, bgColor, link);
      }
    } else {
      for (let i = 0; i < spanLength; i++) {
        const charFlags = this.readUint8();
        const fullWidth = (charFlags & fullWidthMask) !== 0;
        const value = this.readString();

        let ff = formatFlags;
        if (fullWidth) ff |= FULL_WIDTH_MASK;
        else ff &= ~FULL_WIDTH_MASK;

        line.pushChar(value, ff, fgColor, bgColor, link);
      }
    }
  }

  private readString(): string {
    const len = this.readUint16();
    const str = this.buf.toString("utf8", this.offset, this.offset + len);
    this.offset += len;
    return str;
  }

  private readUint32(): number {
    const value = this.buf.readUint32LE(this.offset);
    this.offset += 4;
    return value;
  }

  private readUint16(): number {
    const value = this.buf.readUint16LE(this.offset);
    this.offset += 2;
    return value;
  }

  private readUint8(): number {
    const value = this.buf.readUint8(this.offset);
    this.offset += 1;
    return value;
  }
}
