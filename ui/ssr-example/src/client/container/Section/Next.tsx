import { Box, Button, Container, Flex, HStack, Heading, Spacer, Tag, Text, Tooltip, chakra, useColorModeValue } from "@chakra-ui/react";

import { CONTAINER_WIDTH } from "@client/config/container";
import { mark } from "@client/utils/markdown";

const Iframe = chakra("iframe");

const shellMd = `
\`\`\`js
// 1. create a Next.js 12 project

// 2. install @my-react
pnpm add @my-react/react @my-react/react-dom

pnpm add -D @my-react/react-refresh @my-react/react-refresh-tools

// 3. config next.config.js
const withNext = require('@my-react/react-refresh-tools/withNext');

module.exports = withNext(nextConfig);

// 4. start
pnpm run dev

\`\`\`
`;

const renderBody = mark.render(shellMd);

const Preview = (
  <Iframe
    title="@my-react online example"
    allowFullScreen
    marginX="auto"
    width={{ base: "100%", md: "80%" }}
    height="660"
    outline="1px solid #252525"
    borderRadius="4"
    zIndex="100"
    marginBottom="1em"
    src="https://codesandbox.io/p/sandbox/zen-allen-mfwmmg?embed=1"
  />
);

export const NextSection = () => {
  const bgColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh">
      <Flex justifyContent="space-between" marginTop="4%" flexDirection={{ base: "column", md: "row" }}>
        <Box
          alignSelf="flex-start"
          marginLeft={{ base: "4%", md: "6%", lg: "8%" }}
          marginRight={{ base: "1%", md: "0" }}
          maxWidth={{ base: "100%", md: "40%" }}
        >
          <Heading as="h1" fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} marginTop="6">
            Quick start in <Tag fontSize="inherit">Next.js</Tag>
          </Heading>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            Currently not support Next.js 13+, also not support React `RSC`.
          </Text>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            This project is only a experimental project, not recommend use in the production environment.
          </Text>
          <Spacer marginTop="4" />
          <HStack>
            <Tooltip
              label={
                <Text>
                  A static <Tag>Next.js</Tag> site power by @my-react
                </Text>
              }
              hasArrow
              placement="top"
              bg={bgColor}
              color="black"
            >
              <Button as="a" href="https://mrwangjusttodo.github.io/MrWangJustToDo.io" colorScheme="purple" target="_blank">
                Online Example
              </Button>
            </Tooltip>
            <Tooltip
              label={
                <Text>
                  A <Tag>Next.js</Tag> template power by @my-react
                </Text>
              }
              hasArrow
              placement="top"
              bg={bgColor}
              color="black"
            >
              <Button as="a" href="https://github.com/MrWangJustToDo/MyReact/tree/main/ui/next-example" colorScheme="purple" target="_blank">
                Example
              </Button>
            </Tooltip>
          </HStack>
        </Box>
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
      </Flex>
      {Preview}
    </Container>
  );
};
