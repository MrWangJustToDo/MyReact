import { useQuery } from "@apollo/client";
import { Button, Container, Flex, HStack, Icon, Tag, TagLabel, TagLeftIcon, Text, Box } from "@chakra-ui/react";
import { GetStarCountDocument } from "@site/graphql";
import { motion, useScroll, useTransform } from "framer-motion";
import debounce from "lodash/debounce";
import { memo, useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router";

import { CONTAINER_WIDTH } from "@client/config/container";
import { noBase } from "@shared";

import { ColorMode } from "../ColorMode";

import { GlobalStyle } from "./GlobalStyle";

const map = {
  "/": "@my-react",
  "/blog": "Blog",
  "/about": "Config",
  "/tldraw": "Tldraw",
};

const _Header = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const ref = useRef<null | number>(null);

  const [direction, setDirection] = useState<"down" | "up">("up");

  const { formatMessage } = useIntl();

  const { scrollY } = useScroll();

  useEffect(() => {
    const onChange = debounce(() => {
      const current = scrollY.get();
      if (ref.current !== null) {
        if (current > ref.current) {
          setDirection("down");
        } else {
          setDirection("up");
        }
      }
      ref.current = current;
    }, 16);

    scrollY.onChange(onChange);

    return () => scrollY.clearListeners();
  }, [scrollY]);

  const opacity = useTransform(scrollY, [0, 0.2, 0.4], [0, 0.4, 1]);

  const id = (map[location.pathname.toLowerCase()] as string) || "@my-react";

  const { data, loading } = useQuery(GetStarCountDocument, {
    variables: {
      name: "MyReact",
      owner: "MrWangJustToDo",
    },
  });

  return (
    <>
      <Container maxWidth={CONTAINER_WIDTH} paddingX={{ base: "3", lg: "6" }} className="site-header">
        <GlobalStyle />
        <Flex id="desktop-header" paddingY="2" justifyContent="space-between" alignItems="center" display={{ base: "none", md: "flex" }}>
          <Text as="h1" fontSize={{ base: "xl", md: "2xl" }} fontWeight={{ base: "semibold", md: "bold" }} noOfLines={1}>
            {formatMessage({ id })}
          </Text>
          <HStack gap={{ base: "4px", lg: "8px" }}>
            <Button variant="ghost" size="sm" onClick={() => navigate(noBase ? "/" : `/${__BASENAME__}/`)}>
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(noBase ? "/Blog" : `/${__BASENAME__}/Blog`)}>
              Example
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(noBase ? "/Tldraw" : `/${__BASENAME__}/Tldraw`)}>
              Tldraw
            </Button>
            {!__REACT__ && __DEVELOPMENT__ && (
              <Button variant="ghost" size="sm" onClick={() => navigate(noBase ? "/About" : `/${__BASENAME__}/About`)}>
                About
              </Button>
            )}
            <ColorMode />
            <Button variant="outline" size="sm" as="a" href="https://github.com/MrWangJustToDo/MyReact" target="_blank">
              <Icon as={SiGithub} />
              {loading ? null : (
                <Tag variant="subtle" colorScheme="orange" marginLeft="3">
                  <TagLeftIcon as={FaStar} color="orange.300" />
                  <TagLabel>{data?.repository?.stargazerCount}</TagLabel>
                </Tag>
              )}
            </Button>
          </HStack>
        </Flex>
        <Box id="mobile-header" display={{ base: "block", md: "none" }} height={12} overflow="hidden">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            height={direction === "up" ? "full" : "0%"}
            width="full"
            transition="height 0.3s"
            overflow="hidden"
          >
            <Text as="h1" fontSize={{ base: "xl", md: "2xl" }} fontWeight={{ base: "semibold", md: "bold" }} noOfLines={1}>
              {formatMessage({ id })}
            </Text>
            <HStack gap={{ base: "4px", lg: "8px" }}>
              <ColorMode />
              <Button variant="outline" size="sm" as="a" href="https://github.com/MrWangJustToDo/MyReact" target="_blank">
                <Icon as={SiGithub} />
                {loading ? null : (
                  <Tag variant="subtle" colorScheme="orange" marginLeft="3">
                    <TagLeftIcon as={FaStar} color="orange.300" />
                    <TagLabel>{data?.repository?.stargazerCount}</TagLabel>
                  </Tag>
                )}
              </Button>
            </HStack>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" height="full" width="full">
            <Button variant="ghost" size="sm" onClick={() => navigate(noBase ? "/" : `/${__BASENAME__}/`)}>
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(noBase ? "/Blog" : `/${__BASENAME__}/Blog`)}>
              Example
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(noBase ? "/Tldraw" : `/${__BASENAME__}/Tldraw`)}>
              Tldraw
            </Button>
            {!__REACT__ && __DEVELOPMENT__ && (
              <Button variant="ghost" size="sm" onClick={() => navigate(noBase ? "/About" : `/${__BASENAME__}/About`)}>
                About
              </Button>
            )}
          </Flex>
        </Box>
      </Container>
      <motion.div style={{ opacity, borderBottom: "1px solid rgba(100, 100, 100, .2)" }}></motion.div>
    </>
  );
};

export const Header = memo(_Header);
