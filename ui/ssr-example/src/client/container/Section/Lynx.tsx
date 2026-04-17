import { Box, Button, Container, Flex, Heading, Icon, Text, VStack, HStack, useColorModeValue, Badge, SimpleGrid } from "@chakra-ui/react";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { ExternalLinkIcon, SmartphoneIcon } from "lucide-react";

import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";

const configCode = `// lynx.config.ts
import { defineConfig } from "@lynx-js/rspeedy";
import { pluginMyReactLynx } from "@my-react/react-lynx/plugin";

export default defineConfig({
  plugins: [pluginMyReactLynx()],
});`;

const appCode = `// src/index.tsx
import { root, useInitData, InitDataProvider } from "@my-react/react-lynx";

function App() {
  const initData = useInitData();
  
  return (
    <view className="container">
      <text className="title">Hello Lynx!</text>
      <text>{initData.message}</text>
    </view>
  );
}

root.render(
  <InitDataProvider>
    <App />
  </InitDataProvider>
);`;

const apis = [
  { name: "root.render()", desc: "Render to Lynx page" },
  { name: "useInitData()", desc: "Get initData with auto re-render" },
  { name: "useGlobalProps()", desc: "Get globalProps reactively" },
  { name: "useMainThreadRef()", desc: "Create main-thread ref" },
  { name: "runOnMainThread()", desc: "Execute on main thread" },
  { name: "runOnBackground()", desc: "Execute on background" },
  { name: "useLynxGlobalEventListener()", desc: "Early event binding" },
  { name: "InitDataProvider", desc: "Context for initData" },
];

export const LynxSection = () => {
  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("gray.50", "gray.800");

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        {/* Left Section - Content */}
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          <VStack align="start" spacing="0">
            {/* Badge */}
            <Badge colorScheme="green" fontSize="xs" marginBottom="2">
              Cross-Platform
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
                Lynx
              </Heading>
              <Icon as={SmartphoneIcon} boxSize={{ base: "8", md: "10" }} color="purple.500" />
            </HStack>

            {/* Subtitle */}
            <Text fontSize="sm" color={subtleTextColor} marginTop="3">
              @my-react/react-lynx
            </Text>

            {/* Description */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              Build cross-platform native applications with Lynx's dual-thread architecture. Full React API compatibility with Lynx-specific APIs for native
              performance.
            </Text>

            {/* Features */}
            <VStack align="start" spacing="2" marginTop="6">
              <Text fontSize="sm" color={subtleTextColor}>
                <Text as="span" fontWeight="600">
                  Dual-Thread:
                </Text>{" "}
                Background thread for React, Main thread for native rendering
              </Text>
              <Text fontSize="sm" color={subtleTextColor}>
                <Text as="span" fontWeight="600">
                  React Compatible:
                </Text>{" "}
                Use your existing React knowledge and components
              </Text>
              <Text fontSize="sm" color={subtleTextColor}>
                <Text as="span" fontWeight="600">
                  Native Performance:
                </Text>{" "}
                Direct access to native APIs via worklets
              </Text>
            </VStack>

            {/* CTA Buttons */}
            <HStack spacing="3" marginTop="8">
              <Button
                as="a"
                href="https://lynxjs.org/"
                target="_blank"
                colorScheme="purple"
                size="md"
                rightIcon={<Icon as={ExternalLinkIcon} boxSize="4" />}
                _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                Lynx Docs
              </Button>
              <Button
                as="a"
                href="https://github.com/MrWangJustToDo/MyReact/tree/main/ui/lynx-example"
                target="_blank"
                variant="outline"
                colorScheme="purple"
                size="md"
                rightIcon={<Icon as={ExternalLinkIcon} boxSize="4" />}
                _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                View Example
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Right Section - Code */}
        <Section>
          <VStack spacing="4" align="stretch">
            {/* Config Code */}
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
                  [`lynx.config.ts`]: {
                    code: configCode,
                    active: true,
                  },
                }}
                theme={colorScheme}
              >
                <SandpackLayout style={{ border: "none" }}>
                  <SandpackCodeEditor readOnly style={{ height: "180px" }} />
                </SandpackLayout>
              </SandpackProvider>
            </Box>

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
                  [`index.tsx`]: {
                    code: appCode,
                    active: true,
                  },
                }}
                theme={colorScheme}
              >
                <SandpackLayout style={{ border: "none" }}>
                  <SandpackCodeEditor readOnly style={{ height: "320px" }} />
                </SandpackLayout>
              </SandpackProvider>
            </Box>
          </VStack>
        </Section>
      </Flex>

      {/* API Grid */}
      <Box marginX={{ base: "4", md: "6%", lg: "8%" }} marginTop="10">
        <Text fontSize="sm" fontWeight="600" color="gray.500" marginBottom="4">
          Lynx-Specific APIs
        </Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing="4">
          {apis.map((api) => (
            <Box key={api.name} padding="4" borderRadius="lg" backgroundColor={cardBg} border="1px solid" borderColor="cardBorderColor">
              <Text fontSize="sm" fontWeight="600" fontFamily="mono" color="purple.600" _dark={{ color: "purple.400" }}>
                {api.name}
              </Text>
              <Text fontSize="xs" color={subtleTextColor} marginTop="1">
                {api.desc}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
};
