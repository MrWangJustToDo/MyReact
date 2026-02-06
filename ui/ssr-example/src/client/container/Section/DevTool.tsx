import { Box, Container, Flex, Heading, Text, VStack, HStack, Button, useColorModeValue, Card, Image, Icon, Tag } from "@chakra-ui/react";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { ExternalLinkIcon } from "lucide-react";

import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";

const code = `// 1. clone the @my-react devtool repo
git clone https://github.com/MrWangJustToDo/myreact-devtools.git

// 2. init project
pnpm install

// 3. prepare
pnpm run build:packages

// 4. dev / build
// local dev by web
pnpm run dev:web
// install this extension in chrome
pnpm run build:extension

// 5. connect a @my-react app
// copy the connect command in the webUI into the @my-react app console`;

export const DevToolSection = () => {
  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");
  const img = useColorModeValue("1.png", "2.png");

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
              DevTools
              <Tag fontSize="xs" color="red.500" fontWeight="600">
                Beta
              </Tag>
            </Heading>

            {/* Subtitle */}
            <HStack spacing="2" marginTop="3">
              <Text fontSize="sm" color={subtleTextColor}>
                @my-react/devtools
              </Text>
            </HStack>

            {/* Description */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              A Chrome extension to debug @my-react apps, just like React DevTools. Inspect component trees, state, and performance in real-time.
            </Text>

            {/* CTA Button */}
            <HStack spacing="3" marginTop="8">
              <Button
                as="a"
                href="https://github.com/MrWangJustToDo/myreact-devtools"
                target="_blank"
                colorScheme="purple"
                size="md"
                rightIcon={<Icon as={ExternalLinkIcon} boxSize="4" />}
                _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                View Repository
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
                <SandpackCodeEditor readOnly style={{ height: "420px" }} />
              </SandpackLayout>
            </SandpackProvider>
          </Box>
        </Section>
      </Flex>

      {/* DevTools Screenshot */}
      <Flex justifyContent="center" width="100%" marginTop="8">
        <Card overflow="hidden" borderRadius="xl" marginX={{ base: "4", md: "6%", lg: "8%" }} width={{ md: "90%" }} boxShadow="lg">
          <Image src={`./${img}`} alt="@my-react DevTools" />
        </Card>
      </Flex>
    </Container>
  );
};
