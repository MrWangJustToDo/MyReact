import { useMemo } from "react";
import { createState } from "reactivity-store";

import type { Layout, Layouts } from "react-grid-layout";

export const BLOG_GRID_HEIGHT = 10;

export const useListLayoutStore = createState(() => ({ data: {} as Layouts }), {
  withActions: (s) => ({
    updateLayout: (newLayout: Layouts) => {
      s.data = newLayout;
    },
    mergeLayout: (newLayout: Layouts) => {
      const oldData = s.data
      const obj = {};
      Object.keys(newLayout).forEach((key) => {
        obj[key] = [];
        const oldValue = oldData[key];
        const newValue = newLayout[key];
        newValue.forEach((item) => {
          const lastItem = oldValue?.find((_i) => _i.i === item.i);
          if (lastItem) {
            obj[key].push(lastItem);
          } else {
            obj[key].push(item);
          }
        });
      });
      s.data = obj;
    }
  }),
});

const _generateFunction =
  (width: number) =>
  (index: number, id: string, dataLength: number): Layout => {
    const i = id + index;
    const h = BLOG_GRID_HEIGHT + dataLength;
    const layout = {
      i,
      x: Math.floor(index % width),
      y: Math.floor(index / width) * h,
      w: 1,
      maxW: width,
      h: h,
      minH: BLOG_GRID_HEIGHT,
    };
    return layout;
  };

const xsGenerate = _generateFunction(1);
const smGenerate = _generateFunction(2);
const mdGenerate = _generateFunction(3);
const lgGenerate = _generateFunction(4);

export const useGetResponseListLayout = (items: { id: string; bodyText: string }[]) => {
  return useMemo(() => {
    const xs = items.map(({ id }, i) => xsGenerate(i, id, 4));
    const sm = items.map(({ id }, i) => smGenerate(i, id, 6));
    const md = items.map(({ id }, i) => mdGenerate(i, id, 10));
    const lg = items.map(({ id }, i) => lgGenerate(i, id, 14));
    return {
      lg,
      md,
      sm,
      xs,
      xxs: xs,
    };
  }, [items]);
};
