import { useMemo } from "react";

import type { Layout } from "react-grid-layout";

export const BLOG_GRID_HEIGHT = 10;

const _generateFunction =
  (width: number) =>
  (index: number, id: string, dataLength: number): Layout => {
    const h = BLOG_GRID_HEIGHT + Math.floor(dataLength / 60);
    const maxH = h > 60 ? 60 : h;
    return {
      i: id + index,
      x: Math.floor(index % width),
      y: Math.floor(index / width),
      w: 1,
      maxW: width,
      h: maxH,
      minH: BLOG_GRID_HEIGHT,
    };
  };

const smGenerate = _generateFunction(1);
const mdGenerate = _generateFunction(2);
const lgGenerate = _generateFunction(3);

export const useGetResponseListLayout = (items: { id: string; bodyText: string }[]) => {
  return useMemo(() => {
    const sm = items.map(({ id, bodyText }, i) => smGenerate(i, id, bodyText.length));
    const md = items.map(({ id, bodyText }, i) => mdGenerate(i, id, bodyText.length));
    const lg = items.map(({ id, bodyText }, i) => lgGenerate(i, id, bodyText.length));
    return {
      lg,
      md: lg,
      sm: md,
      xs: sm,
      xxs: sm,
    };
  }, [items]);
};
