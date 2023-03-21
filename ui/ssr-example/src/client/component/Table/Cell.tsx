import { Skeleton as DefaultSkeleton } from "@chakra-ui/react";

import { Td } from "./Td";

import type { BodyCellProps, BodyCellRender } from "./type";

// eslint-disable-next-line @typescript-eslint/ban-types
const CellRender = <T extends {}>({ Render, CustomRender, dataIndex, rowIndex, colIndex, rowData, cellProps, ...restProps }: BodyCellRender<T>) => {
  if (typeof CustomRender === "function") {
    if (dataIndex) {
      return CustomRender({
        rowData,
        rowIndex,
        colIndex,
        dataIndex,
        cellData: rowData[dataIndex],
      });
    }

    const CustomRenderWithoutDataIndex = CustomRender as Required<BodyCellProps<T>>["CustomRender"];

    return CustomRenderWithoutDataIndex({
      rowData,
      rowIndex,
      colIndex,
    });
  }

  return (
    <Td fontWeight="medium" {...restProps} {...cellProps}>
      {typeof Render === "function"
        ? Render({
            dataIndex: dataIndex || ("" as keyof T),
            rowIndex,
            colIndex,
            cellData: dataIndex ? rowData[dataIndex] : ({} as T[keyof T]),
            rowData,
          })
        : Render}
    </Td>
  );
};

export function Cell<T>({
  Render,
  CustomRender,
  dataIndex,
  rowIndex,
  colIndex,
  rowData,
  cellProps,
  showSkeleton = ({ rowData }) => !rowData,
  Skeleton,
  ...restProps
}: BodyCellRender<T>) {
  const _showSkeleton = typeof showSkeleton === "function" ? showSkeleton({ rowIndex, rowData, colIndex }) : !!showSkeleton;

  if (_showSkeleton) {
    if (Skeleton)
      return (
        <Td fontWeight="medium" {...restProps} {...cellProps}>
          <Skeleton rowIndex={rowIndex} colIndex={colIndex} />
        </Td>
      );
    return (
      <Td fontWeight="medium" {...restProps} {...cellProps}>
        <DefaultSkeleton width="80%" height="24px" />
      </Td>
    );
  }

  return (
    <CellRender
      {...{
        rowData,
        rowIndex,
        dataIndex,
        colIndex,
        cellProps,
        Render,
        CustomRender,
        ...restProps,
      }}
    />
  );
}
