/* eslint-disable @typescript-eslint/no-require-imports */
import { Box, Button, Checkbox, Container, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { Rspack, Webpack, Vite, NextJs, Remix, ReactRouter } from "@client/component/Icons";
import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";
import { mark } from "@client/utils/markdown";
import { noBase } from "@shared";

const tsxMd = `
\`\`\`tsx
import { useState, useCallback } from '@my-react/react';
import { createRoot } from '@my-react/react-dom';

const useCount = () => {
  const [state, setState] = useState(0);
  const add = useCallback(() => setState(i => i + 1), []);
  const del = useCallback(() => setState(i => i - 1), []);

  return [state, add, del];
};

const App = () => {
  const [state, add, del] = useCount();

  return <div>
    <p>{state}</p>
    <button onClick={add}>add</button>
    <button onClick={del}>del</button>
  </div>
}

createRoot(document.querySelector('#root')).render(<App />);
\`\`\`
`;

const renderBody = mark.render(tsxMd);

export const MainSection = () => {
  const navigate = useNavigate();

  const reactVersion = __REACT__ ? "--" : require("@my-react/react").version;

  const enableMockReact = __REACT__ ? "--" : require("@my-react/react").__my_react_shared__.enableMockReact;

  const reactDOMVersion = __REACT__ ? "--" : require("@my-react/react-dom").version;

  const { formatMessage } = useIntl();

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" paddingTop={{ base: "16", md: "20" }}>
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        {/* Left Section */}
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          {/* Title */}
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            marginBottom="6"
            fontWeight="bold"
            lineHeight="1.1"
            color="purple.600"
            _dark={{ color: "purple.400" }}
          >
            {formatMessage({ id: "@my-react" })}
          </Heading>

          {/* Description */}
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="500" marginBottom="6" lineHeight="1.6" color="gray.700" _dark={{ color: "gray.300" }}>
            {formatMessage({ id: "description" })}
          </Text>

          {/* Version Info */}
          <Flex marginY="6" gap="2" flexWrap="wrap" alignItems="center" fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            <Text>
              Version:{" "}
              <Text as="span" fontWeight="600">
                v{reactVersion}
              </Text>
            </Text>
            <Text _dark={{ color: "gray.600" }}>•</Text>
            <Text>
              react-dom:{" "}
              <Text as="span" fontWeight="600">
                v{reactDOMVersion}
              </Text>
            </Text>
            {!__REACT__ && (
              <>
                <Text _dark={{ color: "gray.600" }}>•</Text>
                <Flex alignItems="center" gap="1">
                  <Checkbox size="sm" isChecked={enableMockReact.current} isReadOnly />
                  <Text>Mock</Text>
                </Flex>
              </>
            )}
          </Flex>

          {/* Ecosystem */}
          <Box marginY="8">
            <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="wide" color="gray.500" _dark={{ color: "gray.500" }} marginBottom="4">
              Ecosystem
            </Text>
            <Flex gap="4" alignItems="center" flexWrap="wrap">
              <Link href="https://webpack.js.org/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                <Webpack height={36} width={36} />
              </Link>
              <Link href="https://vite.dev/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                <Vite height={36} width={36} />
              </Link>
              <Link href="https://rspack.dev/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                <Rspack height={36} width={36} />
              </Link>
              <Link href="https://nextjs.org/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                <NextJs width={36} height={36} fill="currentcolor" />
              </Link>
              <Link href="https://remix.run/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                <Remix width={36} height={36} fill="currentcolor" />
              </Link>
              <Link href="https://reactrouter.com/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                <ReactRouter height={36} width={36} fill="currentcolor" />
              </Link>
            </Flex>
          </Box>

          {/* CTA Buttons */}
          <Flex marginTop="10" gap="3" display={{ base: "none", md: "flex" }} flexWrap="wrap">
            <Button
              colorScheme="purple"
              size="md"
              onClick={() => navigate(noBase ? "/Blog" : `/${__BASENAME__}/Blog`)}
              _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
              transition="all 0.2s"
            >
              View Examples
            </Button>
            <Button
              variant="outline"
              colorScheme="purple"
              size="md"
              as="a"
              href="https://github.com/MrWangJustToDo/MyReact"
              target="_blank"
              _hover={{ transform: "translateY(-1px)", bg: "purple.50", _dark: { bg: "purple.900" } }}
              transition="all 0.2s"
            >
              GitHub
            </Button>
            <Button
              variant="ghost"
              size="md"
              as="a"
              href="https://mrwangjusttodo.github.io/MrWangJustToDo.io?overlay=open&playGround=MyReact"
              target="_blank"
              _hover={{ bg: "gray.100", _dark: { bg: "gray.800" } }}
              transition="all 0.2s"
            >
              Playground
            </Button>
          </Flex>
        </Box>

        {/* Right Code Section */}
        <Section>
          <Box
            className="typo"
            overflow={{ base: "hidden", lg: "auto" }}
            border="1px solid"
            maxWidth={{ md: "55vw", lg: "45vw" }}
            borderColor="cardBorderColor"
            marginTop={{ base: "10%", md: "0" }}
            marginBottom={{ base: "6%" }}
            borderRadius="0.8em"
            fontSize={{ base: "sm", lg: "medium" }}
            boxShadow="lg"
            sx={{
              ["pre"]: {
                margin: "0 !important",
              },
            }}
            dangerouslySetInnerHTML={{ __html: renderBody }}
          />
        </Section>
      </Flex>
    </Container>
  );
};
