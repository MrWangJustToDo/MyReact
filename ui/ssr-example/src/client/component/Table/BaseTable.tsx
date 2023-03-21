import { Table, TableContainer } from "@chakra-ui/react";

import type { TableProps } from "@chakra-ui/react";

export const BaseTable = ({ ...restProps }: TableProps) => (
  <TableContainer>
    <Table variant="simple" {...restProps} />
  </TableContainer>
);
