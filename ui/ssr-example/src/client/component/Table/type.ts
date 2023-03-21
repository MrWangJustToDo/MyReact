import type { BoxProps, ButtonProps, FlexProps, TableCellProps, TableProps as OriginalTableProps, TableRowProps, TooltipProps } from "@chakra-ui/react";
import type { ReactElement } from "react";
import type React from "react";

export type CompareFn<T> = (a: T, b: T) => number;

export type GenCompareFn<T> = (sorter: Sorter<T>) => CompareFn<T>;

export enum SortOrder {
  None,
  Asc,
  Desc,
}

export type Sorter<T> = {
  by?: keyof T;
  order?: SortOrder;
  onSort?: (sorter: Sorter<T>) => void;
  genCompareFn?: GenCompareFn<T>;
};

export type PaginationProps = {
  total?: number;
  page: number;
  pageSize?: number;
  onChange: (page: number) => void;
  unfoldedPages?: number;
  preButtonProps?: ButtonProps;
  nextButtonProps?: ButtonProps;
  pageButtonProps?: ButtonProps;
} & Omit<FlexProps, "onChange" | "children">;

export type PaginationBarButton = {
  disabled?: boolean;
  isSplitter?: boolean;
  navigate?: -1 | 1;
  pageNumber?: number;
  isFocused?: boolean;
  key: number;
};

// with dataIndex field, we use sorter by dataIndex
export type HeadCellPropsWithDataIndex<T, K extends keyof T = keyof T> = {
  Render: (({ dataIndex, rowIndex, colIndex }: { dataIndex: K; rowIndex: number; colIndex: number }) => React.ReactElement) | string | number | React.ReactNode;
  CustomRender?: ({
    dataIndex,
    rowIndex,
    colIndex,
    sort,
    cancelSort,
    toggledSortOrder,
    defaultOrder,
    sortAscColor,
    sortDescColor,
    sorterClick,
    genCompareFn,

    sorter,
    onSort,
  }: {
    dataIndex: K;
    rowIndex: number;
    colIndex: number;

    sort?: boolean;
    cancelSort?: boolean;
    toggledSortOrder: SortOrder;
    defaultOrder?: SortOrder;
    sortAscColor?: string;
    sortDescColor?: string;
    sorterClick: () => void;
    genCompareFn?: GenCompareFn<T>;

    sorter: Sorter<T>;
    onSort: (sorter: Sorter<T>) => void;
  }) => React.ReactElement;
  cellProps?: Omit<TableCellProps, "children">;
  genCompareFn?: GenCompareFn<T>;
  sort?: boolean;
  cancelSort?: boolean;
  sortedColor?: string;
  defaultOrder?: SortOrder;
  tooltipProps?: Omit<TooltipProps, "children">;
};

// without dataIndex field, we need provider sort
export type HeadCellProps<T> = {
  Render: (({ rowIndex, colIndex }: { rowIndex: number; colIndex: number }) => React.ReactElement) | string | number | React.ReactNode;
  CustomRender?: ({
    rowIndex,
    colIndex,

    sort,
    defaultOrder,
    sortAscColor,
    sortDescColor,
    genCompareFn,
    sorter,
    onSort,
  }: {
    rowIndex: number;
    colIndex: number;
    sort?: boolean;
    defaultOrder?: SortOrder;
    sortAscColor?: string;
    sortDescColor?: string;
    genCompareFn?: GenCompareFn<T>;
    sorter: Sorter<T>;
    onSort: (sorter: Sorter<T>) => void;
  }) => React.ReactElement;
  cellProps?: Omit<TableCellProps, "children">;
  genCompareFn?: GenCompareFn<T>;
  sort?: boolean;
  cancelSort?: boolean;
  sortedColor?: string;
  defaultOrder?: SortOrder;
  tooltipProps?: Omit<TooltipProps, "children">;
};

export type HeadCellRender<T, K extends keyof T = keyof T> = (HeadCellProps<T> | HeadCellPropsWithDataIndex<T, K>) & {
  dataIndex?: keyof T;
  rowIndex: number;
  colIndex: number;
};

type SkeletonBody<T> = {
  showSkeleton?: boolean | (({ rowData, rowIndex, colIndex }: { rowData?: T; rowIndex: number; colIndex: number }) => boolean);
  Skeleton?: ({ rowData, rowIndex, colIndex }: { rowData?: T; colIndex: number; rowIndex: number }) => React.ReactElement;
};

export type BodyCellPropsWithDataIndex<T, K extends keyof T = keyof T> = {
  Render:
    | (({
        dataIndex,
        rowData,
        cellData,
        rowIndex,
        colIndex,
      }: {
        dataIndex: K;
        rowData: T;
        cellData: T[K];
        rowIndex: number;
        colIndex: number;
      }) => React.ReactElement | React.ReactNode)
    | string
    | number
    | React.ReactNode;
  CustomRender?: ({
    dataIndex,
    rowData,
    cellData,
    rowIndex,
    colIndex,
  }: {
    dataIndex: K;
    rowData: T;
    cellData: T[K];
    rowIndex: number;
    colIndex: number;
  }) => React.ReactElement;
  cellProps?: Omit<TableCellProps, "children">;
} & SkeletonBody<T>;

export type BodyCellProps<T> = {
  Render: (({ rowData, rowIndex, colIndex }: { rowData: T; rowIndex: number; colIndex: number }) => React.ReactElement) | string | number | React.ReactNode;
  CustomRender?: ({ rowData, rowIndex, colIndex }: { rowData: T; rowIndex: number; colIndex: number }) => React.ReactElement;
  cellProps?: Omit<TableCellProps, "children">;
} & SkeletonBody<T>;

export type BodyCellRender<T> = (BodyCellProps<T> | BodyCellPropsWithDataIndex<T>) & {
  rowData: T;
  dataIndex?: keyof T;
  rowIndex: number;
  colIndex: number;
};

export type ColOptsWithDataIndex<T, K extends keyof T = keyof T> = {
  headCell: HeadCellPropsWithDataIndex<T, K> | HeadCellPropsWithDataIndex<T, K>[];
  commonCell: {
    cellProps: TableCellProps;
    isHidden?: boolean;
    dataIndex: keyof T;
  };
  bodyCell: BodyCellPropsWithDataIndex<T>;
};

export type ColOpts<T> = {
  headCell: HeadCellProps<T> | HeadCellProps<T>[];
  commonCell: {
    cellProps: TableCellProps;
    isHidden?: boolean;
  };
  bodyCell: BodyCellProps<T>;
};

export type RowProps<T> = {
  commonRow?: TableRowProps;
  theadRow?: TableRowProps | TableRowProps[];
  tbodyRow?: TableRowProps;
  genTbodyRow?: ({ rowIndex, rowData }: { rowIndex: number; rowData?: T }) => TableRowProps;
};

export type TableProps<T> = {
  rowProps?: RowProps<T>;
  dataSource?: T[];
  sorter?: Sorter<T>;
  pagination?: PaginationProps;
  noResultText?: string;
  CustomNoResult?: () => JSX.Element;
  tableProps?: OriginalTableProps;
  containerProps?: BoxProps;
  skeletonRowCount?: number;
  afterSorting?: () => void;
  children?: ReactElement<any, (p: any) => ReactElement | null> | ReactElement<any, (p: any) => ReactElement | null>[];
};
