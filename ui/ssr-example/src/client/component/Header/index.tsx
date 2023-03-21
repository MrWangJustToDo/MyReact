import { Button, Container, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { memo } from "react";
import { SiGithub } from "react-icons/si";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router";

import { CONTAINER_WIDTH } from "@client/config/container";
import { getIsStaticGenerate } from "@shared";

import { ColorMode } from "../ColorMode";

import { GlobalStyle } from "./GlobalStyle";

const map = {
  "/": "@my-react",
  "/hot": "hmr",
  "/blog": "blog",
};

const _Header = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { formatMessage } = useIntl();

  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 0.2, 0.4], [0, 0.4, 1]);

  const id = (map[location.pathname.toLowerCase()] as string) || "@my-react";

  return (
    <>
      <Container maxWidth={CONTAINER_WIDTH} paddingX={{ base: "3", lg: "6" }}>
        <GlobalStyle />
        <Flex paddingY="2" justifyContent="space-between" alignItems="center">
          <Text as="h1" fontSize={{ base: "xl", md: "2xl" }} fontWeight={{ base: "semibold", md: "bold" }}>
            {formatMessage({ id })}
          </Text>
          <HStack gap={{ base: "4px", lg: "8px" }}>
            <Button variant="ghost" size="sm" onClick={() => navigate(getIsStaticGenerate() ? "/MyReact/" : "/")}>
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(getIsStaticGenerate() ? "/MyReact/Blog" : "/Blog")}>
              Example
            </Button>
            <ColorMode />
            <Button variant="ghost" size="sm" as="a" href="https://github.com/MrWangJustToDo/MyReact" target="_blank">
              <Icon as={SiGithub} />
            </Button>
          </HStack>
        </Flex>
      </Container>
      <motion.div style={{ opacity, borderBottom: "1px solid rgba(100, 100, 100, .2)" }}></motion.div>
    </>
  );
};

export const Header = memo(_Header);
