import { Box, Button, Container, Flex, Heading, Icon, Spacer, Tag, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { ChevronsRightIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { Section } from "@client/component";
import { Card } from "@client/component/Card";
import { VitePlayground } from "@client/component/VitePlayground";
import { CONTAINER_WIDTH } from "@client/config/container";
import { useIsMounted } from "@client/hooks";

const code = `// 1. create a Vite React template

// 2. install @my-react
pnpm add @my-react/react @my-react/react-dom

pnpm add -D @my-react/react-refresh @my-react/react-vite

// 3. config vite.config.ts
import react from "@my-react/react-vite";

export default defineConfig({
  plugins: [react({
    // for remix
    // remix: true,

    // for react router v7
    // reactRouter: true,
  })],
});

// 4. start
pnpm run dev`;

export const ViteSection = () => {
  const bgColor = useColorModeValue("gray.300", "gray.600");

  const colorScheme = useColorModeValue("light", "dark");

  const { hash } = useLocation();

  const ref = useRef<HTMLDivElement>();

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted && hash && hash === "#vite-section") {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [hash, isMounted]);

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="space-around" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        <Box alignSelf="flex-start" marginRight={{ base: "1%", md: "2%", lg: "3%", "2xl": "4%" }} maxWidth={{ base: "100%", md: "42%" }}>
          <Heading as="h1" fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} marginTop="6">
            Quick start in <Tag fontSize="inherit">Vite</Tag>
          </Heading>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            This project is a experimental project.
          </Text>
          <Spacer marginTop="4" />
          <Tooltip
            label={
              <Text>
                A <Tag>Vite</Tag> template power by @my-react
              </Text>
            }
            hasArrow
            placement="top"
            bg={bgColor}
            color="black"
          >
            <Button as="a" href="https://github.com/MrWangJustToDo/MyReact/tree/main/ui/vite-example" colorScheme="purple" target="_blank">
              Example
            </Button>
          </Tooltip>
        </Box>
        <Section>
          <Box
            className="typo"
            overflow={{ base: "hidden", lg: "auto" }}
            border="1px solid"
            maxWidth={{ md: "55vw" }}
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
                [`main.bash`]: {
                  code,
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
        </Section>
      </Flex>
      <Card ref={ref} overflow="hidden" marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        <Flex padding="1" fontFamily="monospace" alignItems="center" as="a" href="#vite-section">
          <Icon as={ChevronsRightIcon}></Icon>
          <Text marginLeft={2}>Vite + @my-react</Text>
        </Flex>
        <VitePlayground />
        {/* <RspackPlayground /> */}
      </Card>
    </Container>
  );
};
