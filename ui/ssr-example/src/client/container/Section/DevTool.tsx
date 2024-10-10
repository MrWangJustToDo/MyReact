import { Box, Container, Flex, Heading, Tag, Text, Spacer, HStack, Tooltip, Button, useColorModeValue, Card, Image } from "@chakra-ui/react";

import { Section } from "@client/component";
import { CONTAINER_WIDTH } from "@client/config/container";
import { mark } from "@client/utils/markdown";

const shellMd = `
\`\`\`js
// 1. clone the @my-react devtool repo
git clone https://github.com/MrWangJustToDo/myreact-devtools.git

// 2. init project
pnpm install

// 3. prepare
pnpm run build:packages
pnpm run build:extension
// install this extension in chrome

// 4. start
pnpm run build:web

// 5. connect a @my-react app
// copy the connect command in the webUI into the @my-react app console

\`\`\`
`;

const renderBody = mark.render(shellMd);

export const DevToolSection = () => {
  const bgColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        <Box alignSelf="flex-start" marginRight={{ base: "1%", md: "2%", lg: "3%", "2xl": "4%" }} maxWidth={{ base: "100%", md: "42%" }}>
          <Heading as="h1" fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} marginTop="6">
            @my-react DevTool <Tag colorScheme="orange">Alpha</Tag>
          </Heading>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            A chrome extension help to debug <Tag>@my-react</Tag> app, just like <Tag>React DevTool</Tag>.
          </Text>
          <Spacer marginTop="4" />
          <HStack>
            <Tooltip
              label={
                <Text>
                  Goto <Tag>@my-react DevTool</Tag> project repo: https://github.com/MrWangJustToDo/myreact-devtools
                </Text>
              }
              hasArrow
              bg={bgColor}
              placement="top"
              color="black"
            >
              <Button as="a" href="https://github.com/MrWangJustToDo/myreact-devtools" colorScheme="purple" target="_blank">
                @my-react DevTool
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
                margin: "0 !important",
              },
            }}
            dangerouslySetInnerHTML={{ __html: renderBody }}
          />
        </Section>
      </Flex>
      <Flex justifyContent="center" width="100%">
        <Card overflow="hidden" marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }} width={{ md: "70%" }}>
          <Image src="./devtool.png" alt="devtool" />
        </Card>
      </Flex>
    </Container>
  );
};