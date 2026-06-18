import { Box, Button, Container, Flex, Heading, Icon, Text, VStack, HStack, useColorModeValue, Badge } from "@chakra-ui/react";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { ExternalLinkIcon, TerminalIcon } from "lucide-react";

import { Card } from "@client/component/Card";
import { ClientInkUI } from "@client/component/Ink";
import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";
import { useIsMounted } from "@client/hooks";

const appCode = `// App.tsx
import React, { useState } from "@my-react/react";
import { Text, Box, useInput, useStdout } from "@my-react/react-terminal";

function App() {
  const { stdout } = useStdout();
  const [count, setCount] = useState(0);

  useInput((input, key) => {
    if (input === "q") process.exit(0);
    if (key.return) setCount((c) => c + 1);
    if (key.backspace) setCount((c) => Math.max(0, c - 1));
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        === Terminal UI Demo ===
      </Text>
      <Box marginTop={1}>
        <Text>Count: </Text>
        <Text color="green" bold>{count}</Text>
      </Box>
      <Text dimColor>
        Enter to increment, Backspace to decrement, q to quit
      </Text>
    </Box>
  );
}`;

export const InkSection = () => {
  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");
  const isMounted = useIsMounted();

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        {/* Left Section - Content */}
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          <VStack align="start" spacing="0">
            {/* Badge */}
            <Badge colorScheme="purple" fontSize="xs" marginBottom="2">
              Terminal
            </Badge>

            {/* Title */}
            <HStack spacing="3" alignItems="center">
              <Heading
                as="h2"
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="bold"
                lineHeight="1.1"
                color="purple.600"
                _dark={{ color: "purple.400" }}
              >
                Terminal UI
              </Heading>
              <Icon as={TerminalIcon} boxSize={{ base: "8", md: "10" }} color="purple.500" />
            </HStack>

            {/* Subtitle */}
            <Text fontSize="sm" color={subtleTextColor} marginTop="3">
              @my-react/react-terminal
            </Text>

            {/* Description */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              Build rich terminal interfaces with React. Flexbox layout, styled text, keyboard input handling, and interactive components — all in the terminal.
            </Text>

            {/* Features */}
            <VStack align="start" spacing="2" marginTop="6">
              <Text fontSize="sm" color={subtleTextColor}>
                <Text as="span" fontWeight="600">
                  Flexbox Layout:
                </Text>{" "}
                Use familiar CSS flexbox for terminal element positioning
              </Text>
              <Text fontSize="sm" color={subtleTextColor}>
                <Text as="span" fontWeight="600">
                  Keyboard Input:
                </Text>{" "}
                Full keyboard handling with useInput hook and focus management
              </Text>
              <Text fontSize="sm" color={subtleTextColor}>
                <Text as="span" fontWeight="600">
                  Ink Compatible:
                </Text>{" "}
                API compatible with Ink for easy migration
              </Text>
            </VStack>

            {/* CTA Buttons */}
            <HStack spacing="3" marginTop="8">
              <Button
                as="a"
                href="https://github.com/vadimdemedes/ink"
                target="_blank"
                colorScheme="purple"
                size="md"
                rightIcon={<Icon as={ExternalLinkIcon} boxSize="4" />}
                _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                Ink Docs
              </Button>
              <Button
                as="a"
                href="https://github.com/MrWangJustToDo/MyReact/tree/main/packages/myreact-terminal"
                target="_blank"
                variant="outline"
                colorScheme="purple"
                size="md"
                rightIcon={<Icon as={ExternalLinkIcon} boxSize="4" />}
                _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                View Package
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Right Section - Code */}
        <Section>
          <VStack spacing="4" align="stretch">
            {/* App Code */}
            <Box
              className="typo"
              overflow={{ base: "hidden", lg: "auto" }}
              border="1px solid"
              maxWidth={{ md: "55vw", lg: "45vw" }}
              minWidth={{ md: "40vw" }}
              borderColor="cardBorderColor"
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
                  [`App.tsx`]: {
                    code: appCode,
                    active: true,
                  },
                }}
                theme={colorScheme}
              >
                <SandpackLayout style={{ border: "none" }}>
                  <SandpackCodeEditor readOnly style={{ height: "360px" }} />
                </SandpackLayout>
              </SandpackProvider>
            </Box>
          </VStack>
        </Section>
      </Flex>

      {/* Ink Preview */}
      <Card overflow="hidden" height="45vh" marginX={{ base: "4", md: "6%", lg: "8%" }} marginTop="8" marginBottom="8" boxShadow="lg">
        {__CLIENT__ && isMounted && <ClientInkUI />}
      </Card>
    </Container>
  );
};
