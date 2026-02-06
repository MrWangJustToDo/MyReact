/* eslint-disable @typescript-eslint/no-require-imports */
import { Box, Button, Checkbox, Container, Flex, Heading, Link, Text, Icon, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { SandpackCodeEditor, SandpackLayout, SandpackProvider } from "@codesandbox/sandpack-react";
import { GithubIcon, PlayIcon, BookOpenIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { Rspack, Webpack, Vite, NextJs, Remix, ReactRouter } from "@client/component/Icons";
import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";
import { noBase } from "@shared";

const code = `import { useState, useCallback } from '@my-react/react';
import { createRoot } from '@my-react/react-dom';

const useCount = () => {
  const [state, setState] = useState(0);
  const add = useCallback(() => setState(i => i + 1), []);
  const del = useCallback(() => setState(i => i - 1), []);

  return [state, add, del];
};

const App = () => {
  const [state, add, del] = useCount();

  return (
    <div>
      <p>{state}</p>
      <button onClick={add}>add</button>
      <button onClick={del}>del</button>
    </div>
  );
};

createRoot(document.querySelector('#root')).render(<App />);`;

export const MainSection = () => {
  const navigate = useNavigate();

  const reactVersion = __REACT__ ? "--" : require("@my-react/react").version;
  const enableMockReact = __REACT__ ? "--" : require("@my-react/react").__my_react_shared__.enableMockReact;
  const reactDOMVersion = __REACT__ ? "--" : require("@my-react/react-dom").version;

  const { formatMessage } = useIntl();

  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");
  const ecosystemBg = useColorModeValue("gray.50", "gray.800");

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" paddingTop={{ base: "16", md: "20" }}>
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        {/* Left Section - Content */}
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          <VStack align="start" spacing="0">
            {/* Title */}
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.1"
              color="purple.600"
              _dark={{ color: "purple.400" }}
            >
              {formatMessage({ id: "@my-react" })}
            </Heading>

            {/* Version Badge - inline with title area */}
            <HStack spacing="2" marginTop="3">
              <Text fontSize="sm" fontWeight="600" color={subtleTextColor}>
                v{reactVersion}
              </Text>
              <Text color="gray.300">|</Text>
              <Text fontSize="sm" color={subtleTextColor}>
                react-dom v{reactDOMVersion}
              </Text>
              {!__REACT__ && (
                <>
                  <Text color="gray.300">|</Text>
                  <HStack spacing="1">
                    <Checkbox size="sm" isChecked={enableMockReact.current} isReadOnly colorScheme="purple" />
                    <Text fontSize="sm" color={subtleTextColor}>
                      Mock
                    </Text>
                  </HStack>
                </>
              )}
            </HStack>

            {/* Description */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              {formatMessage({ id: "description" })}
            </Text>

            {/* CTA Buttons */}
            <HStack spacing="3" marginTop="8" flexWrap="wrap">
              <Button
                colorScheme="purple"
                size="md"
                leftIcon={<Icon as={BookOpenIcon} boxSize="4" />}
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
                leftIcon={<Icon as={GithubIcon} boxSize="4" />}
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
                leftIcon={<Icon as={PlayIcon} boxSize="4" />}
                as="a"
                href="https://mrwangjusttodo.github.io/MrWangJustToDo.io?overlay=open&playGround=MyReact"
                target="_blank"
                _hover={{ bg: "gray.100", _dark: { bg: "gray.800" } }}
                transition="all 0.2s"
              >
                Playground
              </Button>
            </HStack>

            {/* Ecosystem - as a card */}
            <Box marginTop="10" padding="5" borderRadius="xl" bg={ecosystemBg} width="100%">
              <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="wide" color="gray.500" marginBottom="4">
                Ecosystem
              </Text>
              <Flex gap="5" alignItems="center" flexWrap="wrap">
                <Link href="https://webpack.js.org/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                  <Webpack height={28} width={28} />
                </Link>
                <Link href="https://vite.dev/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                  <Vite height={28} width={28} />
                </Link>
                <Link href="https://rspack.dev/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                  <Rspack height={28} width={28} />
                </Link>
                <Link href="https://nextjs.org/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                  <NextJs width={28} height={28} fill="currentcolor" />
                </Link>
                <Link href="https://remix.run/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                  <Remix width={28} height={28} fill="currentcolor" />
                </Link>
                <Link href="https://reactrouter.com/" target="_blank" _hover={{ opacity: 0.6 }} transition="opacity 0.2s">
                  <ReactRouter height={28} width={28} fill="currentcolor" />
                </Link>
              </Flex>
            </Box>
          </VStack>
        </Box>

        {/* Right Section - Code */}
        <Section>
          <Box
            className="typo"
            overflow={{ base: "hidden", lg: "auto" }}
            border="1px solid"
            maxWidth={{ md: "55vw", lg: "45vw" }}
            minWidth={{ md: "40vw" }}
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
          >
            <SandpackProvider
              files={{
                ["App.tsx"]: {
                  code,
                  active: true,
                },
              }}
              theme={colorScheme}
            >
              <SandpackLayout style={{ border: "none" }}>
                <SandpackCodeEditor readOnly style={{ height: "480px" }} />
              </SandpackLayout>
            </SandpackProvider>
          </Box>
        </Section>
      </Flex>
    </Container>
  );
};
