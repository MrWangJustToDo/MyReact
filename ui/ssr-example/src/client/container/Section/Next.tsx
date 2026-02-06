import { Box, Button, Container, Flex, Heading, Icon, Text, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import { SandpackCodeEditor, SandpackLayout, SandpackProvider } from "@codesandbox/sandpack-react";
import { ChevronsRightIcon, ExternalLinkIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { Card } from "@client/component/Card";
import { NextPlayground } from "@client/component/NextPlayground";
import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";
import { useIsMounted } from "@client/hooks";

const code = `// 1. create a Next.js project

// 2. install @my-react
pnpm add @my-react/react @my-react/react-dom

pnpm add -D @my-react/react-refresh @my-react/react-refresh-tools

// 3. config next.config.js
const withNext = require('@my-react/react-refresh-tools/withNext');

module.exports = withNext(nextConfig);

// 4. start
pnpm run dev`;

export const NextSection = () => {
  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");

  const { hash } = useLocation();
  const isMounted = useIsMounted();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (isMounted && hash && hash === "#next-section") {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [hash, isMounted]);

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        {/* Left Section - Content */}
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          <VStack align="start" spacing="0">
            {/* Title */}
            <Heading
              as="h2"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.1"
              color="purple.600"
              _dark={{ color: "purple.400" }}
            >
              Next.js
            </Heading>

            {/* Subtitle */}
            <Text fontSize="sm" color={subtleTextColor} marginTop="3">
              @my-react/react-refresh-tools
            </Text>

            {/* Description */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              Run your Next.js applications with @my-react. Full SSR/SSG support with optimized hydration.
            </Text>

            {/* Note */}
            <Text fontSize="sm" color={subtleTextColor} marginTop="4">
              Note: Currently @my-react does not support React Server Components (RSC).
            </Text>

            {/* CTA Buttons */}
            <HStack spacing="3" marginTop="8">
              <Button
                as="a"
                href="https://mrwangjusttodo.github.io/MrWangJustToDo.io"
                target="_blank"
                colorScheme="purple"
                size="md"
                rightIcon={<Icon as={ExternalLinkIcon} boxSize="4" />}
                _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                Online Example
              </Button>
              <Button
                as="a"
                href="https://github.com/MrWangJustToDo/MyReact/tree/main/ui/next-example"
                target="_blank"
                variant="outline"
                colorScheme="purple"
                size="md"
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                View Template
              </Button>
            </HStack>
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
                [`setup.bash`]: {
                  code,
                  active: true,
                },
              }}
              theme={colorScheme}
            >
              <SandpackLayout style={{ border: "none" }}>
                <SandpackCodeEditor readOnly style={{ height: "380px" }} />
              </SandpackLayout>
            </SandpackProvider>
          </Box>
        </Section>
      </Flex>

      {/* Playground Card */}
      <Card ref={ref} overflow="hidden" marginX={{ base: "4", md: "6%", lg: "8%" }} marginTop="8">
        <Flex padding="3" fontFamily="monospace" alignItems="center" as="a" href="#next-section">
          <Icon as={ChevronsRightIcon} />
          <Text marginLeft={2} fontWeight="500">
            Next.js + @my-react
          </Text>
        </Flex>
        <NextPlayground />
      </Card>
    </Container>
  );
};
