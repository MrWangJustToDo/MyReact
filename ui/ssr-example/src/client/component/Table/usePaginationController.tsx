import { useMemo } from "react";

import type { PaginationBarButton, PaginationProps } from "./type";

const defaultConfigs = {
  pageSize: 50,
  unfoldedPages: 4,
  minUnfoldedPages: 3,
};

export const usePagination = ({ page, total, pageSize = defaultConfigs.pageSize }: Omit<PaginationProps, "onChange">) => {
  const totalPage = total ? Math.ceil(total / pageSize) : 1;
  return {
    totalPage,
    hasNextPage: page < totalPage,
    hasPrePage: page > 1,
  };
};

const getBarItems = (curPage: number, totalPage: number, unfoldedPages: number): PaginationBarButton[] => {
  const range: [number, number][] = [];
  curPage = Math.min(curPage, totalPage);
  if (totalPage <= unfoldedPages + 2) {
    range.push([1, totalPage]);
  } else if (curPage <= unfoldedPages) {
    range.push([1, unfoldedPages + 1]);
    range.push([totalPage, totalPage]);
  } else if (curPage >= totalPage - unfoldedPages + 1) {
    range.push([1, 1]);
    range.push([totalPage - unfoldedPages, totalPage]);
  } else {
    range.push([1, 1]);
    range.push([curPage - unfoldedPages + 2, curPage + 1]);
    range.push([totalPage, totalPage]);
  }
  const items = range.reduce<PaginationBarButton[]>((buttons, range) => {
    if (buttons.length) {
      buttons.push({ isSplitter: true, disabled: true, key: range[0] - 1 });
    }
    buttons.push(
      ...new Array(range[1] - range[0] + 1).fill(0).map((v, i): PaginationBarButton => {
        const pageNumber = range[0] + i;
        return {
          isFocused: pageNumber === curPage,
          pageNumber,
          key: pageNumber,
        };
      }),
    );
    return buttons;
  }, []);
  items.unshift({
    navigate: -1,
    disabled: curPage === 1,
    key: 0,
  });
  items.push({
    navigate: 1,
    disabled: curPage === totalPage,
    key: totalPage + 1,
  });
  return items;
};

export const usePaginationBar = ({
  page,
  total,
  pageSize = defaultConfigs.pageSize,
  unfoldedPages = defaultConfigs.unfoldedPages,
}: Omit<PaginationProps, "onChange">) => {
  unfoldedPages = Math.max(unfoldedPages, defaultConfigs.minUnfoldedPages);
  const { totalPage } = usePagination({
    page,
    total,
    pageSize,
  } as PaginationProps);
  const items = useMemo(() => getBarItems(page, totalPage, unfoldedPages), [page, totalPage, unfoldedPages]);
  return {
    totalPage,
    items,
  };
};
