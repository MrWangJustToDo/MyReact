import { Box, Container, Flex, Heading, Link, Text, VStack, HStack, Icon, Code, useColorModeValue } from "@chakra-ui/react";
import { SandpackCodeEditor, SandpackLayout, SandpackProvider } from "@codesandbox/sandpack-react";
import { TerminalIcon, CuboidIcon } from "lucide-react";

import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";

const code = `import { useState, useCallback } from '@my-react/react';
import { createReconciler } from '@my-react/react-reconciler-compact';

const Reconciler = createReconciler({
  // Define the reconciler configuration here
});

const App = () => {
  const [state, setState] = useState(0);

  return (
    <div>
      <p>{state}</p>
      <button onClick={() => setState(i => i + 1)}>add</button>
      <button onClick={() => setState(i => i - 1)}>del</button>
    </div>
  );
};

const container = Reconciler.createContainer(
  document.querySelector('#root')
);

Reconciler.updateContainer(<App />, container, null, () => {
  console.log('Render complete');
});`;

export const ReconcilerSection = () => {
  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("purple.500", "purple.400");

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        {/* Left Section - Content */}
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          <VStack align="start" spacing="0">
            {/* Title - Same size as Main */}
            <Heading
              as="h2"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.1"
              color="purple.600"
              _dark={{ color: "purple.400" }}
            >
              Reconciler
            </Heading>

            {/* Package name */}
            <HStack spacing="2" marginTop="3">
              <Text fontSize="sm" color={subtleTextColor}>
                @my-react/react-reconciler-compact
              </Text>
            </HStack>

            {/* Description - Same size as Main */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              A compact version of react-reconciler with the same APIs. Build custom renderers for any target platform.
            </Text>

            {/* Supported Renderers */}
            <Box marginTop="8">
              <Text fontSize="xs" fontWeight="600" color="gray.500" marginBottom="3">
                Supported Renderers
              </Text>
              <HStack spacing="6">
                <Link href="https://github.com/vadimdemedes/ink" target="_blank" _hover={{ opacity: 0.7 }}>
                  <HStack spacing="2">
                    <Icon as={TerminalIcon} boxSize="4" color={iconColor} />
                    <Text fontSize="sm" fontWeight="500">
                      Ink
                    </Text>
                  </HStack>
                </Link>
                <Link href="https://github.com/pmndrs/react-three-fiber" target="_blank" _hover={{ opacity: 0.7 }}>
                  <HStack spacing="2">
                    <Icon as={CuboidIcon} boxSize="4" color={iconColor} />
                    <Text fontSize="sm" fontWeight="500">
                      React Three Fiber
                    </Text>
                  </HStack>
                </Link>
              </HStack>
            </Box>

            {/* Quick Start */}
            <Box marginTop="6">
              <Text fontSize="xs" fontWeight="600" color="gray.500" marginBottom="3">
                Quick Start
              </Text>
              <VStack align="start" spacing="2">
                <Code fontSize="xs" padding="2" borderRadius="md">
                  pnpm run test:three
                </Code>
                <Code fontSize="xs" padding="2" borderRadius="md">
                  pnpm run test:terminal
                </Code>
              </VStack>
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
                ["reconciler.tsx"]: {
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
