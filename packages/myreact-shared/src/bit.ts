export const merge = (src: number, rest: number) => {
  return src | rest;
};

export const remove = (src: number, rest: number) => {
  if (src & rest) {
    return src ^ rest;
  } else {
    return src;
  }
};

export const include = (src: number, rest: number) => {
  return src & rest;
};

export const exclude = (src: number, rest: number) => {
  return !(src & rest);
};
