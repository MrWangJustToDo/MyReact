import { Box, Button, Container, Flex, HStack, Heading, Icon, Spacer, Tag, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { HiChevronDoubleRight } from "react-icons/hi";
import { useLocation } from "react-router";

import { Section } from "@client/component";
import { Card } from "@client/component/Card";
import { NextPlayground } from "@client/component/NextPlayground";
import { CONTAINER_WIDTH } from "@client/config/container";
import { useIsMounted } from "@client/hooks";
import { mark } from "@client/utils/markdown";

// const Iframe = chakra("iframe");

const shellMd = `
\`\`\`js
// 1. create a Next.js project

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

// const Preview = (
//   <Iframe
//     title="@my-react online example"
//     allowFullScreen
//     marginX="auto"
//     width={{ base: "100%", md: "80%" }}
//     height="660"
//     outline="1px solid #252525"
//     borderRadius="4"
//     zIndex="100"
//     marginBottom="1em"
//     src="https://codesandbox.io/p/sandbox/zen-allen-mfwmmg?embed=1"
//   />
// );

export const NextSection = () => {
  const bgColor = useColorModeValue("gray.300", "gray.600");

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
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        <Box alignSelf="flex-start" marginRight={{ base: "1%", md: "2%", lg: "3%", "2xl": "4%" }} maxWidth={{ base: "100%", md: "42%" }}>
          <Heading as="h1" fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} marginTop="6">
            Quick start in <Tag fontSize="inherit">Next.js</Tag>
          </Heading>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            Currently version of @my-react not support React `RSC`.
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
        <Section>
          <Box
            className="typo"
            overflow={{ base: "hidden", lg: "auto" }}
            border="1px solid"
            borderColor="cardBorderColor"
            marginTop={{ base: "10%", md: "0" }}
            marginBottom={{ base: "6%" }}
            borderRadius="0.8em"
            fontSize={{ base: "sm", lg: "medium" }}
            boxShadow="lg"
            sx={{
              ["pre"]: {
                margin: "0",
              },
            }}
            dangerouslySetInnerHTML={{ __html: renderBody }}
          />
        </Section>
      </Flex>
      <Card ref={ref} overflow="hidden" marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        <Flex padding="1" fontFamily="monospace" alignItems="center" as="a" href="#next-section">
          <Icon as={HiChevronDoubleRight}></Icon>
          <Text marginLeft={2}>NextJS + @my-react</Text>
        </Flex>
        <NextPlayground />
      </Card>
    </Container>
  );
};
