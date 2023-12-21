import { Box, Button, Container, Flex, Heading, Spacer, Tag, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";

import { Section } from "@client/component";
import { CONTAINER_WIDTH } from "@client/config/container";
import { mark } from "@client/utils/markdown";

const shellMd = `
\`\`\`js
// 1. create a Vite React template

// 2. install @my-react
pnpm add @my-react/react @my-react/react-dom

pnpm add -D @my-react/react-refresh @my-react/react-vite

// 3. config vite.config.ts
import react from "@my-react/react-vite";

export default defineConfig({
  plugins: [react()],
});

// 4. start
pnpm run dev

\`\`\`
`;

const renderBody = mark.render(shellMd);

export const ViteSection = () => {
  const bgColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh">
      <Flex justifyContent="center" marginTop="4%" flexDirection={{ base: "column", md: "row" }}>
        <Box
          alignSelf="flex-start"
          marginLeft={{ base: "4%", md: "6%", lg: "8%" }}
          marginRight={{ base: "1%", md: "0" }}
          maxWidth={{ base: "100%", md: "40%" }}
        >
          <Heading as="h1" fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} marginTop="6">
            Quick start in <Tag fontSize="inherit">Vite</Tag>
          </Heading>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            This project is only a experimental project, not recommend use in the production environment.
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
            borderColor="cardBorderColor"
            marginRight={{ base: "4%", md: "16%" }}
            marginTop={{ base: "10%", md: "0" }}
            marginLeft={{ base: "4%", md: "1%" }}
            marginBottom={{ base: "6%" }}
            borderRadius="0.8em"
            fontSize={{ base: "sm", lg: "medium" }}
            sx={{
              ["pre"]: {
                margin: "0",
              },
            }}
            dangerouslySetInnerHTML={{ __html: renderBody }}
          />
        </Section>
      </Flex>
    </Container>
  );
};
