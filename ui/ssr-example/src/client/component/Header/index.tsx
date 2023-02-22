import { Container, Flex, Text } from "@chakra-ui/react";
import { memo } from "react";
import { useIntl } from "react-intl";

import { CONTAINER_WIDTH } from "@client/config/container";

import { ColorMode } from "../ColorMode";

import { GlobalStyle } from "./GlobalStyle";

const _Header = () => {
  const { formatMessage } = useIntl();
  return (
    <Container maxWidth={CONTAINER_WIDTH}>
      <GlobalStyle />
      <Flex paddingY="2" justifyContent="space-between" alignItems="center">
        <Text as="h1" fontSize={{ base: "3xl", md: "6xl" }} fontWeight={{ base: "bold", md: "extrabold" }}>
          {formatMessage({ id: "blog" })} <small>{formatMessage({ id: "power" })}</small>
        </Text>
        <ColorMode />
      </Flex>
    </Container>
  );
};

export const Header = memo(_Header);
