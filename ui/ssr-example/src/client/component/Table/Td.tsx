import { Td as OriginalTd } from "@chakra-ui/react";

import { ErrorCatch } from "./ErrorCatch";

import type { TableCellProps } from "@chakra-ui/react";

export const Td = (props: TableCellProps) => {
  const { children, ...resProps } = props;
  return (
    <OriginalTd {...resProps}>
      <ErrorCatch>{children}</ErrorCatch>
    </OriginalTd>
  );
};
