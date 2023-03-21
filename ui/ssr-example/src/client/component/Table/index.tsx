import { Box } from "@chakra-ui/react";

import { BaseTable } from "./BaseTable";
import { Column } from "./Column";
import { Pagination } from "./Pagination";
import { useChildren } from "./useChildren";
import { useSkeleton } from "./useSkeleton";
import { SorterContext, useSorter } from "./useSorter";

import type { TableProps } from "./type";

export function Table<T extends Record<string, string>>({
  dataSource,
  sorter,
  pagination,
  noResultText: _noResultText,
  CustomNoResult,
  tableProps,
  skeletonRowCount,
  rowProps,
  children,
  containerProps,
  afterSorting,
}: TableProps<T>) {
  const noResultText = "empty";
  const { innerSorter, onSort, sortedRows } = useSorter(sorter, dataSource, afterSorting);
  const { skeletonRows, skeletonVisible } = useSkeleton(dataSource, skeletonRowCount);

  const ChildRender = useChildren(children, rowProps);

  return (
    <SorterContext.Provider
      value={{
        sorter: innerSorter,
        onSort,
      }}
    >
      <Box {...containerProps}>
        <BaseTable {...tableProps}>{children && <ChildRender dataSource={skeletonVisible ? skeletonRows : sortedRows} />}</BaseTable>
        {!skeletonVisible && sortedRows.length === 0 && (CustomNoResult ? <CustomNoResult /> : noResultText)}
      </Box>
      {!!pagination && <Pagination {...pagination} />}
    </SorterContext.Provider>
  );
}

Table.Column = Column;
