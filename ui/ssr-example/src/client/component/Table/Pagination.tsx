import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

import { usePagination, usePaginationBar } from "./usePaginationController";

import type { PaginationProps } from "./type";
import type { ButtonProps } from "@chakra-ui/react";

const Navigator = (props: ButtonProps) => (
  <Button
    border="1px"
    size="sm"
    borderColor="gray.200"
    textStyle="light"
    fontWeight="normal"
    _active={{
      background: "none",
    }}
    _hover={{
      background: "none",
    }}
    fontSize="sm"
    {...props}
  >
    {props.children}
  </Button>
);

export const Pagination = ({ page, total, pageSize = 50, onChange, preButtonProps, nextButtonProps, ...restProps }: PaginationProps) => {
  const { hasNextPage, hasPrePage } = usePagination({
    page,
    total,
    pageSize,
  });

  return (
    <Flex justifyContent="flex-end" {...restProps}>
      {hasPrePage && (
        <Navigator
          aria-label="Prev page"
          leftIcon={<Icon as={AiOutlineLeft} />}
          onClick={() => {
            onChange(page - 1);
          }}
          marginEnd="4"
          {...preButtonProps}
        >
          {preButtonProps?.children || "prevPage"}
        </Navigator>
      )}
      {hasNextPage && (
        <Navigator
          aria-label="Next page"
          rightIcon={<Icon as={AiOutlineRight} />}
          onClick={() => {
            onChange(page + 1);
          }}
          marginEnd={{ base: 4, lg: 0 }}
          {...nextButtonProps}
        >
          {nextButtonProps?.children || "nextPage"}
        </Navigator>
      )}
    </Flex>
  );
};

const BarNavigator = ({ isFocused, children, ...resProps }: ButtonProps & { isFocused?: boolean }) => {
  const activeStyles = {
    background: "blue.500",
    color: "white",
  };

  const hoverStyles = {
    background: "gray.200",
  };
  return (
    <Button
      background={isFocused ? activeStyles.background : "unset"}
      color={isFocused ? activeStyles.color : "unset"}
      minWidth="6"
      width="6"
      height="6"
      paddingX="2"
      fontWeight="semibold"
      fontSize="sm"
      marginX="1"
      borderRadius="2px"
      outlineOffset="0"
      boxSizing="border-box"
      _active={{ background: "unset" }}
      _hover={isFocused ? activeStyles : hoverStyles}
      {...resProps}
    >
      {children}
    </Button>
  );
};

export const PaginationBar = ({
  total,
  page,
  pageSize = 50,
  onChange,
  unfoldedPages,
  preButtonProps,
  nextButtonProps,
  pageButtonProps,
  ...restProps
}: PaginationProps) => {
  const { items } = usePaginationBar({
    page,
    pageSize,
    total,
    unfoldedPages,
  });
  return (
    <Box display="inline-block" borderRadius="4px" {...restProps}>
      {items.map((item) => {
        if (item.isSplitter) {
          return (
            <BarNavigator
              key={item.key}
              _hover={{
                background: "unset",
              }}
              cursor="default!important"
              {...pageButtonProps}
            >
              ...
            </BarNavigator>
          );
        }
        if (item.navigate) {
          const { navigate = -1, disabled } = item;
          const chevronStyles = {
            width: "24px",
            height: "24px",
          };
          const navigatorStyles =
            navigate < 0
              ? {
                  ml: 0,
                }
              : {
                  mr: 0,
                };
          return (
            <BarNavigator
              key={item.key}
              disabled={disabled}
              onClick={() => onChange(navigate + page)}
              {...navigatorStyles}
              {...(navigate < 0 ? preButtonProps : nextButtonProps)}
              className={`table__pagination__${navigate < 0 ? "previous" : "next"}-page-button`}
            >
              {navigate < 0 ? <Icon {...chevronStyles} as={AiOutlineLeft} /> : <Icon {...chevronStyles} as={AiOutlineRight} />}
            </BarNavigator>
          );
        }
        const { pageNumber = page, disabled, isFocused } = item;
        return (
          <BarNavigator key={item.key} disabled={disabled} onClick={() => onChange(pageNumber)} isFocused={isFocused} {...pageButtonProps}>
            {pageNumber}
          </BarNavigator>
        );
      })}
    </Box>
  );
};
