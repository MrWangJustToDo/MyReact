import { OP, type OpCode } from "./op.js";

/**
 * Fixed argument counts after each opcode (excluding the opcode itself).
 * CREATE / CREATE_TEXT may carry an optional trailing scope string — use
 * {@link getOpFrameLength} when walking streams.
 */
export const OP_ARITY: Record<OpCode, number> = {
  [OP.CREATE]: 2, // id, type (+ optional scope)
  [OP.CREATE_TEXT]: 1, // id (+ optional scope)
  [OP.INSERT]: 3,
  [OP.REMOVE]: 2,
  [OP.SET_PROP]: 3,
  [OP.SET_TEXT]: 2,
  [OP.SET_EVENT]: 4,
  [OP.REMOVE_EVENT]: 3,
  [OP.SET_STYLE]: 2,
  [OP.SET_CLASS]: 2,
  [OP.SET_ID]: 2,
  [OP.SET_WORKLET_EVENT]: 4,
  [OP.SET_MT_REF]: 2,
  [OP.INIT_MT_REF]: 2,
  [OP.SET_GESTURE]: 2,
};

/**
 * Full frame length including the opcode at `index`.
 * Returns null if the frame is truncated or the opcode is unknown.
 */
export function getOpFrameLength(ops: unknown[], index: number): number | null {
  if (index >= ops.length) return null;
  const code = ops[index] as number;
  const base = (OP_ARITY as Record<number, number | undefined>)[code];
  if (base === undefined) return null;

  if (code === OP.CREATE) {
    // CREATE id type [scope?]
    if (index + 1 + base >= ops.length) return null;
    if (typeof ops[index + 3] === "string") {
      if (index + 4 > ops.length) return null;
      return 4;
    }
    return 3;
  }

  if (code === OP.CREATE_TEXT) {
    // CREATE_TEXT id [scope?]
    if (index + 1 + base >= ops.length) return null;
    if (typeof ops[index + 2] === "string") {
      if (index + 3 > ops.length) return null;
      return 3;
    }
    return 2;
  }

  if (index + 1 + base > ops.length) return null;
  return 1 + base;
}
