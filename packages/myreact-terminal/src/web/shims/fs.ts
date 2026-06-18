const noop = () => {};

export const readFileSync = () => "";
export const writeFileSync = noop;
export const existsSync = () => false;
export const mkdirSync = noop;
export const readdirSync = () => [];
export const statSync = () => ({});
export const unlinkSync = noop;
export const createWriteStream = () => ({ write: noop, end: noop, on: noop });
export const createReadStream = () => ({ on: noop, pipe: noop });
export const promises = {
  readFile: async () => "",
  writeFile: async () => {},
  access: async () => {},
  mkdir: async () => {},
};
export const constants = { F_OK: 0, R_OK: 4, W_OK: 2 };

const fs = {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
  createWriteStream,
  createReadStream,
  promises,
  constants,
};

export default fs;
