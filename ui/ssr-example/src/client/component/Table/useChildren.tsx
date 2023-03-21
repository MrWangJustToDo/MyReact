import { Tbody, Thead, Tr } from "@chakra-ui/react";
import once from "lodash/once";
import { Children, Fragment, isValidElement, useCallback, useRef } from "react";

import { Cell } from "./Cell";
import { Column } from "./Column";
import { HeadCell } from "./HeadCell";

import type { ColumnBodyCellRender, ColumnHeadCellRender, ColumnParams } from "./Column";
import type { HeadCellProps, HeadCellPropsWithDataIndex, RowProps } from "./type";
import type { ReactElement } from "react";

function useHead<T>(headCellRender: ColumnHeadCellRender[][], rowProps: RowProps<T> = {}) {
  const renderRef = useRef<{
    headCellRender: ColumnHeadCellRender[][];
    rowProps: RowProps<T>;
  }>({
    headCellRender,
    rowProps,
  });

  renderRef.current = { headCellRender, rowProps };

  return useCallback(() => {
    const {
      headCellRender,
      rowProps: { commonRow, theadRow },
    } = renderRef.current;
    return (
      <Thead>
        {headCellRender.map((headCell, rowIndex) => {
          const trProps = {
            ...commonRow,
            ...(Array.isArray(theadRow) ? theadRow[rowIndex] : theadRow),
          };
          return (
            <Tr key={rowIndex} {...trProps}>
              {/* we invoke this as function instead of component, so React will not unmount rendered node when rerender */}
              {headCell.map((CellRender, colIndex) => CellRender({ rowIndex, colIndex }))}
            </Tr>
          );
        })}
      </Thead>
    );
  }, []);
}

function useBody<T>(bodyCellRender: ColumnBodyCellRender<T>[], rowProps: RowProps<T> = {}) {
  const renderRef = useRef<{
    bodyCellRender: ColumnBodyCellRender<T>[];
    rowProps: RowProps<T>;
  }>({ bodyCellRender, rowProps });
  renderRef.current = { bodyCellRender, rowProps };
  return useCallback(({ dataSource }: { dataSource: T[] }) => {
    const {
      bodyCellRender,
      rowProps: { commonRow, tbodyRow, genTbodyRow },
    } = renderRef.current;
    return (
      <Tbody>
        {dataSource.map((rowData, rowIndex) => {
          const trProps = {
            ...commonRow,
            ...tbodyRow,
          };
          const dynamicProps = genTbodyRow ? genTbodyRow({ rowIndex, rowData }) : {};

          return (
            <Tr key={rowIndex} {...trProps} {...dynamicProps}>
              {bodyCellRender.map((CellRender, colIndex) => CellRender({ rowData, rowIndex, colIndex }))}
            </Tr>
          );
        })}
      </Tbody>
    );
  }, []);
}

const logOnceDev = once(() => {
  console.warn("pls make sure:\n 1. do not add hook into hyper column usage.\n 2. hyper column usage do not support hot reload");
});

export function useChildren<T>(
  children?: ReactElement<any, (p: any) => ReactElement | null> | ReactElement<any, (p: any) => ReactElement | null>[],
  rowProps?: RowProps<T>,
) {
  const headCellRenderTemp: ColumnHeadCellRender[][] = [];
  const bodyCellRenderTemp: ColumnBodyCellRender<T>[] = [];

  let _children = children;

  if (isValidElement(children) && children.type === Fragment) {
    _children = children.props.children;
  }

  Children.forEach(_children, (child) => {
    let _child: ReactElement | null = null;
    if (child?.type === Column) {
      _child = child;
    } else if (typeof child?.type === "function") {
      try {
        if (process.env.NODE_ENV === "development" && process.env.IS_CLIENT) {
          logOnceDev();
        }
        const rendered = child.type(child.props);
        if (isValidElement(rendered) && rendered.type === Column) {
          _child = rendered;
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    // more usage write here
    if (_child) {
      const { dataIndex, cellProps, headCellProps, bodyCellProps, isHidden, headCellRender, bodyCellRender } = _child.props as ColumnParams<T>;

      const headCellArrayRender: HeadCellProps<T>[] | HeadCellPropsWithDataIndex<T>[] = Array.isArray(headCellRender) ? headCellRender : [headCellRender];

      const _childrenHeads = headCellArrayRender.map((headCellRender) => {
        const _childrenHead = ({ rowIndex, colIndex }: { rowIndex: number; colIndex: number }) => (
          <HeadCell<T>
            key={dataIndex ? String(dataIndex) : `${rowIndex}-${colIndex}`}
            rowIndex={rowIndex}
            colIndex={colIndex}
            dataIndex={dataIndex}
            cellProps={{
              ...cellProps,
              ...headCellProps,
              ...headCellRender.cellProps,
            }}
            {...headCellRender}
          />
        );
        return _childrenHead;
      });

      const _childrenBody = ({ rowIndex, colIndex, rowData }: { rowIndex: number; colIndex: number; rowData: T }) => (
        <Cell<T>
          key={dataIndex ? String(dataIndex) : `${rowIndex}-${colIndex}`}
          rowIndex={rowIndex}
          colIndex={colIndex}
          rowData={rowData}
          dataIndex={dataIndex}
          cellProps={{
            ...cellProps,
            ...bodyCellProps,
            ...bodyCellRender.cellProps,
          }}
          {...bodyCellRender}
        />
      );

      if (!isHidden) {
        bodyCellRenderTemp.push(_childrenBody);
        _childrenHeads.forEach((_childrenHead, rowIndex) => {
          headCellRenderTemp[rowIndex] = headCellRenderTemp[rowIndex] || [];
          headCellRenderTemp[rowIndex].push(_childrenHead);
        });
      }
    }
  });

  const Head = useHead(headCellRenderTemp, rowProps);
  const Body = useBody(bodyCellRenderTemp, rowProps);

  // NOTE it is necessary to memo this render function, because we invoke this function as render Element
  const Content = useCallback(
    ({ dataSource }: { dataSource: T[] }) => (
      <>
        <Head />
        <Body dataSource={dataSource} />
      </>
    ),
    [Body, Head],
  );

  return Content;
}
