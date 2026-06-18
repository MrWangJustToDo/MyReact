export const sep = "/";
export const delimiter = ":";

export const resolve = (...paths: string[]): string => {
  let resolved = "";
  for (const path of paths) {
    if (path.startsWith("/")) {
      resolved = path;
    } else {
      resolved = resolved + "/" + path;
    }
  }
  return normalize(resolved);
};

export const join = (...paths: string[]): string => {
  return normalize(paths.filter(Boolean).join("/"));
};

export const normalize = (path: string): string => {
  const parts = path.split("/");
  const normalized: string[] = [];
  for (const part of parts) {
    if (part === "..") {
      normalized.pop();
    } else if (part !== "." && part !== "") {
      normalized.push(part);
    }
  }
  return (path.startsWith("/") ? "/" : "") + normalized.join("/");
};

export const dirname = (path: string): string => {
  const lastSlash = path.lastIndexOf("/");
  return lastSlash === -1 ? "." : path.slice(0, lastSlash) || "/";
};

export const basename = (path: string, ext?: string): string => {
  let base = path.slice(path.lastIndexOf("/") + 1);
  if (ext && base.endsWith(ext)) {
    base = base.slice(0, -ext.length);
  }
  return base;
};

export const extname = (path: string): string => {
  const base = basename(path);
  const dot = base.lastIndexOf(".");
  return dot === -1 ? "" : base.slice(dot);
};

export const relative = (from: string, to: string): string => {
  const fromParts = resolve(from).split("/").filter(Boolean);
  const toParts = resolve(to).split("/").filter(Boolean);

  let common = 0;
  while (common < fromParts.length && common < toParts.length && fromParts[common] === toParts[common]) {
    common++;
  }

  const ups = fromParts.length - common;
  const result = [...Array(ups).fill(".."), ...toParts.slice(common)];
  return result.join("/") || ".";
};

export const isAbsolute = (path: string): boolean => path.startsWith("/");

export default { sep, delimiter, resolve, join, normalize, dirname, basename, extname, relative, isAbsolute };
