export const makeMap = (src: string) => {
  const tags = src.split(",");
  return tags.reduce<Record<string, true>>((p, c) => ((p[c] = true), p), Object.create(null));
};

export const isValidTag = makeMap("terminal-text,terminal-box,terminal-virtual-text");
