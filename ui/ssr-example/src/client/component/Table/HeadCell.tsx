import { Box, Flex, Th, Tooltip, Icon, IconButton } from "@chakra-ui/react";
import { useCallback, useContext, useMemo } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

import { SortOrder } from "./type";
import { SorterContext } from "./useSorter";

import type { HeadCellProps, HeadCellRender, Sorter } from "./type";

export function HeadCell<T>({
  Render,
  CustomRender,
  genCompareFn,
  dataIndex,
  rowIndex,
  colIndex,
  cellProps,
  cancelSort,
  sort,
  sortedColor = "blue.500",
  defaultOrder = SortOrder.Desc,
  tooltipProps,
}: HeadCellRender<T>) {
  const { sorter, onSort } = useContext<{
    sorter: Sorter<T>;
    onSort: (sorter: Sorter<T>) => void;
  }>(SorterContext);

  const getColor = useCallback(
    (targetOrder: SortOrder) => (sorter?.by === dataIndex && sorter?.order === targetOrder ? sortedColor : undefined),
    [dataIndex, sorter, sortedColor],
  );

  const toggledSortOrder = useMemo(() => {
    if (sorter?.by !== dataIndex || sorter?.order === SortOrder.None) {
      return defaultOrder;
    }
    if (cancelSort && sorter?.order != defaultOrder) {
      return SortOrder.None;
    }
    return sorter?.order === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
  }, [dataIndex, sorter, defaultOrder, cancelSort]);

  if (typeof CustomRender === "function") {
    let content: React.ReactElement | null = null;
    if (dataIndex) {
      content = CustomRender({
        dataIndex,
        rowIndex,
        colIndex,
        sorter,
        onSort,
        genCompareFn,
        defaultOrder,
        cancelSort,
        sorterClick: () => {
          if (genCompareFn && sorter?.genCompareFn !== genCompareFn) {
            onSort({
              by: dataIndex,
              order: toggledSortOrder,
              genCompareFn: genCompareFn,
            });
          } else {
            onSort({
              by: dataIndex,
              order: toggledSortOrder,
            });
          }
        },
        sortAscColor: getColor(SortOrder.Asc),
        sortDescColor: getColor(SortOrder.Desc),
        toggledSortOrder,
      });
    } else {
      const CustomRenderWithoutDataIndex = CustomRender as Required<HeadCellProps<T>>["CustomRender"];
      content = CustomRenderWithoutDataIndex({
        rowIndex,
        colIndex,
        sorter,
        onSort,
        sort,
        defaultOrder,
        sortAscColor: getColor(SortOrder.Asc),
        sortDescColor: getColor(SortOrder.Desc),
      });
    }
    return tooltipProps ? <Tooltip {...tooltipProps}>{content}</Tooltip> : content;
  }

  const content = typeof Render === "function" ? Render({ dataIndex: dataIndex || ("" as keyof T), rowIndex, colIndex }) : Render;

  const arialLabel = `Sort by ${typeof Render === "string" ? Render : dataIndex.toString()}`;

  const thContent = sort ? (
    <Flex
      display="inline-flex"
      as="button"
      width="auto"
      cursor="pointer"
      aria-label={arialLabel}
      textTransform="inherit"
      fontWeight="semibold"
      onClick={() => {
        if (genCompareFn && sorter?.genCompareFn !== genCompareFn) {
          onSort({
            by: dataIndex,
            order: toggledSortOrder,
            genCompareFn: genCompareFn,
          });
        } else {
          onSort({
            by: dataIndex,
            order: toggledSortOrder,
          });
        }
      }}
      alignItems="center"
    >
      {content}
      <Flex transform="scale(0.7)" marginStart="2px" flexDirection="column">
        <IconButton icon={<Icon as={AiOutlineUp} />} aria-label="Sort ascend" fontSize="xx-small" color={getColor(SortOrder.Asc)} />
        <IconButton icon={<Icon as={AiOutlineDown} />} aria-label="Sort descend" fontSize="xx-small" color={getColor(SortOrder.Desc)} />
      </Flex>
    </Flex>
  ) : (
    <Box fontWeight="semibold">{content}</Box>
  );

  return (
    <Th textTransform="none" color="inherit" {...cellProps}>
      {tooltipProps ? <Tooltip {...tooltipProps}>{thContent}</Tooltip> : thContent}
    </Th>
  );
}
