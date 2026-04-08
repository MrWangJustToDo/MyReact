import { Box, Button, Container, Flex, Heading, Icon, Text, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import { SandpackCodeEditor, SandpackLayout, SandpackProvider } from "@codesandbox/sandpack-react";
import { ExternalLinkIcon } from "lucide-react";

import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";

const code = `// 1. install RSC packages
pnpm add @my-react/react-server
pnpm add -D @my-react/react-vite

// 2. configure Vite
import react from "@my-react/react-vite";

export default defineConfig({
  plugins: [
    react({
      rsc: true,
      rscEndpoint: "/__rsc",
      rscActionEndpoint: "/__rsc_action",
      ssr: {
        entryRsc: "/src/entry-rsc.tsx",
        entrySsr: "/src/entry-ssr.tsx",
      },
    }),
  ],
});

// 3. create entry-rsc + entry-ssr
// 4. run: pnpm dev`;

export const RscSection = () => {
  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          <VStack align="start" spacing="0">
            <Heading
              as="h2"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.1"
              color="orange.500"
              _dark={{ color: "orange.300" }}
            >
              RSC
            </Heading>

            <Text fontSize="sm" color={subtleTextColor} marginTop="3">
              @my-react/react-server + Flight streams
            </Text>

            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              Server Components with SSR + hydration. Decode Flight streams on the server and hydrate the same stream on the client.
            </Text>

            <HStack spacing="3" marginTop="8">
              <Button
                as="a"
                href="https://github.com/MrWangJustToDo/MyReact/tree/main/ui/rsc-example"
                target="_blank"
                colorScheme="orange"
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
                "rsc-setup.ts": {
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
    </Container>
  );
};
